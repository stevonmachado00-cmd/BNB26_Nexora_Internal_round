import React, { useState } from "react";
import { LearningHistoryEvent, ProblemHistoryRecord } from "../types";
import {
  CheckCircle2,
  AlertTriangle,
  FileCode,
} from "lucide-react";
import { Modal } from "../components/common/Modal";

interface HistoryPageProps {
  events: LearningHistoryEvent[];
  problems: ProblemHistoryRecord[];
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ events, problems }) => {
  const [activeTab, setActiveTab] = useState<"timeline" | "problems">("timeline");
  const [inspectedProblem, setInspectedProblem] = useState<ProblemHistoryRecord | null>(null);

  return (
    <div className="p-5 max-w-5xl mx-auto space-y-5 text-[#c9d1d9] select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#f0f6fc] font-mono tracking-tight">
            Learning & Submission Audit Log
          </h1>
          <p className="text-xs text-[#8b949e]">
            Complete audit trail of execution attempts, diagnosed misconceptions, and transfer validations.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-0.5 rounded bg-[#0e1218] border border-[#212734] text-xs font-mono">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === "timeline"
                ? "bg-[#18202d] text-[#f0f6fc] border border-[#2d384c] font-semibold"
                : "text-[#8b949e] hover:text-[#f0f6fc]"
            }`}
          >
            Timeline Log
          </button>
          <button
            onClick={() => setActiveTab("problems")}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === "problems"
                ? "bg-[#18202d] text-[#f0f6fc] border border-[#2d384c] font-semibold"
                : "text-[#8b949e] hover:text-[#f0f6fc]"
            }`}
          >
            Submissions ({problems.length})
          </button>
        </div>
      </div>

      {/* TAB 1: TIMELINE */}
      {activeTab === "timeline" && (
        <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-4">
          <div className="relative border-l border-[#212734] ml-3 space-y-4">
            {events.map((evt, idx) => {
              const isSuccess =
                evt.type.includes("resolved") ||
                evt.type.includes("solved") ||
                evt.type.includes("passed");

              return (
                <div key={evt.id || idx} className="relative pl-5">
                  {/* Dot */}
                  <div
                    className={`absolute -left-2 top-1 w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSuccess
                        ? "bg-[#0c2013] border-[#2ea043] text-[#3fb950]"
                        : "bg-[#231b09] border-[#d29922] text-[#d29922]"
                    }`}
                  >
                    {isSuccess ? (
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    ) : (
                      <AlertTriangle className="w-2.5 h-2.5" />
                    )}
                  </div>

                  <div className="p-3 rounded bg-[#090d13] border border-[#1e2533] space-y-1 hover:border-[#303848] transition-colors">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#f0f6fc]">{evt.title}</span>
                      <span className="text-[#6e7681] text-[10px]">{evt.date}</span>
                    </div>

                    <p className="text-xs text-[#8b949e] leading-relaxed">
                      {evt.detail}
                    </p>

                    <div className="flex items-center gap-2 pt-0.5 text-[10px] font-mono text-[#8b949e]">
                      <span>Concept: <strong className="text-[#c9d1d9]">{evt.relatedConcept}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PROBLEM TABLE */}
      {activeTab === "problems" && (
        <div className="rounded bg-[#0e1218] border border-[#212734] overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#212734] bg-[#0c1017] font-mono text-[#8b949e] text-[10px] uppercase tracking-wider">
                  <th className="p-3">Problem</th>
                  <th className="p-3">Concept</th>
                  <th className="p-3">Result</th>
                  <th className="p-3">Attempts</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c2330] font-mono">
                {problems.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-[#12161f] transition-colors cursor-pointer"
                    onClick={() => setInspectedProblem(p)}
                  >
                    <td className="p-3 font-semibold text-[#f0f6fc] flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-[#8b949e] shrink-0" />
                      <span>{p.problemTitle}</span>
                    </td>
                    <td className="p-3 text-[#8b949e]">{p.concept}</td>
                    <td className="p-3">
                      {p.result === "correct" ? (
                        <span className="text-[#3fb950] font-semibold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Correct
                        </span>
                      ) : (
                        <span className="text-[#d29922] font-semibold flex items-center gap-1 text-[11px]">
                          <AlertTriangle className="w-3 h-3" /> Diagnosed
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-[#8b949e]">{p.attempts} att.</td>
                    <td className="p-3 text-[#6e7681] text-[11px]">{p.date}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedProblem(p);
                        }}
                        className="text-[#58a6ff] hover:text-[#79b8ff] text-xs font-mono"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Code Modal */}
      {inspectedProblem && (
        <Modal
          isOpen={true}
          onClose={() => setInspectedProblem(null)}
          title={`Submission: ${inspectedProblem.problemTitle}`}
          subtitle={`Concept: ${inspectedProblem.concept} • Attempts: ${inspectedProblem.attempts}`}
          maxWidth="2xl"
        >
          <div className="space-y-3 text-xs text-[#c9d1d9]">
            <div className="flex items-center justify-between pb-2 border-b border-[#212734] font-mono">
              <span className="text-[#8b949e]">
                Status:{" "}
                <span
                  className={
                    inspectedProblem.result === "correct"
                      ? "text-[#3fb950] font-bold"
                      : "text-[#d29922] font-bold"
                  }
                >
                  {inspectedProblem.result.toUpperCase()}
                </span>
              </span>
              {inspectedProblem.diagnosedMisconception && (
                <span className="text-[#d29922] text-[10px] bg-[#231b09] px-2 py-0.5 rounded border border-[#523f14]">
                  ⚠ {inspectedProblem.diagnosedMisconception}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-[#8b949e] block uppercase">
                Submitted Python Code:
              </span>
              <pre className="p-3 rounded bg-[#090d13] border border-[#212734] font-mono text-xs text-[#58a6ff] whitespace-pre-wrap select-text">
                {inspectedProblem.submittedCode}
              </pre>
            </div>

            <p className="text-[#8b949e] text-xs leading-relaxed">
              Every submission is retained with its AST diagnosis snapshot and transfer evaluation for cognitive auditing.
            </p>

            <div className="flex justify-end pt-2 font-mono">
              <button
                onClick={() => setInspectedProblem(null)}
                className="px-3.5 py-1.5 rounded bg-[#141922] hover:bg-[#1c2330] text-[#f0f6fc] text-xs border border-[#262e3d] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
