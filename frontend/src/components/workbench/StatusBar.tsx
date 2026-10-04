import React from "react";
import { WorkbenchStatus } from "./state/workbenchMachine";
import { LineDiagnosis } from "./data/mockDiagnoses";

interface StatusBarProps {
  status: WorkbenchStatus;
  diagnoses: LineDiagnosis[];
  cursorPos: { line: number; col: number };
  autoCompile: boolean;
  onToggleAutoCompile: () => void;
  onOpenDrawer: () => void;
  onRunExecution: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  status,
  diagnoses,
  cursorPos,
  autoCompile,
  onToggleAutoCompile,
  onOpenDrawer,
  onRunExecution,
}) => {
  const errorCount = diagnoses.filter((d) => d.status === "error").length;

  return (
    <footer
      className="h-[24px] bg-[#181818] border-t-2 border-[#007ACC] text-[#CCCCCC] text-[11px] font-sans flex items-center justify-between px-3 select-none shrink-0 z-30"
    >
      {/* Left side items */}
      <div className="flex items-center h-full gap-2">
        {/* Model submission status */}
        <button
          onClick={onRunExecution}
          className="h-full px-2 flex items-center gap-1.5 hover:bg-white/5 transition-colors cursor-pointer text-[#AAAAAA] hover:text-white"
          title="Submit code for model diagnosis"
        >
          {status === "running" ? (
            <>
              <span className="codicon codicon-loading codicon-modifier-spin text-xs text-[#007ACC]" />
              <span>Model is reviewing…</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#007ACC]" />
              <span>Model diagnosis</span>
            </>
          )}
        </button>

        {/* Small colored dot + count only (never recolors whole bar) */}
        {errorCount > 0 ? (
          <button
            onClick={onOpenDrawer}
            className="h-full px-2 flex items-center gap-1.5 hover:bg-white/5 transition-colors cursor-pointer text-[#F87171]"
            title="Show diagnosis tests and output"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F14C4C]" />
            <span>{errorCount} problem</span>
          </button>
        ) : (
          <span className="text-[#666666] flex items-center gap-1.5 px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EA043]" />
            <span>0 problems</span>
          </span>
        )}
      </div>

      {/* Right side items */}
      <div className="flex items-center h-full text-[#888888]">
        {/* Line & Column */}
        <div className="h-full px-2 flex items-center font-mono">
          Ln {cursorPos.line}, Col {cursorPos.col}
        </div>

        {/* Spaces */}
        <div className="h-full px-2 hidden sm:flex items-center">
          Spaces: 4
        </div>

        {/* Python Version */}
        <div className="h-full px-2 hidden md:flex items-center gap-1">
          <span className="codicon codicon-file-code text-xs text-[#CCA700]" />
          <span>Python 3.11</span>
        </div>

      </div>
    </footer>
  );
};
