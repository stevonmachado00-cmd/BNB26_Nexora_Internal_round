import React from "react";
import { LearnerProfile } from "../types";
import {
  Brain,
  Cpu,
  Layers,
} from "lucide-react";
import { SkillBar } from "../components/common/SkillBar";

interface ProgressPageProps {
  learner: LearnerProfile;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ learner }) => {
  return (
    <div className="p-5 max-w-5xl mx-auto space-y-5 text-[#c9d1d9] select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#f0f6fc] font-mono">
            Cognitive Learning Analytics
          </h1>
          <p className="text-xs text-[#8b949e]">
            Tracking mental models, concept retention, and diagnostic velocity.
          </p>
        </div>

        <div className="px-2.5 py-1 rounded bg-[#12161f] border border-[#212734] font-mono text-[11px] text-[#8b949e] self-start sm:self-auto flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-[#58a6ff]" />
          <span>Cognitively Calibrated</span>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Python Mastery */}
        <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
            <span>Python Mastery</span>
            <span className="text-[#3fb950] font-bold">+8%</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#f0f6fc]">
            {learner.masteryPercentage}%
          </div>
          <p className="text-[10px] text-[#6e7681] font-sans leading-snug">
            Aggregated across 7 core Python domains with active misconception weights.
          </p>
        </div>

        {/* Resolved Misconceptions */}
        <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
            <span>Misconceptions Cleared</span>
            <span className="text-[#d29922] font-bold">{learner.activeMisconceptionsCount} active</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#f0f6fc]">
            {learner.misconceptionsResolved}
          </div>
          <p className="text-[10px] text-[#6e7681] font-sans leading-snug">
            Permanently verified through transfer challenges and delayed spaced re-checks.
          </p>
        </div>

        {/* Guidance Efficiency */}
        <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
            <span>Hint Ladder Efficiency</span>
            <span className="text-[#58a6ff] font-bold">Optimal</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#f0f6fc]">
            {learner.averageHintsNeeded}
          </div>
          <p className="text-[10px] text-[#6e7681] font-sans leading-snug">
            Average hints requested before arriving at an independent conceptual breakthrough.
          </p>
        </div>
      </div>

      {/* Main Breakdown: Concept Mastery Skills */}
      <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-3">
        <div className="flex items-center justify-between font-mono">
          <div>
            <h3 className="text-sm font-bold text-[#f0f6fc]">
              Concept Mastery Breakdown
            </h3>
            <p className="text-[11px] text-[#8b949e] font-sans mt-0.5">
              Weighted by verified problem outputs and transfer assessments.
            </p>
          </div>
          <span className="text-[10px] text-[#6e7681] hidden sm:inline">
            Target: 85%+ for placement readiness
          </span>
        </div>

        <div className="space-y-1.5">
          {learner.skills.map((skill) => (
            <SkillBar key={skill.concept} skill={skill} />
          ))}
        </div>
      </div>

      {/* Cognitive Learning Habits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-2.5 text-xs">
          <h4 className="font-bold text-[#f0f6fc] text-xs font-mono flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-[#58a6ff]" />
            Cognitive Diagnostics & Preferences
          </h4>
          <div className="space-y-1.5">
            <div className="p-2.5 rounded bg-[#090d13] border border-[#212734]">
              <span className="font-semibold text-[#c9d1d9] font-mono text-[11px] block mb-0.5">
                Optimal Explanatory Representation
              </span>
              <p className="text-[#8b949e] text-xs leading-relaxed">
                You resolve faulty models 2.4x faster when presented with <strong>Contrast Examples</strong> comparing flawed vs sound code.
              </p>
            </div>
            <div className="p-2.5 rounded bg-[#090d13] border border-[#212734]">
              <span className="font-semibold text-[#c9d1d9] font-mono text-[11px] block mb-0.5">
                Syntax & Typing Reliability
              </span>
              <p className="text-[#8b949e] text-xs leading-relaxed">
                Your syntax accuracy in conditions and loops has stabilized at 96%, indicating high typing fidelity and minimal accidental typos.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-2.5 text-xs">
          <h4 className="font-bold text-[#f0f6fc] text-xs font-mono flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#3fb950]" />
            Domain Readiness Matrix
          </h4>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between p-2 rounded bg-[#090d13] border border-[#212734]">
              <span className="text-[#c9d1d9]">Basic Data Structures</span>
              <span className="text-[#3fb950] font-bold">READY</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#090d13] border border-[#212734]">
              <span className="text-[#c9d1d9]">Control Flow & Iteration</span>
              <span className="text-[#3fb950] font-bold">READY</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#090d13] border border-[#212734]">
              <span className="text-[#c9d1d9]">Functional Decomposition</span>
              <span className="text-[#d29922] font-bold">IN PROGRESS</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#090d13] border border-[#212734]">
              <span className="text-[#8b949e]">Recursive Data Structures</span>
              <span className="text-[#6e7681]">UPCOMING (LVL 9)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
