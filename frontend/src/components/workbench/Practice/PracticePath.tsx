import React, { useState } from "react";
import { SimilarStep } from "./SimilarStep";
import { QuizStep } from "./QuizStep";
import { ActivityStep } from "./ActivityStep";

interface PracticePathProps {
  conceptName?: string;
  onComplete: () => void;
  onNextLesson: () => void;
}

export const PracticePath: React.FC<PracticePathProps> = ({
  conceptName = "return vs print",
  onComplete,
  onNextLesson,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const steps = [
    { id: 0, label: "Similar problem 1" },
    { id: 1, label: "Similar problem 2" },
    { id: 2, label: "Quick quiz" },
    { id: 3, label: "Activity" },
    { id: 4, label: "Re-check (next session)", isDelayed: true },
  ];

  const handleStepSuccess = (stepIdx: number) => {
    setCompletedSteps((prev) => (prev.includes(stepIdx) ? prev : [...prev, stepIdx]));
    if (stepIdx < 3) {
      setCurrentStepIndex(stepIdx + 1);
    } else {
      setIsFinished(true);
      onComplete();
    }
  };

  return (
    <div className="h-full bg-[#1F1F1F] text-[#CCCCCC] overflow-y-auto p-6 font-sans select-none flex flex-col">
      {/* Top: Concept name + Horizontal Path of nodes */}
      <div className="max-w-3xl mx-auto w-full pb-4 border-b border-[#2B2B2B] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#007ACC] font-mono uppercase font-semibold">
              Practice Path
            </span>
            <span className="text-[#666666]">·</span>
            <span className="text-sm font-semibold text-white">{conceptName}</span>
          </div>
          <span className="text-xs text-[#888888] font-mono">
            {completedSteps.length} of 4 completed
          </span>
        </div>

        {/* Horizontal Node Path */}
        <div className="flex items-center justify-between py-2">
          {steps.map((st, i) => {
            const isDone = completedSteps.includes(st.id);
            const isCurrent = currentStepIndex === st.id && !isFinished;
            const isDelayed = st.isDelayed;

            return (
              <React.Fragment key={st.id}>
                <div
                  onClick={() => {
                    if (isDone) setCurrentStepIndex(st.id);
                  }}
                  className={`flex flex-col items-center gap-1.5 cursor-pointer group ${
                    isDelayed ? "opacity-75" : ""
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                      isDone
                        ? "bg-[#2EA043] text-white"
                        : isCurrent
                        ? "bg-[#007ACC] text-white animate-pulse ring-2 ring-[#007ACC]/50"
                        : isDelayed
                        ? "bg-[#181818] border border-[#444444] text-[#888888]"
                        : "bg-[#181818] border border-[#333333] text-[#666666]"
                    }`}
                  >
                    {isDone ? (
                      <span className="codicon codicon-check text-xs" />
                    ) : isDelayed ? (
                      <span className="codicon codicon-history text-[11px]" />
                    ) : (
                      <span className="text-[10px] font-mono">{i + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] text-center max-w-[100px] leading-tight ${
                      isCurrent
                        ? "text-white font-medium"
                        : isDone
                        ? "text-[#CCCCCC]"
                        : "text-[#777777]"
                    }`}
                  >
                    {st.label}
                  </span>
                </div>

                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-[1px] mx-2 transition-colors ${
                      completedSteps.includes(st.id) ? "bg-[#2EA043]" : "bg-[#333333]"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Step View */}
      <div className="flex-1 flex flex-col justify-center">
        {!isFinished ? (
          <div>
            {(currentStepIndex === 0 || currentStepIndex === 1) && (
              <SimilarStep onSuccess={() => handleStepSuccess(currentStepIndex)} />
            )}
            {currentStepIndex === 2 && (
              <QuizStep onSuccess={() => handleStepSuccess(2)} />
            )}
            {currentStepIndex === 3 && (
              <ActivityStep onSuccess={() => handleStepSuccess(3)} />
            )}
          </div>
        ) : (
          /* Completion Screen */
          <div className="max-w-md mx-auto text-center space-y-4 py-8 animate-in fade-in zoom-in-98 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#2EA043]/20 border border-[#2EA043] flex items-center justify-center mx-auto text-[#2EA043]">
              <span className="codicon codicon-pass text-2xl" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Transfer Verified!
              </h2>
              <p className="text-xs text-[#AAAAAA]">
                You correctly distinguished console printing from caller returns across 4 distinct problem scenarios.
              </p>
            </div>

            {/* 3-line what you improved summary (before/after chips) */}
            <div className="p-3.5 rounded bg-[#181818] border border-[#2B2B2B] text-left text-xs space-y-2">
              <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
                What you improved:
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-[#F14C4C]/15 text-[#F87171]">
                  print(a + b) (shows screen)
                </span>
                <span className="text-[#888888]">→</span>
                <span className="px-2 py-0.5 rounded bg-[#2EA043]/15 text-[#4ADE80]">
                  return a + b (hands to caller)
                </span>
              </div>
              <div className="text-[11px] text-[#777777]">
                Scheduled for delayed consolidation check in your next session.
              </div>
            </div>

            <button
              onClick={onNextLesson}
              className="px-5 py-2.5 rounded bg-[#007ACC] hover:bg-[#0098FF] text-white font-medium text-xs flex items-center gap-2 mx-auto transition-colors cursor-pointer shadow-lg"
            >
              <span>Next Lesson</span>
              <span className="codicon codicon-arrow-right text-xs" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
