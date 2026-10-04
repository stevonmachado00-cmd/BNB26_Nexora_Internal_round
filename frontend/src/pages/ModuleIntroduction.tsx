import React, { useEffect, useState } from "react";
import type { Problem } from "../types";
import { getModuleQuestions, moduleDetails, toProblem } from "../services/curriculumApi";

export const ModuleIntroduction: React.FC<{ topic: string; onChooseQuestion: (problem: Problem) => void }> = ({ topic, onChooseQuestion }) => {
  const [questions, setQuestions] = useState<Problem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const details = moduleDetails[topic] || moduleDetails.variables;

  useEffect(() => {
    setQuestions([]);
    setError(null);
    getModuleQuestions(topic)
      .then((items) => setQuestions(items.map((item) => toProblem(item, topic))))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load questions."));
  }, [topic]);

  return <div className="min-h-screen bg-background text-foreground p-5 sm:p-10">
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-lg">
        <p className="text-xs font-mono uppercase tracking-wider text-chart-2">{details.focus}</p>
        <h1 className="mt-2 text-3xl font-extrabold">{details.title}</h1>
        <p className="mt-5 max-w-3xl leading-7 text-muted-foreground">{details.theory}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Choose a practice question</h2>
        <p className="mt-1 text-sm text-muted-foreground">These are real questions from the Re:Learn curriculum, not a repeated demo.</p>
        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
        {!error && questions.length === 0 && <p className="mt-4 text-sm text-muted-foreground">Loading questions…</p>}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {questions.map((question) => <button key={question.id} onClick={() => onChooseQuestion(question)} className="rounded-xl border border-border bg-card p-5 text-left hover:border-chart-2 hover:bg-accent/30 transition-colors">
            <code className="text-chart-2 font-semibold">{question.title}()</code>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{question.description}</p>
            <span className="mt-5 inline-block text-xs font-bold text-chart-2">Start question →</span>
          </button>)}
        </div>
      </section>
    </div>
  </div>;
};
