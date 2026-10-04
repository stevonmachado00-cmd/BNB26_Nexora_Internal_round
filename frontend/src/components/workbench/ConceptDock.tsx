import React, { useState } from "react";
import { ConceptItem } from "./data/mockDiagnoses";

interface ConceptDockProps {
  concepts: ConceptItem[];
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  onPracticeConcept?: (conceptId: string) => void;
}

export const ConceptDock: React.FC<ConceptDockProps> = ({
  concepts,
  isDrawerOpen,
  onToggleDrawer,
  onPracticeConcept,
}) => {
  const [activePopoverId, setActivePopoverId] = useState<string | null>(null);

  const renderMasteryRing = (state: ConceptItem["state"]) => {
    const size = 14;
    const strokeWidth = 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    if (state === "resolved") {
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14">
          <circle
            cx="7"
            cy="7"
            r={radius}
            fill="none"
            stroke="#2EA043"
            strokeWidth={strokeWidth}
          />
          <path
            d="M4 7l2 2 4-4"
            fill="none"
            stroke="#2EA043"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    if (state === "active") {
      return (
        <svg className="w-3.5 h-3.5 shrink-0 -rotate-90" viewBox="0 0 14 14">
          <circle
            cx="7"
            cy="7"
            r={radius}
            fill="none"
            stroke="#333333"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="7"
            cy="7"
            r={radius}
            fill="none"
            stroke="#F14C4C"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.4}
            strokeLinecap="round"
            className="transition-all duration-600"
          />
        </svg>
      );
    }

    if (state === "recurring") {
      return (
        <svg className="w-3.5 h-3.5 shrink-0 -rotate-90" viewBox="0 0 14 14">
          <circle
            cx="7"
            cy="7"
            r={radius}
            fill="none"
            stroke="#CCA700"
            strokeWidth={strokeWidth}
            strokeDasharray="2 2"
            className="transition-all duration-600"
          />
        </svg>
      );
    }

    // upcoming / never seen
    return (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14">
        <circle
          cx="7"
          cy="7"
          r={radius}
          fill="none"
          stroke="#555555"
          strokeWidth={strokeWidth}
        />
      </svg>
    );
  };

  const getStateLabel = (state: ConceptItem["state"]) => {
    switch (state) {
      case "active":
        return "Active misconception";
      case "resolved":
        return "Resolved";
      case "recurring":
        return "Verified once";
      default:
        return "Upcoming";
    }
  };

  return (
    <div className="h-[56px] bg-[#181818] border-t border-[#2B2B2B] px-4 flex items-center justify-between select-none relative z-30 shrink-0">
      {/* Left: label + concept chips */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1 min-w-0">
        <span className="text-[12px] text-[#777777] shrink-0 font-medium">
          Concepts in this lesson:
        </span>

        <div className="flex items-center gap-2">
          {concepts.map((concept) => {
            const isCurrent = concept.isCurrent;
            const isPopoverOpen = activePopoverId === concept.id;

            return (
              <div key={concept.id} className="relative">
                {/* Concept Chip */}
                <button
                  onClick={() =>
                    setActivePopoverId(isPopoverOpen ? null : concept.id)
                  }
                  className={`h-7 px-2.5 rounded-full flex items-center gap-2 text-xs transition-colors cursor-pointer border ${
                    isCurrent
                      ? "bg-[#222222] border-[#007ACC]/50 text-white font-medium"
                      : "bg-[#1E1E1E] border-[#2E2E2E] text-[#AAAAAA] hover:text-white hover:bg-[#252525]"
                  }`}
                  title={`${concept.name} (${getStateLabel(concept.state)})`}
                >
                  {renderMasteryRing(concept.state)}
                  <span className="truncate">{concept.name}</span>

                  {/* Subtle breathing dot for current working concept */}
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007ACC] animate-pulse" />
                  )}
                </button>

                {/* Popover (≤ 25 words) */}
                {isPopoverOpen && (
                  <div
                    className="wb-glass absolute bottom-9 left-0 w-64 rounded-[8px] p-3 text-xs text-[#CCCCCC] font-sans shadow-2xl z-50 border border-[#3C3C3C] animate-in fade-in slide-in-from-bottom-2 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-[#333333] mb-1.5">
                      <span className="font-semibold text-white truncate">
                        {concept.name}
                      </span>
                      <span className="text-[10px] text-[#CCA700] font-mono">
                        {getStateLabel(concept.state)}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#AAAAAA] leading-relaxed mb-2">
                      {concept.description}
                    </p>

                    {/* 5-segment attempt history ticks */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#2F2F2F]">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-[#777777]">History:</span>
                        {[0, 1, 2, 3, 4].map((i) => {
                          const result = concept.history[i];
                          return (
                            <span
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                result === "pass"
                                  ? "bg-[#2EA043]"
                                  : result === "fail"
                                  ? "bg-[#F14C4C]"
                                  : "bg-[#444444]"
                              }`}
                            />
                          );
                        })}
                      </div>

                      {onPracticeConcept && (
                        <button
                          onClick={() => {
                            setActivePopoverId(null);
                            onPracticeConcept(concept.id);
                          }}
                          className="text-[11px] text-[#3794FF] hover:text-white font-medium cursor-pointer"
                        >
                          Practice this →
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Expand Chevron for Drawer */}
      <div className="flex items-center gap-2 pl-2">
        <button
          onClick={onToggleDrawer}
          className={`h-7 px-2.5 rounded hover:bg-white/10 text-xs text-[#888888] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer ${
            isDrawerOpen ? "text-[#007ACC] font-medium" : ""
          }`}
          title="Toggle Drawer (Ctrl+J)"
          aria-expanded={isDrawerOpen}
        >
          <span>Tools</span>
          <span
            className={`codicon codicon-chevron-${
              isDrawerOpen ? "down" : "up"
            } text-xs transition-transform duration-200`}
          />
        </button>
      </div>
    </div>
  );
};
