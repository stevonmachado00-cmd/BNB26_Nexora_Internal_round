"""Lazy local Gemma 3 inference; no learner code is executed here."""

import json
import os
from pathlib import Path
from threading import Lock
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from .catalog import SPECS
from .model import Diagnosis, ModelUnavailable, Resolution


class GemmaLocalAdapter:
    def __init__(self, model_path: str):
        self.model_path = Path(model_path)
        self._model = None
        self._tokenizer = None
        self._torch = None
        self._lock = Lock()

    @property
    def loaded(self) -> bool:
        return self._model is not None

    def _ensure_loaded(self):
        if self.loaded:
            return
        if not (self.model_path / "model.safetensors").is_file():
            raise ModelUnavailable(f"Gemma weights not found at {self.model_path}")
        try:
            os.environ.setdefault("USE_TF", "0")
            import torch
            from transformers import AutoTokenizer, Gemma3ForCausalLM
        except ImportError as exc:
            raise ModelUnavailable("Install requirements-model.txt in the backend environment") from exc
        try:
            tokenizer = AutoTokenizer.from_pretrained(str(self.model_path), local_files_only=True)
            model = Gemma3ForCausalLM.from_pretrained(
                str(self.model_path), local_files_only=True, dtype="auto", low_cpu_mem_usage=True
            ).eval()
        except ModelUnavailable:
            raise
        except Exception as exc:
            raise ModelUnavailable(f"Could not load local Gemma: {type(exc).__name__}: {exc}") from exc
        self._torch, self._tokenizer, self._model = torch, tokenizer, model

    @staticmethod
    def _json_object(raw: str) -> dict:
        decoder = json.JSONDecoder()
        for index, char in enumerate(raw):
            if char != "{":
                continue
            try:
                obj, _ = decoder.raw_decode(raw[index:])
            except json.JSONDecodeError:
                continue
            # The prompt includes observed-result metadata, which itself can be
            # JSON.  Do not mistake that embedded input for the model's answer.
            # A diagnosis object always has `diagnosis`; a resolution object has
            # both `status` and `evidence`.
            if isinstance(obj, dict) and (
                "diagnosis" in obj or ("status" in obj and "evidence" in obj)
            ):
                return obj
        # Some local Gemma runtimes render an otherwise structured response as
        # one `key: value` field per line. Accept only the known scalar fields;
        # never infer missing fields or execute model-provided content.
        fields = {}
        expected = {"diagnosis", "misconception", "confidence", "evidence", "explanation",
                    "needs_more_evidence", "status"}
        for line in raw.splitlines():
            key, separator, value = line.partition(":")
            key = key.strip().lower()
            if separator and key in expected and value.strip():
                fields[key] = value.strip().strip('"')
        if fields.get("needs_more_evidence", "").lower() in {"true", "false"}:
            fields["needs_more_evidence"] = fields["needs_more_evidence"].lower() == "true"
        if fields:
            return fields
        raise ModelUnavailable("Gemma did not return a valid JSON object")

    def _generate(self, prompt: str) -> dict:
        with self._lock:
            self._ensure_loaded()
            assert self._tokenizer is not None and self._model is not None and self._torch is not None
            messages = [{"role": "user", "content": prompt}]
            inputs = self._tokenizer.apply_chat_template(
                messages, add_generation_prompt=True, tokenize=True,
                return_dict=True, return_tensors="pt"
            ).to(self._model.device)
            if inputs["input_ids"].shape[1] > 2500:
                raise ModelUnavailable("The model input is too long")
            try:
                with self._torch.inference_mode():
                    output = self._model.generate(
                        **inputs, max_new_tokens=320, do_sample=False,
                        pad_token_id=self._tokenizer.pad_token_id or self._tokenizer.eos_token_id,
                    )
                generated = output[0][inputs["input_ids"].shape[1]:]
                raw = self._tokenizer.decode(generated, skip_special_tokens=True)
            except Exception as exc:
                raise ModelUnavailable(f"Gemma inference failed: {type(exc).__name__}: {exc}") from exc
        return self._json_object(raw)

    def diagnose(self, *, question: str, learner_code: str, observed_result: dict) -> Diagnosis:
        labels = ", ".join(SPECS) + ", correct_understanding, unknown_or_ambiguous"
        prompt = (
            "You are Re:Learn, diagnosing introductory Python misconceptions. "
            "Return exactly one JSON object and no markdown. Use only the available evidence; "
            "an observed result reported by the learner is unverified. "
            "Never treat an error type alone as proof of a misconception. "
            "If the code and evidence do not distinguish causes, choose unknown_or_ambiguous.\n"
            f"Allowed diagnosis values: {labels}.\n"
            "Required JSON keys: diagnosis (string), misconception (string or null), "
            "confidence (high, medium, or low), evidence (string), explanation (string), "
            "needs_more_evidence (boolean).\n"
            f"Question:\n{question}\nLearner code:\n```python\n{learner_code}\n```\n"
            f"Observed result metadata:\n{json.dumps(observed_result, ensure_ascii=False)}"
        )
        data = self._generate(prompt)
        required = {"diagnosis", "misconception", "confidence", "evidence", "explanation", "needs_more_evidence"}
        if not required.issubset(data) or not isinstance(data["needs_more_evidence"], bool):
            raise ModelUnavailable("Gemma returned an incomplete diagnosis")
        if not all(isinstance(data[key], str) for key in ("diagnosis", "confidence", "evidence", "explanation")):
            raise ModelUnavailable("Gemma returned invalid diagnosis field types")
        if data["misconception"] is not None and not isinstance(data["misconception"], str):
            raise ModelUnavailable("Gemma returned an invalid misconception field")
        return Diagnosis(**{key: data[key] for key in required})

    def assess_resolution(self, *, diagnosis: Diagnosis, initial_question: str,
                          initial_code: str, probes: list[dict]) -> Resolution:
        prompt = (
            "You are Re:Learn, evaluating whether a learner's Python misconception remains. "
            "Two different transfer attempts are shown. Assess the code and the learner's explanations. "
            "Reported outputs and unexecuted code are unverified; a correct-looking answer alone does not prove learning. "
            "Return exactly one JSON object with status (resolved, unresolved, or needs_more_evidence) "
            "and evidence (string). If the evidence is uncertain, choose needs_more_evidence.\n"
            f"Original diagnosis: {json.dumps(diagnosis.__dict__, ensure_ascii=False)}\n"
            f"Original question: {initial_question}\nOriginal code:\n```python\n{initial_code}\n```\n"
            f"Transfer attempts: {json.dumps(probes, ensure_ascii=False)}"
        )
        data = self._generate(prompt)
        if data.get("status") not in {"resolved", "unresolved", "needs_more_evidence"} or not isinstance(data.get("evidence"), str):
            raise ModelUnavailable("Gemma returned an invalid resolution assessment")
        return Resolution(data["status"], data["evidence"])


class LMStudioAdapter(GemmaLocalAdapter):
    """Use a model already loaded by LM Studio's local OpenAI-compatible API."""

    def __init__(self, base_url: str, model_id: str):
        super().__init__(model_id)
        self.base_url = base_url.rstrip("/")
        self.model_id = model_id
        self.model_name = model_id
        self._ready = False

    @property
    def loaded(self) -> bool:
        return self._ready

    def _ensure_loaded(self):
        try:
            with urlopen(f"{self.base_url}/models", timeout=5) as response:
                models = json.loads(response.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise ModelUnavailable(
                "LM Studio is not reachable. Load Gemma 4 E2B and start its local server on port 1234."
            ) from exc
        identifiers = {item.get("id") for item in models.get("data", [])}
        if self.model_id not in identifiers:
            raise ModelUnavailable(f"LM Studio has not loaded the required model: {self.model_id}")
        self._ready = True

    def _generate(self, prompt: str) -> dict:
        with self._lock:
            self._ensure_loaded()
            payload = json.dumps({
                "model": self.model_id,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0,
                "max_tokens": 1024,
            }).encode("utf-8")
            request = Request(
                f"{self.base_url}/chat/completions",
                data=payload,
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            try:
                with urlopen(request, timeout=120) as response:
                    body = json.loads(response.read().decode("utf-8"))
                raw = body["choices"][0]["message"]["content"]
            except (HTTPError, URLError, TimeoutError, KeyError, IndexError, TypeError, json.JSONDecodeError) as exc:
                raise ModelUnavailable(f"LM Studio inference failed: {type(exc).__name__}: {exc}") from exc
        if not isinstance(raw, str):
            raise ModelUnavailable("LM Studio returned no text completion")
        return self._json_object(raw)


def configured_model():
    backend = os.environ.get("RELEARN_MODEL_BACKEND", "lmstudio").lower()
    if backend == "lmstudio":
        return LMStudioAdapter(
            os.environ.get("RELEARN_LM_STUDIO_URL", "http://127.0.0.1:1234/v1"),
            os.environ.get("RELEARN_LM_STUDIO_MODEL", "google/gemma-4-e2b"),
        )
    if backend != "transformers":
        return None
    location = os.environ.get("RELEARN_MODEL_PATH")
    if not location and Path("C:/hf/g3/model.safetensors").is_file():
        location = "C:/hf/g3"
    if not location:
        return None
    return GemmaLocalAdapter(location)
