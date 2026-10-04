import React, { useState } from "react";

interface HintDotsProps {
  hints: [string, string, string, { diff: string; fixedCode: string }];
  onApplyFix: (code: string) => void;
}

export const HintDots: React.FC<HintDotsProps> = ({ hints, onApplyFix }) => {
  const [currentTier, setCurrentTier] = useState<number>(1);
  const [confirmingTier4, setConfirmingTier4] = useState<boolean>(false);

  const handleNextHint = () => {
    if (currentTier < 3) {
      setCurrentTier((prev) => prev + 1);
    } else if (currentTier === 3) {
      setConfirmingTier4(true);
    }
  };

  const handleConfirmTier4 = () => {
    setCurrentTier(4);
    setConfirmingTier4(false);
  };

  return (
    <div className="space-y-2 select-text font-sans">
      {/* 4 small dots (not a labeled section) */}
      <div className="flex items-center gap-1.5 pt-1">
        {[1, 2, 3, 4].map((tier) => (
          <button
            key={tier}
            onClick={() => {
              if (tier <= currentTier) setCurrentTier(tier);
              else if (tier === currentTier + 1) handleNextHint();
            }}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              tier === currentTier
                ? "bg-[#007ACC] ring-2 ring-[#007ACC]/40 scale-110"
                : tier < currentTier
                ? "bg-[#2EA043]"
                : "bg-[#333333]"
            }`}
            title={`Hint Tier ${tier}`}
            aria-label={`Hint Tier ${tier}`}
          />
        ))}
      </div>

      {/* Tier 1, 2, 3 text sits in 14px */}
      {currentTier <= 3 && (
        <div className="text-[13px] sm:text-[14px] text-[#DDDDDD] leading-relaxed transition-all duration-200">
          {typeof hints[currentTier - 1] === "string" ? (hints[currentTier - 1] as string) : ""}
        </div>
      )}

      {/* Tier 4 diff preview with Apply Fix */}
      {currentTier === 4 && (
        <div className="p-2.5 rounded bg-[#111111] border border-[#CCA700]/40 space-y-2 animate-in fade-in duration-200">
          <div className="text-[11px] font-mono text-[#888888]">
            Solution diff (Assisted):
          </div>
          <div className="font-mono text-[11px] space-y-0.5">
            {hints[3].diff.split("\n").map((line, idx) => {
              const isDel = line.startsWith("-");
              const isAdd = line.startsWith("+");
              return (
                <div
                  key={idx}
                  className={`px-1 rounded ${
                    isDel
                      ? "bg-[#F14C4C]/15 text-[#F87171]"
                      : isAdd
                      ? "bg-[#2EA043]/15 text-[#4ADE80]"
                      : "text-[#888888]"
                  }`}
                >
                  {line}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() => onApplyFix(hints[3].fixedCode)}
              className="px-2.5 py-1 rounded bg-[#007ACC] hover:bg-[#0098FF] text-white font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="codicon codicon-check text-xs" />
              <span>Apply fix</span>
            </button>
          </div>
        </div>
      )}

      {/* Ghost button "Another hint" */}
      {currentTier < 4 && !confirmingTier4 && (
        <button
          onClick={handleNextHint}
          className="text-xs text-[#888888] hover:text-white transition-colors flex items-center gap-1 pt-0.5 cursor-pointer"
        >
          <span>Another hint</span>
          <span className="codicon codicon-arrow-right text-[10px]" />
        </button>
      )}

      {/* Confirmation for Tier 4 */}
      {confirmingTier4 && (
        <div className="p-2.5 rounded bg-[#2A1800] border border-[#CCA700]/50 space-y-1.5 animate-in fade-in duration-150">
          <div className="text-xs font-semibold text-[#CCA700]">Reveal solution code?</div>
          <p className="text-[11px] text-[#CCCCCC]">
            This will reveal the exact code and record this problem as assisted.
          </p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setConfirmingTier4(false)}
              className="text-xs text-[#888888] hover:text-white px-2 py-0.5"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmTier4}
              className="px-2.5 py-0.5 rounded bg-[#CCA700] hover:bg-[#E5B800] text-black font-semibold text-xs cursor-pointer"
            >
              Reveal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
