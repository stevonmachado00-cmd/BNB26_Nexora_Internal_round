import React from "react";
import { Clock, ShieldCheck, Tag } from "lucide-react";
import { Problem } from "../../types";
import { Badge } from "../common/Badge";

interface ProblemHeaderProps {
  problem: Problem;
  problemIndex?: number;
  totalProblems?: number;
}

export const ProblemHeader: React.FC<ProblemHeaderProps> = ({
  problem,
  problemIndex = 12,
  totalProblems = 40,
}) => {
  return (
    <div className="px-4 py-2.5 border-b border-[#212734] bg-[#0c1017] flex flex-wrap items-center justify-between gap-2.5 select-none text-xs">
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-[#141922] text-[#c9d1d9] border border-[#262e3d]">
          Problem {problemIndex} / {totalProblems}
        </span>
        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e] font-mono">
          <Tag className="w-3 h-3 text-[#6e7681]" />
          <span>{problem.concept}</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#8b949e]">
          <Clock className="w-3 h-3 text-[#6e7681]" />
          <span>Est. {problem.estimatedTime}</span>
        </div>

        <Badge
          label={problem.difficulty.toUpperCase()}
          variant={
            problem.difficulty === "easy"
              ? "success"
              : problem.difficulty === "medium"
              ? "warning"
              : "error"
          }
          size="sm"
        />

        {problem.verified && (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#3fb950] bg-[#0c2013] px-1.5 py-0.2 rounded border border-[#1e4a29]">
            <ShieldCheck className="w-3 h-3 text-[#3fb950]" />
            Verified Spec
          </span>
        )}
      </div>
    </div>
  );
};

