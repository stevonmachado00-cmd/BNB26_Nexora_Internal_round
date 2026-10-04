import React from "react";

export type LoopNodeId = "attempt" | "diagnose" | "fix" | "transfer" | "verified";

interface LoopTrackProps {
  currentNode: LoopNodeId;
  completedNodes: LoopNodeId[];
}

export const LoopTrack: React.FC<LoopTrackProps> = ({ currentNode, completedNodes }) => {
  const nodes: { id: LoopNodeId; label: string; tooltip: string }[] = [
    { id: "attempt", label: "Attempt", tooltip: "Try your solution first" },
    { id: "diagnose", label: "Diagnose", tooltip: "Spot the faulty belief" },
    { id: "fix", label: "Fix", tooltip: "Correct your logic" },
    { id: "transfer", label: "Transfer", tooltip: "Practice across new contexts" },
    { id: "verified", label: "Verified", tooltip: "Mastery locked in" },
  ];

  return (
    <div
      className="flex items-center gap-1 select-none font-sans"
      title="Learning Loop: Attempt → Diagnose → Fix → Transfer → Verified"
      aria-label="Learning loop progress"
    >
      {nodes.map((node, index) => {
        const isCompleted = completedNodes.includes(node.id);
        const isCurrent = currentNode === node.id && !isCompleted;
        const isLast = index === nodes.length - 1;

        return (
          <React.Fragment key={node.id}>
            {/* Node */}
            <div className="group relative flex items-center justify-center">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 cursor-help ${
                  isCompleted
                    ? "bg-[#2EA043] text-white shadow-sm"
                    : isCurrent
                    ? "bg-[#007ACC] text-white animate-pulse ring-2 ring-[#007ACC]/40"
                    : "border border-[#444444] bg-[#181818]"
                }`}
              >
                {isCompleted ? (
                  <span className="codicon codicon-check text-[10px]" />
                ) : isCurrent ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-[#555555]" />
                )}
              </div>

              {/* Tooltip ≤ 8 words */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
                <div className="wb-glass px-2 py-1 rounded text-[10px] text-white whitespace-nowrap shadow-md">
                  <span className="font-semibold text-[#007ACC] mr-1">{node.label}:</span>
                  <span>{node.tooltip}</span>
                </div>
              </div>
            </div>

            {/* Hairline connector */}
            {!isLast && (
              <div
                className={`w-4 sm:w-6 h-[1px] transition-colors duration-300 ${
                  isCompleted ? "bg-[#2EA043]" : "bg-[#333333]"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
