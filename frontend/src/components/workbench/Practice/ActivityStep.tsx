import React, { useState } from "react";

interface ActivityStepProps {
  onSuccess: () => void;
}

export const ActivityStep: React.FC<ActivityStepProps> = ({ onSuccess }) => {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [hasFixed, setHasFixed] = useState(false);

  const lines = [
    { num: 1, text: "def calculate_tax(subtotal, rate):", isBug: false },
    { num: 2, text: "    total = subtotal + (subtotal * rate)", isBug: false },
    { num: 3, text: "    print(total)", isBug: true, fixedText: "    return total" },
    { num: 4, text: "", isBug: false },
    { num: 5, text: "final_bill = calculate_tax(50, 0.1)", isBug: false },
  ];

  const handleLineClick = (lineNum: number) => {
    if (hasFixed) return;
    setSelectedLine(lineNum);
  };

  const handleFix = () => {
    if (selectedLine === 3) {
      setHasFixed(true);
      setTimeout(() => {
        onSuccess();
      }, 900);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 py-4 select-none font-sans">
      <div>
        <span className="text-xs text-[#2EA043] font-mono uppercase font-semibold">
          Interactive Activity
        </span>
        <h2 className="text-lg font-medium text-white mt-1">
          Spot and tap the line that prevents <code className="text-[#9CDCFE] font-mono">final_bill</code> from receiving the total.
        </h2>
      </div>

      {/* Code line picker */}
      <div className="rounded border border-[#2B2B2B] bg-[#141414] overflow-hidden p-2 font-mono text-[13px] space-y-1">
        {lines.map((l) => {
          if (!l.text) {
            return <div key={l.num} className="h-4" />;
          }

          const isSelected = selectedLine === l.num;

          return (
            <div
              key={l.num}
              onClick={() => handleLineClick(l.num)}
              className={`px-3 py-1.5 rounded flex items-center gap-3 transition-colors cursor-pointer ${
                hasFixed && l.num === 3
                  ? "bg-[#2EA043]/20 border border-[#2EA043] text-[#4ADE80]"
                  : isSelected
                  ? "bg-[#007ACC]/25 border border-[#007ACC] text-white"
                  : "hover:bg-white/5 text-[#CCCCCC]"
              }`}
            >
              <span className="text-[#666666] w-6 shrink-0">{l.num}</span>
              <span className="flex-1">
                {hasFixed && l.num === 3 ? l.fixedText : l.text}
              </span>
              {hasFixed && l.num === 3 && (
                <span className="codicon codicon-check text-[#2EA043] text-sm" />
              )}
            </div>
          );
        })}
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-[#888888]">
          {selectedLine === 3
            ? "Line 3 selected! It prints instead of returning."
            : selectedLine !== null
            ? `Line ${selectedLine} looks fine. Look for what gives values to callers.`
            : "Click a line above to inspect it."}
        </div>

        {selectedLine === 3 && !hasFixed && (
          <button
            onClick={handleFix}
            className="px-4 py-1.5 rounded bg-[#2EA043] hover:bg-[#34B34C] text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer animate-in zoom-in-95"
          >
            <span className="codicon codicon-tools text-xs" />
            <span>Turn print into return</span>
          </button>
        )}

        {hasFixed && (
          <div className="text-xs text-[#2EA043] font-medium flex items-center gap-1">
            <span className="codicon codicon-pass text-sm" />
            <span>Line converted to return total!</span>
          </div>
        )}
      </div>
    </div>
  );
};
