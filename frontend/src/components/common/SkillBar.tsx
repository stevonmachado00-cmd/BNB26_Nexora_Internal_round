import React from "react";
import { LearnerSkill } from "../../types";

interface SkillBarProps {
  skill: LearnerSkill;
  onClick?: () => void;
}

export const SkillBar: React.FC<SkillBarProps> = ({ skill, onClick }) => {
  // Determine color based on percentage
  let barColor = "bg-[#f85149]";
  let statusText = "Needs Attention";
  let statusBadge = "text-[#f85149] bg-[#261114] border-[#542227]";

  if (skill.masteryPercentage >= 85) {
    barColor = "bg-[#2ea043]";
    statusText = "Mastered";
    statusBadge = "text-[#3fb950] bg-[#0c2013] border-[#1e4a29]";
  } else if (skill.masteryPercentage >= 70) {
    barColor = "bg-[#388bfd]";
    statusText = "Proficient";
    statusBadge = "text-[#58a6ff] bg-[#0e1b2e] border-[#1f3b60]";
  } else if (skill.masteryPercentage >= 55) {
    barColor = "bg-[#d29922]";
    statusText = "Developing";
    statusBadge = "text-[#d29922] bg-[#231b09] border-[#523f14]";
  }

  return (
    <div
      onClick={onClick}
      className={`p-2.5 rounded bg-[#0e1218] border border-[#212734] hover:border-[#303848] transition-colors ${
        onClick ? "cursor-pointer hover:bg-[#131722]" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="font-medium text-xs text-[#f0f6fc]">{skill.concept}</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${statusBadge}`}>
            {statusText}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          {skill.trend && (
            <span
              className={`text-[11px] ${
                skill.trend.startsWith("+")
                  ? "text-[#3fb950]"
                  : skill.trend.startsWith("-")
                  ? "text-[#f85149]"
                  : "text-[#8b949e]"
              }`}
            >
              {skill.trend}
            </span>
          )}
          <span className="font-bold text-[#f0f6fc]">
            {skill.masteryPercentage}%
          </span>
        </div>
      </div>

      <div className="w-full bg-[#090d13] rounded-sm h-1.5 overflow-hidden border border-[#1e2533]">
        <div
          className={`h-full rounded-sm transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${skill.masteryPercentage}%` }}
        />
      </div>
    </div>
  );
};

