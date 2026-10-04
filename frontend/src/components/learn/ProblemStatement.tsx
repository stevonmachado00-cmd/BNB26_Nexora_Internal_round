import React from "react";
import { Problem } from "../../types";

interface ProblemStatementProps {
  problem: Problem;
}

export const ProblemStatement: React.FC<ProblemStatementProps> = ({ problem }) => {
  return (
    <div className="p-4 overflow-y-auto space-y-4 text-[#c9d1d9] text-xs h-full custom-scrollbar select-text">
      <div>
        <h2 className="text-base font-bold text-[#f0f6fc] tracking-tight">
          {problem.title}
        </h2>
        <p className="mt-1.5 text-[#8b949e] leading-relaxed text-xs">
          {problem.description}
        </p>
      </div>

      {/* Input / Output Spec */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <div className="p-2.5 rounded bg-[#12161f] border border-[#212734]">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#8b949e] block mb-1">
            Input:
          </span>
          <span className="text-xs text-[#c9d1d9] font-mono">{problem.inputDescription}</span>
        </div>
        <div className="p-2.5 rounded bg-[#12161f] border border-[#212734]">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#3fb950] block mb-1">
            Expected Output:
          </span>
          <span className="text-xs text-[#c9d1d9] font-mono">{problem.outputDescription}</span>
        </div>
      </div>

      {/* Constraints */}
      {problem.constraints && problem.constraints.length > 0 && (
        <div className="pt-1">
          <span className="text-[10px] font-mono font-semibold text-[#8b949e] uppercase tracking-wider block mb-1.5">
            Constraints & Notes
          </span>
          <ul className="space-y-1 text-xs text-[#8b949e]">
            {problem.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-[#484f58] select-none">•</span>
                <code className="text-[#c9d1d9] bg-[#12161f] px-1 py-0.2 rounded border border-[#212734] font-mono text-[11px]">
                  {c}
                </code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Examples */}
      <div className="pt-1 space-y-2.5">
        <span className="text-[10px] font-mono font-semibold text-[#8b949e] uppercase tracking-wider block">
          Test Case Examples
        </span>

        {problem.examples.map((example, idx) => (
          <div
            key={idx}
            className="p-3 rounded bg-[#090d13] border border-[#212734] font-mono text-xs space-y-1.5"
          >
            <div className="text-[#6e7681] font-semibold text-[10px]">Example {idx + 1}</div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-5">
              <div>
                <span className="text-[#6e7681] mr-1.5">Input:</span>
                <span className="text-[#c9d1d9]">{example.input}</span>
              </div>
              <div>
                <span className="text-[#6e7681] mr-1.5">Output:</span>
                <span className="text-[#3fb950] font-bold">{example.output}</span>
              </div>
            </div>
            {example.explanation && (
              <div className="text-[11px] text-[#8b949e] font-sans border-t border-[#1a202c] pt-1 mt-1">
                <span className="text-[#6e7681] font-mono mr-1">Note:</span>
                {example.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

