# Re:Learn local backend

This service records introductory Python learning sessions, checks submitted code for syntax, and connects to Gemma 4 E2B through LM Studio for diagnosis and transfer assessment. The model is served by LM Studio only when a diagnosis request arrives. The fake model and trusted test runner exist only in tests.

## Local setup

From `backend/` on Windows PowerShell, create the model-ready environment. This machine already has CPU PyTorch installed in Python 3.10, so `--system-site-packages` reuses it while keeping the compatible Hugging Face Hub version inside this backend environment:

```powershell
& 'C:\Users\ken\AppData\Local\Programs\Python\Python310\python.exe' -m venv --system-site-packages .venv-model
.\.venv-model\Scripts\python.exe -m pip install -r requirements.txt -r requirements-model.txt
.\.venv-model\Scripts\python.exe -m uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs` for the interactive API. SQLite is created at `backend/data/relearn.sqlite3`; the store applies its versioned schema migration automatically. Set `RELEARN_DB` to an alternate SQLite path if needed. Demo learner IDs are not authentication.

Load `google/gemma-4-e2b` in LM Studio and start its local server on port `1234`. The API detects that endpoint automatically and does **not** load weights itself. `/api/v1/model/status` reports whether LM Studio has been reached successfully. Set `RELEARN_LM_STUDIO_URL` or `RELEARN_LM_STUDIO_MODEL` if either setting differs. No model inference is needed to start the API or run the tests.

For model inference, use a Python environment with `requirements.txt` installed. Gemma 4 E2B is a base model, not a Re:Learn fine-tune; its misconception labels should be treated as provisional until evaluated. No LoRA adapter is used by this backend. For a frontend on a different local port, set comma-separated `RELEARN_CORS_ORIGINS` before starting the server. Set `RELEARN_MODEL_BACKEND=transformers` only if you intentionally want the older direct Gemma 3 loader.

## Example flow

```powershell
$session = Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/api/v1/sessions -ContentType application/json -Body '{"learner_id":"demo-1"}'
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/v1/questions
$body = @{ question_id = 'py01-0'; code = "def sum_through(n):`n    return sum(range(n))"; observed_result = 'For n=5, this returned 10' } | ConvertTo-Json
$attempt = Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8000/api/v1/sessions/$($session.id)/attempts" -ContentType application/json -Body $body
$attempt
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/v1/learners/demo-1/profile
```

The attempt returns syntax evidence and `pending_diagnosis`. The optional `observed_result` is a learner report and is explicitly marked unverified. Once a real model is connected, `POST /api/v1/attempts/{id}/diagnose` can process older pending attempts. A specific diagnosis creates a curated intervention at `GET /api/v1/attempts/{id}/intervention`. Submit code and an explanation for each transfer task to `POST /api/v1/attempts/{id}/probes`; `POST /api/v1/attempts/{id}/assess` retries a pending assessment after the model becomes available. `GET /api/v1/sessions/{id}/attempts` lists saved attempts, including ones awaiting retry.

The `app.model.ModelAdapter` protocol is the integration point. Its `diagnose` input is question, learner code, and observed result metadata; its output matches the dataset's diagnosis JSON. Its `assess_resolution` input includes the original diagnosis plus both transfer attempts and explanations. Without a trusted evaluator, the backend will not mark a misconception `resolved`, even if the model proposes it. A future trusted code runner can be connected through the same runner interface.

The curated question bank is in `app/catalog.py`, independent of the training/validation/test JSONL files. Questions and interventions should be reviewed by a Python instructor before use with learners.

## Code handling

The backend never executes learner code. It uses `ast.parse` to report syntax errors and stores optional learner-reported output as unverified evidence. The curated question bank contains test cases for a later trusted runner, but those cases are not executed in this local version.

## Tests

```powershell
.\.venv-model\Scripts\python.exe -m pytest -q
```

The API tests use a fake model and trusted test runner to verify orchestration. Separate tests confirm that the default intake parses syntax and does not execute code.
