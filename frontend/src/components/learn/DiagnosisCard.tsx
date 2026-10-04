import React, { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Brain,
  MessageSquare,
  Activity,
  ArrowRight,
  HelpCircle,
  Layers,
} from "lucide-react";
import { Diagnosis } from "../../types";
import { Badge } from "../common/Badge";

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  onOpenProbe: () => void;
  onOpenTrace: () => void;
  onScrollToChat: () => void;
  onStartReassessment: () => void;
  hasAnsweredProbe: boolean;
}

export const DiagnosisCard: React.FC<DiagnosisCardProps> = ({
  diagnosis,
  onOpenProbe,
  onOpenTrace,
  onScrollToChat,
  onStartReassessment,
  hasAnsweredProbe,
}) => {
  const [isWhyOpen, setIsWhyOpen] = useState(false);

  return (
    <div className="rounded border border-[#523f14] bg-[#0c1017] p-3.5 text-xs text-[#c9d1d9] space-y-3 select-none">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-[#212734] pb-2.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge type={diagnosis.errorType} label="Conceptual Misconception" />
            <span className="font-mono text-[11px] text-[#d29922] font-semibold">
              Line {diagnosis.affectedLines.join(", ")}
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#f0f6fc] font-mono flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#d29922] shrink-0" />
            {diagnosis.primaryMisconceptionName}
          </h4>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-[#6e7681] font-mono">Confidence</div>
          <div className="text-xs font-mono font-bold text-[#d29922]">
            {diagnosis.confidence}%
          </div>
        </div>
      </div>

      {/* Code Snippet Highlight */}
      <div className="p-2 rounded bg-[#090d13] border border-[#212734] font-mono text-[11px] text-[#d29922] flex items-center justify-between">
        <span>Line {diagnosis.affectedLines[0] || 2}: {diagnosis.faultyCodeSnippet}</span>
        <span className="text-[10px] text-[#6e7681] font-sans">Faulty mental model</span>
      </div>

      {/* What Happened */}
      <div className="space-y-0.5">
        <span className="text-[#8b949e] font-semibold text-[10px] uppercase tracking-wider block font-mono">
          Observed Execution
        </span>
        <p className="text-[#c9d1d9] leading-relaxed text-xs">
          {diagnosis.whatHappened}
        </p>
      </div>

      {/* Why (The Underlying Misconception) */}
      <div className="p-2.5 rounded bg-[#181308] border border-[#3e2e0e] space-y-1">
        <span className="text-[#d29922] font-semibold text-[10px] uppercase tracking-wider block font-mono flex items-center gap-1">
          <Brain className="w-3 h-3 text-[#d29922]" />
          Underlying Mental Model
        </span>
        <p className="text-[#c9d1d9] leading-relaxed text-xs">
          {diagnosis.whyHappened}
        </p>
      </div>

      {/* Mental Model Fix */}
      <div className="p-2.5 rounded bg-[#0e1624] border border-[#1d2d47] space-y-1">
        <span className="text-[#58a6ff] font-semibold text-[10px] uppercase tracking-wider block font-mono">
          Conceptual Correction:
        </span>
        <p className="text-[#c9d1d9] leading-relaxed text-xs">
          {diagnosis.mentalModelFix}
        </p>
      </div>

      {/* Expandable Confidence Breakdown */}
      <div className="pt-0.5">
        <button
          onClick={() => setIsWhyOpen(!isWhyOpen)}
          className="w-full flex items-center justify-between py-1 text-[#8b949e] hover:text-[#f0f6fc] font-mono text-[10px] border-t border-[#212734] transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-[#8b949e]" />
            Hypothesis Distribution (Probabilistic Breakdown)
          </span>
          {isWhyOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 text-[#8b949e]" />}
        </button>

        {isWhyOpen && (
          <div className="mt-1.5 space-y-2 p-2.5 rounded bg-[#090d13] border border-[#212734]">
            {diagnosis.topAlternatives.map((alt) => (
              <div key={alt.misconceptionId} className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-[#c9d1d9] font-mono">
                    {alt.misconceptionName}
                  </span>
                  <span className="font-mono font-bold text-[#8b949e]">
                    {alt.confidence}%
                  </span>
                </div>
                <div className="w-full bg-[#161b24] h-1 rounded-sm overflow-hidden">
                  <div
                    className="bg-[#3b465c] h-full rounded-sm"
                    style={{ width: `${alt.confidence}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#6e7681]">{alt.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 font-mono">
        <button
          onClick={onOpenProbe}
          className={`px-2.5 py-1.5 rounded font-medium text-xs flex items-center justify-center gap-1.5 border transition-colors ${
            hasAnsweredProbe
              ? "bg-[#0c2013] text-[#3fb950] border-[#1e4a29]"
              : "bg-[#141922] hover:bg-[#1a212e] text-[#58a6ff] border-[#262e3d]"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#58a6ff]" />
          <span>{hasAnsweredProbe ? "✓ Probe Answered (94%)" : "Answer Probe"}</span>
        </button>

        <button
          onClick={onOpenTrace}
          className="px-2.5 py-1.5 rounded font-medium text-xs flex items-center justify-center gap-1.5 bg-[#141922] hover:bg-[#1a212e] text-[#c9d1d9] border border-[#262e3d] transition-colors"
        >
          <Activity className="w-3.5 h-3.5 text-[#8b949e]" />
          <span>Execution Trace</span>
        </button>

        <button
          onClick={onScrollToChat}
          className="px-2.5 py-1.5 rounded font-medium text-xs flex items-center justify-center gap-1.5 bg-[#141922] hover:bg-[#1a212e] text-[#c9d1d9] border border-[#262e3d] transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#8b949e]" />
          <span>Ask Re:Learn</span>
        </button>

        <button
          onClick={onStartReassessment}
          className="px-2.5 py-1.5 rounded font-bold text-xs flex items-center justify-center gap-1.5 bg-[#238636] hover:bg-[#2ea043] text-white border border-[#2ea043] transition-colors"
        >
          <span>Practice Concept</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

