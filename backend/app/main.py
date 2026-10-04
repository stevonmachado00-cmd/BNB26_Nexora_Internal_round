"""Re:Learn local API."""

import json
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .catalog import BY_CONCEPT_VARIANT, LABELS, MODULE_QUESTIONS, QUESTIONS, SPECS, intervention_for
from .db import Store, new_id
from .gemma import configured_model
from .model import Diagnosis, ModelUnavailable, UnavailableModel
from .runner import StaticIntake, RunnerUnavailable


class StartSession(BaseModel):
    learner_id: str = Field(min_length=1, max_length=80, pattern=r"^[A-Za-z0-9_-]+$")


class Submission(BaseModel):
    question_id: str
    code: str = Field(min_length=1, max_length=10000)
    reasoning: str = Field(default="", max_length=2000)
    observed_result: str | None = Field(default=None, max_length=2000)


class ProbeSubmission(BaseModel):
    code: str = Field(min_length=1, max_length=10000)
    reasoning: str = Field(min_length=5, max_length=2000)
    observed_result: str | None = Field(default=None, max_length=2000)


def create_app(*, db_path: str | None = None, model=None, runner=None) -> FastAPI:
    if db_path is None:
        db_path = os.environ.get("RELEARN_DB", str(Path(__file__).resolve().parents[1] / "data" / "relearn.sqlite3"))
    store = Store(db_path)
    all_questions = {**QUESTIONS, **MODULE_QUESTIONS}
    store.seed_questions(all_questions)
    model = model if model is not None else (configured_model() or UnavailableModel())
    runner = runner or StaticIntake()
    app = FastAPI(title="Re:Learn", version="0.1.0")
    origins = os.environ.get(
        "RELEARN_CORS_ORIGINS",
        "http://localhost:3000,http://localhost:5173,http://localhost:5180,"
        "http://127.0.0.1:3000,http://127.0.0.1:5173,http://127.0.0.1:5180",
    )
    app.add_middleware(CORSMiddleware, allow_origins=[item.strip() for item in origins.split(",") if item.strip()],
                       allow_methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])
    app.state.store = store
    app.state.model_error = None

    def fetch(db, table: str, key: str):
        row = db.execute(f"SELECT * FROM {table} WHERE id=?", (key,)).fetchone()
        if row is None:
            raise HTTPException(404, f"{table[:-1]} not found")
        return row

    def question_view(q):
        return {"id": q.id, "variant": q.variant,
                "prompt": q.prompt, "function": q.function, "cases": q.cases}

    def attempt_view(db, attempt_id):
        attempt = fetch(db, "attempts", attempt_id)
        diagnosis = db.execute("SELECT * FROM diagnoses WHERE attempt_id=?", (attempt_id,)).fetchone()
        diagnosis_view = None if diagnosis is None else {
            "diagnosis": diagnosis["label"], "misconception": diagnosis["misconception"],
            "confidence": diagnosis["confidence"], "evidence": diagnosis["evidence"],
            "explanation": diagnosis["explanation"],
            "needs_more_evidence": bool(diagnosis["needs_more_evidence"]),
        }
        return {"id": attempt["id"], "session_id": attempt["session_id"],
                "question_id": attempt["question_id"], "phase": attempt["phase"],
                "parent_attempt_id": attempt["parent_attempt_id"],
                "code": attempt["code"], "reasoning": attempt["reasoning"],
                "run": json.loads(attempt["run_json"]), "status": attempt["status"],
                "diagnosis": diagnosis_view}

    def record_diagnosis(db, attempt, prediction: Diagnosis):
        if prediction.diagnosis not in LABELS or not prediction.evidence.strip():
            raise HTTPException(502, "Model returned an invalid diagnosis")
        if prediction.confidence not in {"high", "medium", "low"}:
            raise HTTPException(502, "Model returned an invalid confidence")
        db.execute("INSERT INTO diagnoses (attempt_id,label,misconception,confidence,evidence,explanation,needs_more_evidence) VALUES (?,?,?,?,?,?,?)",
                   (attempt["id"], prediction.diagnosis, prediction.misconception,
                    prediction.confidence, prediction.evidence, prediction.explanation,
                    int(prediction.needs_more_evidence)))
        if prediction.diagnosis in SPECS and not prediction.needs_more_evidence:
            content = intervention_for(prediction.diagnosis)
            db.execute("INSERT INTO interventions (id,attempt_id,label,title,explanation,hint) VALUES (?,?,?,?,?,?)",
                       (new_id(), attempt["id"], prediction.diagnosis, content["title"],
                        content["explanation"], content["hint"]))
            status = "needs_intervention"
            session = fetch(db, "learning_sessions", attempt["session_id"])
            db.execute("INSERT INTO misconception_events (id,learner_id,attempt_id,label,status,evidence) VALUES (?,?,?,?,?,?)",
                       (new_id(), session["learner_id"], attempt["id"], prediction.diagnosis,
                        "identified", prediction.evidence))
        elif prediction.diagnosis == "correct_understanding":
            status = "completed" if json.loads(attempt["run_json"]).get("result_verified") else "needs_more_evidence"
        else:
            status = "needs_more_evidence"
        db.execute("UPDATE attempts SET status=? WHERE id=?", (status, attempt["id"]))

    def diagnose(db, attempt_id):
        attempt = fetch(db, "attempts", attempt_id)
        if attempt["phase"] != "initial":
            raise HTTPException(409, "Only initial attempts receive a diagnosis")
        if db.execute("SELECT 1 FROM diagnoses WHERE attempt_id=?", (attempt_id,)).fetchone():
            return
        q = all_questions[attempt["question_id"]]
        try:
            prediction = model.diagnose(question=q.prompt, learner_code=attempt["code"],
                                        observed_result=json.loads(attempt["run_json"]))
        except ModelUnavailable as exc:
            app.state.model_error = str(exc)[:500]
            return
        app.state.model_error = None
        record_diagnosis(db, attempt, prediction)

    def next_probe(db, parent):
        count = db.execute("SELECT COUNT(*) FROM attempts WHERE parent_attempt_id=?", (parent["id"],)).fetchone()[0]
        if count >= 2:
            return None
        diagnosis = db.execute("SELECT label FROM diagnoses WHERE attempt_id=?", (parent["id"],)).fetchone()
        if diagnosis is None or diagnosis["label"] not in SPECS:
            return None
        return BY_CONCEPT_VARIANT[(diagnosis["label"], count + 1)]

    def assess(db, parent):
        existing = db.execute("SELECT status FROM assessments WHERE parent_attempt_id=?", (parent["id"],)).fetchone()
        if existing is not None:
            return existing["status"]
        probes = db.execute("SELECT * FROM attempts WHERE parent_attempt_id=? ORDER BY created_at, rowid",
                            (parent["id"],)).fetchall()
        if len(probes) < 2:
            return "needs_more_evidence"
        diagnosis_row = db.execute("SELECT * FROM diagnoses WHERE attempt_id=?", (parent["id"],)).fetchone()
        diagnosis = Diagnosis(diagnosis_row["label"], diagnosis_row["misconception"],
                              diagnosis_row["confidence"], diagnosis_row["evidence"],
                              diagnosis_row["explanation"], bool(diagnosis_row["needs_more_evidence"]))
        evidence = [{"question": all_questions[p["question_id"]].prompt, "code": p["code"],
                     "reasoning": p["reasoning"], "observed_result": json.loads(p["run_json"])}
                    for p in probes]
        try:
            result = model.assess_resolution(diagnosis=diagnosis,
                                             initial_question=all_questions[parent["question_id"]].prompt,
                                             initial_code=parent["code"], probes=evidence)
        except ModelUnavailable as exc:
            app.state.model_error = str(exc)[:500]
            return "pending_assessment"
        app.state.model_error = None
        if result.status not in {"resolved", "unresolved", "needs_more_evidence"} or not result.evidence.strip():
            raise HTTPException(502, "Model returned an invalid assessment")
        pass_values = [json.loads(p["run_json"]).get("passed") for p in probes]
        status = result.status
        if status == "resolved" and not all(value is True for value in pass_values):
            status = "unresolved" if any(value is False for value in pass_values) else "needs_more_evidence"
        db.execute("INSERT OR REPLACE INTO assessments (parent_attempt_id,status,evidence) VALUES (?,?,?)",
                   (parent["id"], status, result.evidence))
        db.execute("UPDATE attempts SET status=? WHERE id=?", (status, parent["id"]))
        session = fetch(db, "learning_sessions", parent["session_id"])
        db.execute("INSERT INTO misconception_events (id,learner_id,attempt_id,label,status,evidence) VALUES (?,?,?,?,?,?)",
                   (new_id(), session["learner_id"], parent["id"], diagnosis.diagnosis, status, result.evidence))
        return status

    @app.get("/health")
    def health():
        return {"status": "ok"}

    @app.get("/api/v1/model/status")
    def model_status():
        return {"configured": not isinstance(model, UnavailableModel),
                "loaded": bool(getattr(model, "loaded", False)),
                "type": getattr(model, "model_name", "gemma-3-1b-it" if hasattr(model, "model_path") else "custom_or_unavailable"),
                "last_error": app.state.model_error}

    @app.get("/api/v1/questions")
    def list_questions(topic: str | None = Query(default=None, max_length=40)):
        topic_labels = {
            "variables": {"variables_data_types"},
            "conditions": {"assignment_used_for_comparison", "return_does_not_stop_execution"},
            "lists": {"list_assignment_copies", "list_index_starts_at_one", "sorted_modifies_list_in_place", "list_reverse_returns_list"},
            "loops": {"range_starts_at_one", "changing_loop_variable_changes_iteration"},
            "functions": {"print_instead_of_return", "function_local_scope"},
        }
        if topic == "variables":
            return [question_view(q) for q in MODULE_QUESTIONS.values()]
        permitted = topic_labels.get(topic or "")
        return [question_view(q) for q in QUESTIONS.values()
                if q.variant == 0 and (permitted is None or q.concept in permitted)]

    @app.get("/api/v1/questions/{question_id}")
    def get_question(question_id: str):
        q = all_questions.get(question_id)
        if q is None:
            raise HTTPException(404, "question not found")
        return question_view(q)

    @app.post("/api/v1/sessions", status_code=201)
    def start_session(body: StartSession):
        session_id = new_id()
        with store.connect() as db:
            db.execute("INSERT OR IGNORE INTO learners (id) VALUES (?)", (body.learner_id,))
            db.execute("INSERT INTO learning_sessions (id,learner_id) VALUES (?,?)",
                       (session_id, body.learner_id))
        return {"id": session_id, "learner_id": body.learner_id}

    @app.post("/api/v1/sessions/{session_id}/attempts", status_code=201)
    def submit_attempt(session_id: str, body: Submission):
        q = all_questions.get(body.question_id)
        if q is None or q.variant != 0:
            raise HTTPException(404, "initial question not found")
        with store.connect() as db:
            fetch(db, "learning_sessions", session_id)
        try:
            run = runner.run(body.code, q, body.observed_result)
        except RunnerUnavailable as exc:
            raise HTTPException(503, str(exc)) from exc
        attempt_id = new_id()
        with store.connect() as db:
            db.execute("INSERT INTO attempts (id,session_id,question_id,phase,code,reasoning,run_json,status) VALUES (?,?,?,?,?,?,?,?)",
                       (attempt_id, session_id, q.id, "initial", body.code, body.reasoning,
                        json.dumps(run), "pending_diagnosis"))
        with store.connect() as db:
            diagnose(db, attempt_id)
            return attempt_view(db, attempt_id)

    @app.get("/api/v1/sessions/{session_id}/attempts")
    def list_attempts(session_id: str):
        with store.connect() as db:
            fetch(db, "learning_sessions", session_id)
            ids = [row["id"] for row in db.execute(
                "SELECT id FROM attempts WHERE session_id=? ORDER BY rowid", (session_id,))]
            return [attempt_view(db, attempt_id) for attempt_id in ids]

    @app.get("/api/v1/attempts/{attempt_id}")
    def get_attempt(attempt_id: str):
        with store.connect() as db:
            return attempt_view(db, attempt_id)

    @app.post("/api/v1/attempts/{attempt_id}/diagnose")
    def retry_diagnosis(attempt_id: str):
        with store.connect() as db:
            diagnose(db, attempt_id)
            return attempt_view(db, attempt_id)

    @app.get("/api/v1/attempts/{attempt_id}/intervention")
    def get_intervention(attempt_id: str):
        with store.connect() as db:
            parent = fetch(db, "attempts", attempt_id)
            row = db.execute("SELECT * FROM interventions WHERE attempt_id=?", (attempt_id,)).fetchone()
            if row is None:
                raise HTTPException(409, "No intervention is available for this attempt")
            assessment = db.execute("SELECT status,evidence FROM assessments WHERE parent_attempt_id=?", (attempt_id,)).fetchone()
            q = next_probe(db, parent)
            return {"id": row["id"], "label": row["label"], "title": row["title"],
                    "explanation": row["explanation"], "hint": row["hint"],
                    "next_question": question_view(q) if q else None,
                    "assessment": dict(assessment) if assessment else None}

    @app.post("/api/v1/attempts/{attempt_id}/probes", status_code=201)
    def submit_probe(attempt_id: str, body: ProbeSubmission):
        with store.connect() as db:
            parent = fetch(db, "attempts", attempt_id)
            if not db.execute("SELECT 1 FROM interventions WHERE attempt_id=?", (attempt_id,)).fetchone():
                raise HTTPException(409, "Diagnosis and intervention required first")
            q = next_probe(db, parent)
            if q is None:
                raise HTTPException(409, "Both transfer questions have been answered")
        try:
            run = runner.run(body.code, q, body.observed_result)
        except RunnerUnavailable as exc:
            raise HTTPException(503, str(exc)) from exc
        probe_id = new_id()
        with store.connect() as db:
            db.execute("BEGIN IMMEDIATE")
            current = next_probe(db, parent)
            if current is None or current.id != q.id:
                raise HTTPException(409, "The next transfer question has changed; refresh the intervention")
            db.execute("INSERT INTO attempts (id,session_id,question_id,phase,parent_attempt_id,code,reasoning,run_json,status) VALUES (?,?,?,?,?,?,?,?,?)",
                       (probe_id, parent["session_id"], q.id, "transfer", attempt_id,
                        body.code, body.reasoning, json.dumps(run), "completed"))
        with store.connect() as db:
            assessment_status = assess(db, parent)
            return {"attempt": attempt_view(db, probe_id), "assessment_status": assessment_status,
                    "next_question": question_view(next_probe(db, parent)) if next_probe(db, parent) else None}

    @app.post("/api/v1/attempts/{attempt_id}/assess")
    def retry_assessment(attempt_id: str):
        with store.connect() as db:
            parent = fetch(db, "attempts", attempt_id)
            if not db.execute("SELECT 1 FROM interventions WHERE attempt_id=?", (attempt_id,)).fetchone():
                raise HTTPException(409, "Diagnosis and intervention required first")
            return {"status": assess(db, parent)}

    @app.get("/api/v1/learners/{learner_id}/profile")
    def learner_profile(learner_id: str):
        with store.connect() as db:
            fetch(db, "learners", learner_id)
            events = [dict(row) for row in db.execute(
                "SELECT label,status,evidence,attempt_id,created_at FROM misconception_events WHERE learner_id=? ORDER BY rowid",
                (learner_id,))]
            current = {}
            for event in events:
                current[event["label"]] = event["status"]
            return {"learner_id": learner_id, "misconceptions": current, "history": events}

    return app


app = create_app()
