"""Contract for the future fine-tuned model. The default never guesses."""

from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class Diagnosis:
    diagnosis: str
    misconception: str | None
    confidence: str
    evidence: str
    explanation: str
    needs_more_evidence: bool


@dataclass(frozen=True)
class Resolution:
    status: str  # resolved, unresolved, or needs_more_evidence
    evidence: str


class ModelUnavailable(Exception):
    pass


class ModelAdapter(Protocol):
    def diagnose(self, *, question: str, learner_code: str, observed_result: dict) -> Diagnosis: ...

    def assess_resolution(self, *, diagnosis: Diagnosis, initial_question: str,
                          initial_code: str, probes: list[dict]) -> Resolution: ...


class UnavailableModel:
    def diagnose(self, **kwargs) -> Diagnosis:
        raise ModelUnavailable("Diagnosis model is not configured")

    def assess_resolution(self, **kwargs) -> Resolution:
        raise ModelUnavailable("Resolution model is not configured")
