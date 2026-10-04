import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import confetti from "canvas-confetti";

interface DelayedRecheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  misconceptionName?: string;
}

export const DelayedRecheckModal: React.FC<DelayedRecheckModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  misconceptionName = "Return vs Print",
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);

  const options = [
    { label: "A", text: "The numeric result: n * 10", isCorrect: false },
    { label: "B", text: "Python's None object", isCorrect: true },
    { label: "C", text: "A formatted string representation", isCorrect: false },
    { label: "D", text: "0 by default", isCorrect: false },
  ];

  const handleSubmit = () => {
    if (selectedIdx === null) return;
    setIsSubmitted(true);
    const correct = options[selectedIdx].isCorrect;
    setPassed(correct);

    if (correct) {
      try {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.7 },
          colors: ["#2ea043", "#58a6ff", "#f0f6fc"],
        });
      } catch (_err) {
        // ignore
      }
    }
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Spaced Knowledge Retention Check"
      subtitle="Verifying long-term cognitive consolidation in memory."
      maxWidth="lg"
    >
      <div className="space-y-3.5 text-xs text-[#c9d1d9] select-none">
        <div className="p-2.5 rounded bg-[#12161f] border border-[#212734] flex items-center gap-2 text-[#8b949e]">
          <Clock className="w-3.5 h-3.5 text-[#58a6ff] shrink-0" />
          <span>Verifying whether this mental model remains sound over time.</span>
        </div>

        <div className="p-3 rounded bg-[#090d13] border border-[#212734] font-mono text-center text-xs sm:text-sm text-[#d29922]">
          <code>def calculate_bonus(salary):{"\n"}    print(salary * 0.1)</code>
        </div>

        <div className="font-semibold text-xs text-[#f0f6fc] font-mono">
          What does <code>calculate_bonus(50000)</code> hand back to its caller?
        </div>

        <div className="space-y-1.5 font-mono">
          {options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            let style = "bg-[#0e1218] border-[#212734] hover:border-[#303848] text-[#c9d1d9]";

            if (isSelected) {
              style = "bg-[#161d28] border-[#388bfd] text-[#f0f6fc]";
            }
            if (isSubmitted) {
              if (opt.isCorrect) {
                style = "bg-[#0c2013] border-[#2ea043] text-[#3fb950]";
              } else if (isSelected && !opt.isCorrect) {
                style = "bg-[#261114] border-[#f85149] text-[#f85149]";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => !isSubmitted && setSelectedIdx(idx)}
                disabled={isSubmitted}
                className={`w-full p-2.5 rounded border text-left text-xs flex items-center gap-2.5 transition-colors ${style}`}
              >
                <span className="w-5 h-5 rounded bg-[#161b24] border border-[#262e3d] flex items-center justify-center font-bold text-[10px] text-[#8b949e]">
                  {opt.label}
                </span>
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div
            className={`p-3 rounded border space-y-1 ${
              passed
                ? "bg-[#0c2013] border-[#1e4a29] text-[#3fb950]"
                : "bg-[#261114] border-[#542227] text-[#f85149]"
            }`}
          >
            <div className="flex items-center gap-2 font-bold font-mono text-xs">
              {passed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#3fb950]" />
                  <span>Misconception Permanently Resolved</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-[#f85149]" />
                  <span>Concept Requires Additional Transfer Practice</span>
                </>
              )}
            </div>
            <p className="text-xs text-[#c9d1d9] leading-relaxed">
              {passed
                ? `Confirmed: print() outputs to terminal and returns None. '${misconceptionName}' is graduated to Resolved in your learner profile.`
                : "The return statement was omitted, returning None to caller variable. An extra transfer challenge will be scheduled."}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2.5 border-t border-[#212734] font-mono">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedIdx === null}
              className="px-3.5 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 text-white font-semibold text-xs border border-[#2ea043] transition-colors"
            >
              Verify Memory
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-3.5 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-xs border border-[#2ea043] transition-colors"
            >
              Update Profile & Close
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
