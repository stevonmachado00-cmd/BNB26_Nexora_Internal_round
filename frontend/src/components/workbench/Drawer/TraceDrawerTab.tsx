import React from "react";
import { RunResult } from "../data/mockDiagnoses";

interface TraceDrawerTabProps {
  runResult: RunResult | null;
  onStepChange?: (line: number) => void;
}

export const TraceDrawerTab: React.FC<TraceDrawerTabProps> = ({ runResult }) => (
  <div className="h-full flex bg-[#1F1F1F] text-[#CCCCCC] text-xs font-sans overflow-hidden">
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="flex items-center gap-2 pb-3 border-b border-[#2B2B2B]">
        <span className="font-semibold text-white">Model review</span>
        <span className="text-[#777777]">No simulated execution trace</span>
      </div>
      {!runResult ? (
        <p className="mt-4 text-[#888888]">Submit code to send it to the Re:Learn model.</p>
      ) : runResult.diagnoses.length ? (
        <div className="mt-4 space-y-2">
          {runResult.diagnoses.map((diagnosis) => (
            <div key={`${diagnosis.line}-${diagnosis.headline}`} className="rounded border border-[#3A3A3A] bg-[#181818] p-3">
              <p className="font-semibold text-white">{diagnosis.headline}</p>
              <p className="mt-1 text-[#AAAAAA]">{diagnosis.caption}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-[#888888]">{runResult.name}. The model has not returned a diagnosis yet.</p>
      )}
    </div>
    <div className="w-72 shrink-0 p-4 bg-[#181818] border-l border-[#2B2B2B]">
      <div className="font-semibold text-[#888888]">Model status</div>
      <p className="mt-3 text-[#AAAAAA]">This panel shows only information returned by Re:Learn. Python execution is not enabled in this build.</p>
      {runResult?.stderr && <pre className="mt-3 whitespace-pre-wrap text-[#F87171]">{runResult.stderr}</pre>}
    </div>
  </div>
);
