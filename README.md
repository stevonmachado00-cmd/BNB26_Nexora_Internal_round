# Re:Learn — AI-Powered Python Misconception Tutor

Re:Learn is a learning platform for introductory Python that goes beyond marking a program right or wrong. A learner submits code, the backend sends the exact submission and question context to a local language model, and the system returns a structured misconception diagnosis, explanation, and next learning step.

This project was built for the BNB26 Nexora internal round.

## What the prototype demonstrates

- A Python-focused curriculum with a Variables and Data Types introduction and real starter questions.
- A React workbench for writing a solution and submitting it for diagnosis.
- A FastAPI backend that stores learners, sessions, attempts, diagnoses, interventions, and reassessments in SQLite.
- A structured misconception workflow: initial attempt → diagnosis → targeted intervention → two transfer probes → resolution assessment.
- Local model integration through LM Studio's OpenAI-compatible server, configured for `google/gemma-4-e2b`.
- A deliberate safety boundary: this version does **not** execute untrusted learner code. The UI labels code submission as model diagnosis rather than pretending to run Python.

## Repository layout

```
.
├── frontend/     # React + Vite + TypeScript learner interface
└── backend/      # FastAPI API, SQLite storage, curriculum, and model adapter
```

## System flow

1. The learner selects a Python module and a question.
2. They write code in the workbench and select **Diagnose**.
3. The frontend posts the exact code and question ID to the backend.
4. The backend parses syntax, records the attempt, and requests a structured diagnosis from the local model.
5. The interface displays only the model's returned diagnosis. It does not manufacture compiler output, test results, or execution traces.
6. When a diagnosis is specific enough, the backend serves a matching intervention and transfer questions. Resolution requires evidence across the follow-up attempts.

## Quick start

### 1. Start the backend

Requirements: Python 3.10+.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API is available at `http://127.0.0.1:8000`; interactive API documentation is at `http://127.0.0.1:8000/docs`.

### 2. Start the frontend

Requirements: Node.js 20+.

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite address shown in the terminal (normally `http://127.0.0.1:5180`).

### 3. Enable local model diagnosis (optional)

1. Load `google/gemma-4-e2b` in LM Studio.
2. Start LM Studio's local server on port `1234`.
3. Verify the connection at `GET http://127.0.0.1:8000/api/v1/model/status`.

The backend uses `http://127.0.0.1:1234/v1` by default. Configure another endpoint or identifier with `RELEARN_LM_STUDIO_URL` and `RELEARN_LM_STUDIO_MODEL`.

Without a loaded local model, attempts are still recorded but remain awaiting diagnosis. This is intentional: Re:Learn never replaces missing model feedback with hard-coded feedback.

## Evaluation-oriented design

The backend keeps the model output constrained to a small misconception-label set and stores the model evidence, confidence, and explanation for every attempt. A misconception is not automatically marked resolved from one correct-looking response: the API uses separate transfer probes and a resolution-assessment step.

The current question bank and labels are starter material for the prototype. Before classroom deployment, the dataset and labels should be reviewed by Python educators and evaluated on unseen learner submissions.

## Development checks

```powershell
# Backend
cd backend
pytest -q

# Frontend
cd frontend
npm run build
```

## Privacy and repository hygiene

No API keys, model files, local SQLite learner data, virtual environments, downloaded datasets, or model weights are included in this repository. The local model runs through LM Studio and is not uploaded by this project.
