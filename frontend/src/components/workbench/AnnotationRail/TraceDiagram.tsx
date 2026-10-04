import React from "react";
import { DiagramStep } from "../data/mockDiagnoses";

interface TraceDiagramProps {
  steps?: DiagramStep[];
  caption?: string;
}

export const TraceDiagram: React.FC<TraceDiagramProps> = ({
  steps = [
    { id: "call", label: "add(5, 3)", type: "call" },
    { id: "print", label: "print 8", sublabel: "screen only", type: "print" },
    { id: "ret", label: "returns None", type: "return", strike: true },
    { id: "var", label: "result =", value: "None", sublabel: "variable box", type: "var" },
  ],
  caption = "print() shows. return gives.",
}) => {
  return (
    <div className="space-y-2 select-none">
      {/* Horizontal chain of small mono nodes with animated arrows */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 scrollbar-none font-mono text-[11px]">
        {steps.map((step, idx) => {
          const isCall = step.type === "call";
          const isPrint = step.type === "print";
          const isReturn = step.type === "return";
          const isVar = step.type === "var";

          return (
            <React.Fragment key={step.id}>
              {/* Node container */}
              <div
                className={`relative px-2 py-1 rounded border flex flex-col items-center shrink-0 transition-transform ${
                  isCall
                    ? "bg-[#1E1E1E] border-[#383838] text-[#9CDCFE]"
                    : isPrint
                    ? "bg-[#1A1A1A] border-[#333333] text-[#888888]"
                    : isReturn
                    ? "bg-[#2A1515] border-[#F14C4C]/40 text-[#F87171]"
                    : "bg-[#252526] border-[#3794FF]/40 text-[#CCCCCC]"
                }`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex items-center gap-1">
                  <span className={step.strike ? "line-through opacity-80" : ""}>
                    {step.label}
                  </span>
                  {isVar && step.value && (
                    <span className="px-1.5 py-0.2 rounded bg-[#111111] border border-[#F14C4C]/60 text-[#F87171] font-bold text-[10px] ml-0.5">
                      {step.value}
                    </span>
                  )}
                </div>

                {step.sublabel && (
                  <span className="text-[9px] text-[#777777] font-sans mt-0.5">
                    {step.sublabel}
                  </span>
                )}
              </div>

              {/* Arrow */}
              {idx < steps.length - 1 && (
                <span className="text-[#555555] text-xs shrink-0 select-none">→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 1-line caption max */}
      {caption && (
        <div className="text-[11px] font-sans text-[#888888] italic tracking-tight">
          {caption}
        </div>
      )}
    </div>
  );
};
