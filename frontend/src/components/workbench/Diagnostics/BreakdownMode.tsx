import React from "react";

interface BreakdownToggleProps {
  active: boolean;
  onToggle: () => void;
}

export const BreakdownToggle: React.FC<BreakdownToggleProps> = ({ active, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`px-2 py-1 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer border ${
        active
          ? "bg-[#007ACC]/20 text-[#3794FF] border-[#007ACC]/50 font-medium"
          : "bg-transparent text-[#858585] hover:text-[#CCCCCC] border-transparent hover:bg-white/5"
      }`}
      title="Toggle Line-by-line Breakdown Mode"
      aria-pressed={active}
    >
      <span className="codicon codicon-list-flat text-xs" />
      <span>Breakdown</span>
      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#007ACC]" />}
    </button>
  );
};
