import React from "react";
import {
  Menu,
  Play,
  RotateCcw,
  GitCompare,
} from "lucide-react";
import { LearnerProfile } from "../../types";

interface TopBarProps {
  currentPath: string;
  learner: LearnerProfile;
  onToggleMobile: () => void;
  onOpenDemoTour: () => void;
  onOpenLearnerComparison: () => void;
  onResetData: () => void;
  onNavigate: (path: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPath,
  learner,
  onToggleMobile,
  onOpenDemoTour,
  onOpenLearnerComparison,
  onResetData,
  onNavigate,
}) => {
  const getBreadcrumb = (path: string) => {
    if (path.startsWith("/learn")) return "re:learn / workspace / functions_return_values";
    if (path === "/dashboard") return "re:learn / dashboard";
    if (path === "/progress") return "re:learn / analytics / mastery_map";
    if (path === "/misconceptions") return "re:learn / catalog / misconceptions";
    if (path === "/history") return "re:learn / audit_log / submissions";
    if (path === "/profile") return "re:learn / config / learner_profile";
    if (path.startsWith("/reassessment")) return "re:learn / transfer_evaluation";
    return "re:learn";
  };

  return (
    <header className="h-11 border-b border-[#212734] bg-[#0c1017] px-3.5 flex items-center justify-between sticky top-0 z-20 select-none">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleMobile}
          className="md:hidden p-1 text-[#8b949e] hover:text-[#f0f6fc] rounded hover:bg-[#161c26]"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#8b949e]">
          <span className="text-[#c9d1d9]">{getBreadcrumb(currentPath)}</span>
        </div>
      </div>

      {/* Action Tools & Demo Controls */}
      <div className="flex items-center gap-2">
        {/* Learner A vs B Compare Modal Trigger */}
        <button
          onClick={onOpenLearnerComparison}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium bg-[#141922] text-[#c9d1d9] hover:text-[#f0f6fc] hover:bg-[#1c2330] border border-[#262e3d] transition-colors"
          title="Compare look-alike mistakes: Misconception vs Careless Slip"
        >
          <GitCompare className="w-3.5 h-3.5 text-[#58a6ff]" />
          <span>Learner A vs B</span>
        </button>

        {/* 3-Minute Demo Tour Guided Trigger */}
        <button
          onClick={onOpenDemoTour}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold bg-[#1e2736] hover:bg-[#273347] text-[#f0f6fc] border border-[#37465f] transition-colors"
        >
          <Play className="w-3 h-3 fill-current text-[#f0f6fc]" />
          <span>3-Min Demo Tour</span>
        </button>

        {/* Quick Reset Button */}
        <button
          onClick={onResetData}
          className="p-1 rounded text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#161c26] border border-transparent hover:border-[#212734] transition-colors"
          title="Reset Demo Data to Initial State"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Learner Avatar Pill */}
        <button
          onClick={() => onNavigate("/profile")}
          className="flex items-center gap-1.5 pl-2 pr-1 py-0.5 rounded bg-[#12161f] border border-[#212734] hover:border-[#303848] transition-colors"
        >
          <span className="text-xs font-mono text-[#c9d1d9] hidden sm:inline">
            {learner.name.split(" ")[0]}
          </span>
          <div className="w-5 h-5 rounded bg-[#1f2634] border border-[#303c52] flex items-center justify-center text-[10px] font-mono font-bold text-[#f0f6fc]">
            {learner.name.charAt(0)}
          </div>
        </button>
      </div>
    </header>
  );
};

