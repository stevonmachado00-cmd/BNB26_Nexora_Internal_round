import React, { useState } from "react";
import { LineDiagnosis } from "../data/mockDiagnoses";
import { TraceDiagram } from "./TraceDiagram";
import { HintDots } from "./HintDots";

interface RailCardProps {
  diagnosis: LineDiagnosis;
  onApplyFix: (code: string) => void;
  onAskAboutLine: (line: number) => void;
  onDismiss: (line: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasMultiple?: boolean;
}

export const RailCard: React.FC<RailCardProps> = ({
  diagnosis,
  onApplyFix,
  onAskAboutLine,
  onDismiss,
  onNext,
  onPrev,
  hasMultiple = false,
}) => {
  const [showDeeperExplanation, setShowDeeperExplanation] = useState(false);

  const getDotColor = (type?: string) => {
    switch (type) {
      case "conceptual":
        return { color: "bg-[#F14C4C]", tooltip: "Conceptual mix-up: return vs print" };
      case "logic":
        return { color: "bg-[#CCA700]", tooltip: "Logic discrepancy: wrong operator" };
      case "syntax":
        return { color: "bg-[#F14C4C]", tooltip: "Syntax structure: missing punctuation" };
      default:
        return { color: "bg-[#F14C4C]", tooltip: "Diagnosis detected" };
    }
  };

  const dot = getDotColor(diagnosis.errorType);

  return (
    <div className="wb-glass rounded-[8px] p-3.5 space-y-3 font-sans text-xs text-[#CCCCCC] select-none shadow-xl border border-white/10 transition-all duration-200 animate-in fade-in">
      {/* Header: dot with tooltip + Line N + multi navigation + dismiss */}
      <div className="flex items-center justify-between pb-1 border-b border-[#2F2F2F]">
        <div className="flex items-center gap-2">
          {/* Small colored dot with tooltip (no word label or pill) */}
          <span
            className={`w-2 h-2 rounded-full ${dot.color} cursor-help`}
            title={dot.tooltip}
            aria-label={dot.tooltip}
          />
          <span className="font-semibold text-white text-[12px]">
            Line {diagnosis.line}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[#888888]">
          {hasMultiple && (
            <div className="flex items-center mr-1">
              <button
                onClick={onPrev}
                className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center hover:text-white"
                title="Previous problem (Shift+F8)"
              >
                <span className="codicon codicon-chevron-up text-xs" />
              </button>
              <button
                onClick={onNext}
                className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center hover:text-white"
                title="Next problem (F8)"
              >
                <span className="codicon codicon-chevron-down text-xs" />
              </button>
            </div>
          )}

          <button
            onClick={() => onDismiss(diagnosis.line)}
            className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center hover:text-white transition-colors cursor-pointer"
            title="Dismiss card"
            aria-label="Dismiss card"
          >
            <span className="codicon codicon-close text-xs" />
          </button>
        </div>
      </div>

      {/* Part 1: Headline (≤ 12 words, 15px semibold) */}
      <h3 className="text-[14px] sm:text-[15px] font-semibold text-white leading-snug">
        {diagnosis.headline}
      </h3>

      {/* Part 2: Mini trace diagram (shows picture, not text) */}
      <TraceDiagram
        steps={diagnosis.diagramSteps}
        caption={diagnosis.caption}
      />

      {/* Part 3: One hint at a time (4 dots) */}
      <HintDots hints={diagnosis.hints} onApplyFix={onApplyFix} />

      {/* Footer: Ask about this line + Why is this wrong? */}
      <div className="pt-2 border-t border-[#2F2F2F] flex items-center justify-between text-xs">
        <button
          onClick={() => onAskAboutLine(diagnosis.line)}
          className="text-[#3794FF] hover:text-[#6BB0FF] transition-colors flex items-center gap-1 font-medium cursor-pointer"
        >
          <span className="codicon codicon-comment-discussion text-xs" />
          <span>Ask about this line</span>
        </button>

        <button
          onClick={() => setShowDeeperExplanation(!showDeeperExplanation)}
          className="text-[#888888] hover:text-[#CCCCCC] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Why is this wrong?</span>
          <span
            className={`codicon codicon-chevron-${
              showDeeperExplanation ? "up" : "down"
            } text-[10px]`}
          />
        </button>
      </div>

      {/* Deeper explanation drawer (closed by default) */}
      {showDeeperExplanation && diagnosis.whyDeep && (
        <div className="p-3 rounded bg-[#161616] border border-[#2B2B2B] text-[12px] space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <p className="text-[#CCCCCC] leading-relaxed">
            {diagnosis.whyDeep.misconception}
          </p>
          <pre className="p-2 rounded bg-[#111111] font-mono text-[11px] text-[#CE9178] overflow-x-auto">
            {diagnosis.whyDeep.contrastExample}
          </pre>
        </div>
      )}
    </div>
  );
};
