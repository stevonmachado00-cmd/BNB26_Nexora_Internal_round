const baseUrl = import.meta.env.VITE_RELEARN_API_URL || "http://127.0.0.1:8000/api/v1";

type ApiDiagnosis = {
  diagnosis: string;
  misconception: string;
  confidence: "high" | "medium" | "low";
  evidence: string;
  explanation: string;
  needs_more_evidence: boolean;
};

export type ModelAttempt = { status: string; diagnosis: ApiDiagnosis | null; run: Record<string, unknown> };

async function sessionId() {
  const key = "relearn-session-id";
  const saved = localStorage.getItem(key);
  if (saved) return saved;
  const response = await fetch(`${baseUrl}/sessions`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ learner_id: "local-learner" }),
  });
  if (!response.ok) throw new Error("Re:Learn backend is not available.");
  const session = await response.json();
  localStorage.setItem(key, session.id);
  return session.id as string;
}

export async function sendCodeToModel(questionId: string, code: string): Promise<ModelAttempt> {
  const id = await sessionId();
  const response = await fetch(`${baseUrl}/sessions/${id}/attempts`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question_id: questionId, code }),
  });
  if (!response.ok) throw new Error((await response.text()) || "The model request could not be completed.");
  return response.json();
}
