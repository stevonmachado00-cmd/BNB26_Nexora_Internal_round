import React, { useState } from "react";
import { RunResult } from "../data/mockDiagnoses";

interface TestsDrawerTabProps {
  runResult: RunResult | null;
}

export const TestsDrawerTab: React.FC<TestsDrawerTabProps> = ({ runResult }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!runResult || runResult.tests.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[#777777] text-xs">
        No compiler results are available. Press Ctrl+Enter to submit your code for model diagnosis.
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-y-auto space-y-2 font-mono text-xs select-none">
      {runResult.tests.map((t, idx) => {
        const isExpanded = expandedIndex === idx;

        return (
          <div
            key={idx}
            className="border border-[#2B2B2B] rounded bg-[#181818] overflow-hidden"
          >
            {/* Compact Row */}
            <div
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
              className="px-3 py-2 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span
                  className={`w-2 h-2 rounded-full ${
                    t.passed ? "bg-[#2EA043]" : "bg-[#F14C4C]"
                  }`}
                />
                <span className="text-white font-medium">{t.name}</span>
                <span className="text-[#777777] text-[11px]">
                  → expected {t.expected}, got {t.got}
                </span>
              </div>

              <span
                className={`codicon codicon-chevron-${
                  isExpanded ? "down" : "right"
                } text-xs text-[#888888]`}
              />
            </div>

            {/* Expanded Mini Diff */}
            {isExpanded && (
              <div className="p-3 bg-[#131313] border-t border-[#2B2B2B] text-[11px] space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-[#777777] w-20">Expected:</span>
                  <span className="text-[#4ADE80] font-bold">{t.expected}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#777777] w-20">Received:</span>
                  <span
                    className={
                      t.passed ? "text-[#4ADE80]" : "text-[#F87171] font-bold"
                    }
                  >
                    {t.got}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
