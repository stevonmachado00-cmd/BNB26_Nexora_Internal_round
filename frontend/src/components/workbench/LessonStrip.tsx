import React, { useState } from "react";
import { LoopTrack, LoopNodeId } from "./LoopTrack";

interface TestCaseChip {
  input: string;
  expected: string;
  passed?: boolean;
}

interface LessonStripProps {
  breadcrumb: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estTime: string;
  questionSentence: string;
  cases: TestCaseChip[];
  requirements: string[];
  loopNode: LoopNodeId;
  completedLoopNodes: LoopNodeId[];
  onGenerateQuestion: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const LessonStrip: React.FC<LessonStripProps> = ({
  breadcrumb,
  difficulty,
  estTime,
  questionSentence,
  cases,
  requirements,
  loopNode,
  completedLoopNodes,
  onGenerateQuestion,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [showDetailsPopover, setShowDetailsPopover] = useState(false);

  return (
    <div
      className={`bg-[#181818] border-b border-[#2B2B2B] px-4 transition-all duration-200 select-none overflow-visible relative z-20 ${
        isCollapsed ? "h-[44px] py-1.5" : "min-h-[104px] py-3"
      }`}
    >
      {/* ROW 1: Breadcrumb + Difficulty + Est Time + Generate + Loop Track + Collapse toggle */}
      <div className="flex items-center justify-between text-xs text-[#888888]">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[#CCCCCC] hover:text-white transition-colors font-medium">
            {breadcrumb}
          </span>
          <span className="text-[10px] px-1.5 py-[1px] rounded bg-[#2B2B2B] text-[#CCA700] font-mono font-medium">
            {difficulty}
          </span>
          <span className="text-[11px] text-[#666666] hidden sm:inline font-mono">
            ~{estTime}
          </span>

          <button
            onClick={onGenerateQuestion}
            className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center text-[#888888] hover:text-[#3794FF] transition-colors ml-1"
            title="Generate new verified question (F8)"
            aria-label="Generate new question"
          >
            <span className="codicon codicon-sparkle text-xs" />
          </button>
        </div>

        {/* Right: Learning Loop Track + Chevron */}
        <div className="flex items-center gap-3">
          <LoopTrack currentNode={loopNode} completedNodes={completedLoopNodes} />

          <button
            onClick={onToggleCollapse}
            className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center text-[#888888] hover:text-white transition-colors cursor-pointer"
            title={isCollapsed ? "Expand lesson details" : "Collapse lesson strip"}
            aria-label="Toggle lesson strip"
          >
            <span
              className={`codicon codicon-chevron-${
                isCollapsed ? "down" : "up"
              } text-xs transition-transform duration-200`}
            />
          </button>
        </div>
      </div>

      {/* ROW 2: Question headline + Example chips + Details popover */}
      {!isCollapsed ? (
        <div className="mt-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in duration-150">
          {/* Headline (≤ 14 words, 16px) */}
          <div className="text-[15px] sm:text-[16px] text-white font-medium tracking-tight">{questionSentence}</div>

          {/* Example Cases as interactive chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {cases.map((ex, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#202020] border border-[#2F2F2F] font-mono text-[11px] text-[#DDDDDD] shadow-sm"
              >
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    ex.passed === true
                      ? "bg-[#2EA043]"
                      : ex.passed === false
                      ? "bg-[#F14C4C]"
                      : "bg-[#555555]"
                  }`}
                  title={
                    ex.passed === true
                      ? "Test Passed"
                      : ex.passed === false
                      ? "Test Failed"
                      : "Not Run Yet"
                  }
                />
                <span>
                  {ex.input} → {ex.expected}
                </span>
              </div>
            ))}

            {/* Details Link */}
            <div className="relative">
              <button
                onClick={() => setShowDetailsPopover(!showDetailsPopover)}
                className="text-[11px] text-[#888888] hover:text-[#3794FF] transition-colors underline underline-offset-2 ml-1 cursor-pointer"
              >
                Details
              </button>

              {/* Popover */}
              {showDetailsPopover && (
                <div
                  className="wb-glass absolute right-0 top-7 w-72 rounded-[6px] p-3 text-xs text-[#CCCCCC] font-sans shadow-xl z-50 animate-in fade-in duration-150 border border-[#3C3C3C]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#333333] mb-2 font-semibold text-white">
                    <span>Requirements</span>
                    <button
                      onClick={() => setShowDetailsPopover(false)}
                      className="text-[#888888] hover:text-white"
                    >
                      <span className="codicon codicon-close text-xs" />
                    </button>
                  </div>
                  <ul className="space-y-1.5 text-[11px] list-disc pl-4 text-[#AAAAAA]">
                    {requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Collapsed compact preview inside row 1 space or underneath */
        <div className="hidden" />
      )}
    </div>
  );
};
