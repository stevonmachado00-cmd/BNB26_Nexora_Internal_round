import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { ProbeQuestion } from "../../types";
import { CheckCircle2, HelpCircle, ArrowRight } from "lucide-react";

interface ProbeQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  probe: ProbeQuestion;
  onAnswerSelected: (optionId: string) => void;
}

export const ProbeQuestionModal: React.FC<ProbeQuestionModalProps> = ({
  isOpen,
  onClose,
  probe,
  onAnswerSelected,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (id: string) => {
    if (submitted) return;
    setSelectedId(id);
  };

  const handleSubmit = () => {
    if (!selectedId) return;
    setSubmitted(true);
    onAnswerSelected(selectedId);
  };

  const handleDone = () => {
    onClose();
  };

  const selectedOpt = probe.options.find((o) => o.id === selectedId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Diagnostic Probe Question"
      subtitle="Before concluding root cause, this probe disambiguates careless typos from flawed mental models."
      maxWidth="xl"
    >
      <div className="space-y-3.5 text-xs text-[#c9d1d9] select-none">
        <div className="p-2.5 rounded bg-[#12161f] border border-[#212734] flex items-start gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-[#58a6ff] shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[#8b949e]">
            Answering this conceptual probe isolates your exact mental model from a careless slip.
          </p>
        </div>

        {/* Code Snippet */}
        <div className="p-3 rounded bg-[#090d13] border border-[#212734] text-center font-mono text-sm text-[#d29922]">
          <code>{probe.codeSnippet}</code>
        </div>

        {/* Question */}
        <div className="font-semibold text-xs text-[#f0f6fc] font-mono">
          {probe.question}
        </div>

        {/* Options */}
        <div className="space-y-1.5 font-mono">
          {probe.options.map((opt) => {
            const isSelected = selectedId === opt.id;
            let optStyle =
              "bg-[#0e1218] border-[#212734] hover:border-[#303848] hover:bg-[#12161f] text-[#c9d1d9]";

            if (isSelected) {
              optStyle = "bg-[#161d28] border-[#388bfd] text-[#f0f6fc]";
            }
            if (submitted) {
              if (opt.isCorrect) {
                optStyle = "bg-[#0c2013] border-[#2ea043] text-[#3fb950]";
              } else if (isSelected && !opt.isCorrect) {
                optStyle = "bg-[#261114] border-[#f85149] text-[#f85149]";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={submitted}
                className={`w-full p-2.5 rounded border text-left flex items-center justify-between transition-colors ${optStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-[#161b24] border border-[#262e3d] font-mono font-bold flex items-center justify-center text-[11px] text-[#8b949e]">
                    {opt.label}
                  </span>
                  <span className="font-mono text-xs">{opt.text}</span>
                </div>

                {submitted && opt.isCorrect && (
                  <span className="text-[#3fb950] font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback / Result Explanation */}
        {submitted && selectedOpt && (
          <div className="p-3 rounded bg-[#0e1218] border border-[#262e3d] space-y-1.5">
            <div className="flex items-center gap-2 text-[#58a6ff] font-bold font-mono text-xs">
              <span>Diagnostic Model Calibrated</span>
            </div>
            <p className="text-[#8b949e] leading-relaxed text-xs">
              {probe.explanation}
            </p>
            {selectedOpt.diagnosisShift && (
              <p className="text-[#58a6ff] font-mono text-[10px] pt-0.5">
                {selectedOpt.diagnosisShift}
              </p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2.5 border-t border-[#212734] font-mono">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedId}
              className={`px-3.5 py-1.5 rounded font-semibold text-xs transition-colors ${
                selectedId
                  ? "bg-[#238636] hover:bg-[#2ea043] text-white border border-[#2ea043]"
                  : "bg-[#141922] text-[#6e7681] border border-[#212734] cursor-not-allowed"
              }`}
            >
              <span>Submit Answer</span>
            </button>
          ) : (
            <button
              onClick={handleDone}
              className="px-3.5 py-1.5 rounded font-semibold text-xs bg-[#238636] hover:bg-[#2ea043] text-white border border-[#2ea043] flex items-center gap-1.5 transition-colors"
            >
              <span>View Updated Diagnosis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
