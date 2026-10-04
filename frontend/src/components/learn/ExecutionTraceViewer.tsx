import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { TraceStep } from "../../types";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Play,
  Pause,
  Layers,
} from "lucide-react";

interface ExecutionTraceViewerProps {
  isOpen: boolean;
  onClose: () => void;
  traceSteps: TraceStep[];
}

export const ExecutionTraceViewer: React.FC<ExecutionTraceViewerProps> = ({
  isOpen,
  onClose,
  traceSteps,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  React.useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= traceSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, traceSteps.length]);

  if (!traceSteps || traceSteps.length === 0) return null;

  const currentStep = traceSteps[currentStepIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Memory Frame & Execution Trace Stepper"
      subtitle="Step through the Python runtime frame in memory to inspect variable scopes, stdout, and return flow."
      maxWidth="3xl"
    >
      <div className="space-y-3.5 text-xs text-[#c9d1d9]">
        {/* Progress & Step Controls */}
        <div className="flex items-center justify-between p-2.5 rounded bg-[#12161f] border border-[#212734]">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-xs font-bold text-[#58a6ff]">
              Frame {currentStepIndex + 1} / {traceSteps.length}
            </span>
            <span className="text-[#484f58]">|</span>
            <span className="text-[#8b949e] text-[11px]">
              Executing Line {currentStep.line}
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono">
            <button
              onClick={() => setCurrentStepIndex(0)}
              className="p-1 rounded text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#1a202c] transition-colors"
              title="Reset to step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#1a202c] transition-colors"
              title={isPlaying ? "Pause auto-step" : "Auto-play execution"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#58a6ff]" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
              disabled={currentStepIndex === 0}
              className="px-2.5 py-1 rounded bg-[#161b24] hover:bg-[#1f2634] disabled:opacity-40 font-medium text-xs flex items-center gap-1 border border-[#262e3d]"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              onClick={() => setCurrentStepIndex((p) => Math.min(traceSteps.length - 1, p + 1))}
              disabled={currentStepIndex === traceSteps.length - 1}
              className="px-2.5 py-1 rounded bg-[#1e2736] hover:bg-[#273347] text-[#f0f6fc] disabled:opacity-40 font-medium text-xs flex items-center gap-1 border border-[#37465f]"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full bg-[#12161f] h-1 rounded-sm overflow-hidden border border-[#212734]">
          <div
            className="bg-[#58a6ff] h-full rounded-sm transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / traceSteps.length) * 100}%` }}
          />
        </div>

        {/* Current Active Code & Stack Variables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Code Line Highlight */}
          <div className="p-3 rounded bg-[#090d13] border border-[#212734] space-y-2 font-mono">
            <div className="text-[10px] text-[#6e7681] uppercase tracking-wider">
              Instruction At Line {currentStep.line}
            </div>
            <div className="p-2 rounded bg-[#12161f] border border-[#262e3d] text-[#58a6ff] text-xs font-semibold">
              <code>{currentStep.code}</code>
            </div>
            <div className="text-[#8b949e] font-sans text-xs leading-relaxed pt-1">
              {currentStep.explanation}
            </div>
          </div>

          {/* Environment Stack & Variables */}
          <div className="p-3 rounded bg-[#0e1218] border border-[#212734] space-y-2.5">
            <div className="flex items-center justify-between text-[10px] text-[#8b949e] uppercase tracking-wider font-mono">
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#58a6ff]" />
                Variable Memory Frame
              </span>
              <span className="text-[#6e7681]">add() scope</span>
            </div>

            <div className="space-y-1 font-mono text-xs">
              {Object.entries(currentStep.variables).map(([name, val]) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-1.5 rounded bg-[#12161f] border border-[#212734]"
                >
                  <span className="text-[#8b949e]">{name}</span>
                  <span className="text-[#f0f6fc]">{String(val)}</span>
                </div>
              ))}
            </div>

            {/* Special Highlight: Return Value vs Stdout */}
            <div className="pt-1.5 border-t border-[#212734] space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between p-1.5 rounded bg-[#181308] border border-[#3e2e0e]">
                <span className="text-[#d29922]">Terminal Stdout:</span>
                <span className="font-bold text-[#e3b341]">
                  {currentStep.stdout ? `"${currentStep.stdout}"` : "(none)"}
                </span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-[#1f0e12] border border-[#4a1c22]">
                <span className="text-[#f85149]">Caller Return Value:</span>
                <span className="font-bold text-[#f85149]">
                  {currentStep.returnValue || "None (Default)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Insight note */}
        <div className="p-2.5 rounded bg-[#12161f] border border-[#212734] text-[11px] text-[#8b949e] leading-relaxed">
          <span className="font-bold text-[#f0f6fc] mr-1 font-mono">Trace Insight:</span>
          While stdout printed <code className="bg-[#161b24] px-1 py-0.2 rounded font-mono text-[#e3b341]">8</code>, the function exited without returning anything.
          Python handed <code className="bg-[#161b24] px-1 py-0.2 rounded font-mono text-[#f85149]">None</code> to the caller scope.
        </div>
      </div>
    </Modal>
  );
};
