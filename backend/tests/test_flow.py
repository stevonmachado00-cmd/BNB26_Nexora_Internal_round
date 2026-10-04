import tempfile
from pathlib import Path

from fastapi.testclient import TestClient

from app.main import create_app
from app.model import Diagnosis, Resolution, UnavailableModel
from app.catalog import BY_CONCEPT_VARIANT


class FakeRunner:
    def run(self, code, question, reported_result=None):
        return {"status": "completed", "passed": code.startswith("PASS"),
                "cases": [{"passed": code.startswith("PASS"), "actual": "same wrong result"}]}


class FakeModel:
    def diagnose(self, *, question, learner_code, observed_result):
        if "AMBIGUOUS" in learner_code:
            return Diagnosis("unknown_or_ambiguous", None, "low", "Code alone is inconclusive",
                             "Explain your reasoning", True)
        label = "range_starts_at_one" if "RANGE" in learner_code else "list_index_starts_at_one"
        return Diagnosis(label, "incorrect boundary", "high", "Learner reasoning and code identify the boundary",
                         "Review the first value", False)

    def assess_resolution(self, *, diagnosis, initial_question, initial_code, probes):
        if all(p["observed_result"]["passed"] and "0" in p["reasoning"] for p in probes):
            return Resolution("resolved", "Two distinct tasks and explanations demonstrate zero-based reasoning")
        return Resolution("unresolved", "The transfer evidence does not show the concept consistently")


def client(model=None):
    temp = tempfile.TemporaryDirectory()
    app = create_app(db_path=str(Path(temp.name) / "test.sqlite3"),
                     model=model if model is not None else UnavailableModel(), runner=FakeRunner())
    return temp, TestClient(app)


def start(api):
    response = api.post("/api/v1/sessions", json={"learner_id": "student-1"})
    assert response.status_code == 201
    return response.json()["id"]


def submit(api, session, code, question=None):
    question = question or BY_CONCEPT_VARIANT[("range_starts_at_one", 0)].id
    response = api.post(f"/api/v1/sessions/{session}/attempts",
                        json={"question_id": question, "code": code})
    assert response.status_code == 201, response.text
    return response.json()


def test_unavailable_model_keeps_attempt_pending():
    temp, api = client()
    try:
        session = start(api)
        attempt = submit(api, session, "FAIL")
        assert attempt["status"] == "pending_diagnosis"
        assert attempt["diagnosis"] is None
        assert api.get(f"/api/v1/attempts/{attempt['id']}/intervention").status_code == 409
        assert api.get("/api/v1/learners/student-1/profile").json()["history"] == []
    finally:
        temp.cleanup()


def test_different_causes_and_reassessment():
    temp, api = client(FakeModel())
    try:
        session = start(api)
        first = submit(api, session, "FAIL RANGE")
        second = submit(api, session, "FAIL INDEX")
        assert first["run"] == second["run"]
        assert first["diagnosis"]["diagnosis"] == "range_starts_at_one"
        assert second["diagnosis"]["diagnosis"] == "list_index_starts_at_one"
        second_intervention = api.get(f"/api/v1/attempts/{second['id']}/intervention").json()
        assert second_intervention["next_question"]["id"] == BY_CONCEPT_VARIANT[("list_index_starts_at_one", 1)].id
        intervention = api.get(f"/api/v1/attempts/{first['id']}/intervention").json()
        assert intervention["next_question"]["variant"] == 1
        first_probe = api.post(f"/api/v1/attempts/{first['id']}/probes",
                               json={"code": "PASS", "reasoning": "The sequence starts at 0."})
        assert first_probe.status_code == 201
        assert first_probe.json()["assessment_status"] == "needs_more_evidence"
        assert first_probe.json()["next_question"]["variant"] == 2
        second_probe = api.post(f"/api/v1/attempts/{first['id']}/probes",
                                json={"code": "PASS", "reasoning": "The first index is 0."})
        assert second_probe.json()["assessment_status"] == "resolved"
        profile = api.get("/api/v1/learners/student-1/profile").json()
        assert profile["misconceptions"]["range_starts_at_one"] == "resolved"
        assert len(profile["history"]) == 3
        assert api.post(f"/api/v1/attempts/{first['id']}/probes",
                        json={"code": "PASS", "reasoning": "I know zero."}).status_code == 409
    finally:
        temp.cleanup()


def test_ambiguous_and_correct_answer_with_flawed_reasoning():
    temp, api = client(FakeModel())
    try:
        session = start(api)
        ambiguous = submit(api, session, "FAIL AMBIGUOUS")
        assert ambiguous["status"] == "needs_more_evidence"
        assert api.get(f"/api/v1/attempts/{ambiguous['id']}/intervention").status_code == 409
        initial = submit(api, session, "FAIL RANGE")
        for reasoning in ["I guessed the output.", "I used a memorized answer."]:
            response = api.post(f"/api/v1/attempts/{initial['id']}/probes",
                                json={"code": "PASS", "reasoning": reasoning})
            assert response.status_code == 201
        assert response.json()["assessment_status"] == "unresolved"
        assert api.get("/api/v1/learners/student-1/profile").json()["misconceptions"]["range_starts_at_one"] == "unresolved"
        recurring = submit(api, session, "FAIL RANGE")
        assert recurring["diagnosis"]["diagnosis"] == "range_starts_at_one"
        history = api.get("/api/v1/learners/student-1/profile").json()["history"]
        assert [item["status"] for item in history if item["label"] == "range_starts_at_one"] == ["identified", "unresolved", "identified"]
    finally:
        temp.cleanup()


def test_catalog_matches_manifest():
    import json
    from app.catalog import QUESTIONS

    manifest = json.loads((Path(__file__).resolve().parents[2] / "datasets" / "relearn" / "manifest.json").read_text())
    labels = {item["label"] for item in manifest["selected_misconceptions"]}
    assert {q.concept for q in QUESTIONS.values()} == labels
    assert len(QUESTIONS) == len(labels) * 3
    assert all(q.cases for q in QUESTIONS.values())


def test_openapi_and_persisted_session():
    temp, api = client()
    try:
        assert api.get("/docs").status_code == 200
        session = start(api)
        attempt = submit(api, session, "FAIL")
        second_app = create_app(db_path=str(Path(temp.name) / "test.sqlite3"),
                                model=UnavailableModel(), runner=FakeRunner())
        second_api = TestClient(second_app)
        assert second_api.get(f"/api/v1/attempts/{attempt['id']}").json()["status"] == "pending_diagnosis"
        questions = second_api.get("/api/v1/questions").json()
        assert len(questions) == 10
        assert all("concept" not in q and "range_starts_at_one" not in q["id"] for q in questions)
    finally:
        temp.cleanup()


def test_unverified_code_cannot_resolve_misconception():
    class OptimisticModel(FakeModel):
        def assess_resolution(self, **kwargs):
            return Resolution("resolved", "The explanation looks plausible")

    temp = tempfile.TemporaryDirectory()
    try:
        app = create_app(db_path=str(Path(temp.name) / "test.sqlite3"), model=OptimisticModel())
        api = TestClient(app)
        session = start(api)
        initial = submit(api, session, "# RANGE\ndef sum_through(n):\n return 0")
        for _ in range(2):
            response = api.post(f"/api/v1/attempts/{initial['id']}/probes",
                                json={"code": "def answer(n):\n return n", "reasoning": "I start counting at 0."})
            assert response.status_code == 201
        assert response.json()["assessment_status"] == "needs_more_evidence"
    finally:
        temp.cleanup()
