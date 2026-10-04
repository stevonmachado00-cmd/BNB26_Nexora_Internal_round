import React from "react";

interface StrengthenBannerProps {
  conceptName: string;
  onStartPractice: () => void;
  onDismiss: () => void;
}

export const StrengthenBanner: React.FC<StrengthenBannerProps> = ({
  conceptName,
  onStartPractice,
  onDismiss,
}) => {
  return (
    <div className="wb-glass border-t border-[#2EA043]/30 px-4 py-2.5 flex items-center justify-between text-xs select-none relative z-20 animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-[#2EA043] animate-pulse" />
        <span className="font-semibold text-white">Next: Strengthen it</span>
        <span className="text-[#666666]">·</span>
        <span className="text-[#AAAAAA]">
          Verified once. Lock in your understanding of <strong className="text-white">{conceptName}</strong> with 3 quick transfer checks.
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onDismiss}
          className="px-2.5 py-1 text-[#888888] hover:text-white transition-colors cursor-pointer"
        >
          Later
        </button>
        <button
          onClick={onStartPractice}
          className="px-3.5 py-1 rounded bg-[#007ACC] hover:bg-[#0098FF] text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
        >
          <span>Start practice</span>
          <span className="codicon codicon-arrow-right text-xs" />
        </button>
      </div>
    </div>
  );
};
