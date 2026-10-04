"""Small SQLite store with explicit, versioned migrations."""

import json
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from uuid import uuid4


MIGRATIONS = ["""
CREATE TABLE learners (
 id TEXT PRIMARY KEY, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE learning_sessions (
 id TEXT PRIMARY KEY, learner_id TEXT NOT NULL REFERENCES learners(id),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE questions (
 id TEXT PRIMARY KEY, concept TEXT NOT NULL, variant INTEGER NOT NULL,
 prompt TEXT NOT NULL, function_name TEXT NOT NULL, cases_json TEXT NOT NULL
);
CREATE TABLE attempts (
 id TEXT PRIMARY KEY, session_id TEXT NOT NULL REFERENCES learning_sessions(id),
 question_id TEXT NOT NULL REFERENCES questions(id), phase TEXT NOT NULL,
 parent_attempt_id TEXT REFERENCES attempts(id), code TEXT NOT NULL,
 reasoning TEXT NOT NULL DEFAULT '', run_json TEXT NOT NULL,
 status TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE diagnoses (
 attempt_id TEXT PRIMARY KEY REFERENCES attempts(id), label TEXT NOT NULL,
 misconception TEXT, confidence TEXT NOT NULL, evidence TEXT NOT NULL,
 explanation TEXT NOT NULL, needs_more_evidence INTEGER NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE interventions (
 id TEXT PRIMARY KEY, attempt_id TEXT NOT NULL UNIQUE REFERENCES attempts(id),
 label TEXT NOT NULL, title TEXT NOT NULL, explanation TEXT NOT NULL,
 hint TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE assessments (
 parent_attempt_id TEXT PRIMARY KEY REFERENCES attempts(id),
 status TEXT NOT NULL, evidence TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE misconception_events (
 id TEXT PRIMARY KEY, learner_id TEXT NOT NULL REFERENCES learners(id),
 attempt_id TEXT NOT NULL REFERENCES attempts(id), label TEXT NOT NULL,
 status TEXT NOT NULL, evidence TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_attempts_parent ON attempts(parent_attempt_id);
CREATE INDEX idx_attempts_session ON attempts(session_id);
CREATE INDEX idx_events_learner ON misconception_events(learner_id, label, created_at);
""", """
CREATE UNIQUE INDEX idx_probe_unique ON attempts(parent_attempt_id, question_id)
 WHERE parent_attempt_id IS NOT NULL;
"""]


class Store:
    def __init__(self, path: str):
        self.path = path
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        self.migrate()

    @contextmanager
    def connect(self):
        db = sqlite3.connect(self.path)
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA foreign_keys=ON")
        try:
            yield db
            db.commit()
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def migrate(self):
        with self.connect() as db:
            version = db.execute("PRAGMA user_version").fetchone()[0]
            for index in range(version, len(MIGRATIONS)):
                db.executescript(MIGRATIONS[index])
                db.execute(f"PRAGMA user_version={index + 1}")

    def seed_questions(self, questions):
        with self.connect() as db:
            for q in questions.values():
                db.execute("INSERT OR IGNORE INTO questions VALUES (?,?,?,?,?,?)",
                           (q.id, q.concept, q.variant, q.prompt, q.function, json.dumps(q.cases)))


def new_id() -> str:
    return str(uuid4())
