import React from "react";
import { LearnerProfile } from "../types";
import {
  Target,
  Brain,
  RotateCcw,
  Layers,
} from "lucide-react";
import { ProgressBar } from "../components/common/ProgressBar";

interface ProfilePageProps {
  learner: LearnerProfile;
  onProfileUpdated: (updated: LearnerProfile) => void;
  onResetData: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  learner,
  onResetData,
}) => {
  return (
    <div className="p-5 max-w-4xl mx-auto space-y-5 text-[#c9d1d9] select-none">
      {/* Profile Header Card */}
      <div className="p-5 rounded bg-[#0e1218] border border-[#212734] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded bg-[#161c26] border border-[#262e3d] flex items-center justify-center text-[#f0f6fc] font-mono font-bold text-xl">
            {learner.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#f0f6fc] font-mono tracking-tight">
              {learner.name}
            </h1>
            <p className="text-xs text-[#8b949e] font-mono">
              {learner.email} • {learner.title}
            </p>
            <div className="flex items-center gap-2 mt-1.5 font-mono">
              <span className="text-[11px] px-2 py-0.2 rounded bg-[#141922] text-[#8b949e] border border-[#262e3d]">
                Target: {learner.goal}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onResetData}
          className="px-3 py-1.5 rounded bg-[#141922] hover:bg-[#1c2330] text-[#c9d1d9] text-xs font-mono border border-[#262e3d] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Level System Philosophy Banner */}
      <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-2.5">
        <div className="flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#58a6ff]" />
            <span className="font-bold text-sm text-[#f0f6fc]">
              LEVEL {learner.level}: {learner.levelTitle.toUpperCase()}
            </span>
          </div>
          <span className="text-xs font-bold text-[#f0f6fc]">
            {learner.masteryPercentage}% Python Mastery
          </span>
        </div>

        <ProgressBar value={learner.masteryProgressToNextLevel} color="indigo" height="md" />

        <div className="p-2.5 rounded bg-[#090d13] border border-[#1e2533] text-[11px] text-[#8b949e] leading-relaxed font-mono">
          <span className="text-[#f0f6fc] font-bold mr-1">Cognitive Level Principle:</span>
          Your level increases when underlying understanding improves via concept transfer, not simply when you brute-force more question counts.
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="p-3.5 rounded bg-[#0e1218] border border-[#212734] space-y-1">
          <div className="text-[11px] text-[#8b949e]">Problems Solved</div>
          <div className="text-xl font-bold text-[#f0f6fc]">
            {learner.problemsSolved}
          </div>
          <div className="text-[10px] text-[#6e7681] font-sans">Verified challenge submissions</div>
        </div>

        <div className="p-3.5 rounded bg-[#0e1218] border border-[#212734] space-y-1">
          <div className="text-[11px] text-[#8b949e]">Misconceptions Resolved</div>
          <div className="text-xl font-bold text-[#3fb950]">
            {learner.misconceptionsResolved}
          </div>
          <div className="text-[10px] text-[#6e7681] font-sans">Graduated through transfer tests</div>
        </div>

        <div className="p-3.5 rounded bg-[#0e1218] border border-[#212734] space-y-1">
          <div className="text-[11px] text-[#8b949e]">Active / Recurring</div>
          <div className="text-xl font-bold text-[#d29922]">
            {learner.activeMisconceptionsCount} / {learner.recurringMisconceptionsCount}
          </div>
          <div className="text-[10px] text-[#6e7681] font-sans">Under active cognitive tracking</div>
        </div>
      </div>

      {/* Learning Preferences & Style Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-2.5 text-xs">
          <h3 className="font-bold text-[#f0f6fc] text-xs font-mono flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-[#58a6ff]" />
            Cognitive Profile
          </h3>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="p-2.5 rounded bg-[#090d13] border border-[#212734] flex items-center justify-between">
              <span className="text-[#8b949e]">Optimal Explanation:</span>
              <span className="font-bold text-[#f0f6fc]">
                {learner.effectiveTeachingStyle}
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#090d13] border border-[#212734] flex items-center justify-between">
              <span className="text-[#8b949e]">Average Hints Requested:</span>
              <span className="font-bold text-[#f0f6fc]">
                {learner.averageHintsNeeded} per struggle
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-2.5 text-xs">
          <h3 className="font-bold text-[#f0f6fc] text-xs font-mono flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#3fb950]" />
            Concept Mastery Matrix
          </h3>
          <div className="space-y-1.5">
            <div className="p-2.5 rounded bg-[#090d13] border border-[#212734]">
              <span className="text-[#8b949e] font-mono text-[10px] block mb-1">Strongest Concepts:</span>
              <div className="flex flex-wrap gap-1">
                {learner.strongestConcepts.map((c) => (
                  <span
                    key={c}
                    className="px-1.5 py-0.2 rounded bg-[#0c2013] text-[#3fb950] border border-[#1e4a29] font-mono text-[10px]"
                  >
                    ✓ {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-2.5 rounded bg-[#090d13] border border-[#212734]">
              <span className="text-[#8b949e] font-mono text-[10px] block mb-1">Targeted for Practice:</span>
              <div className="flex flex-wrap gap-1">
                {learner.needsPractice.map((c) => (
                  <span
                    key={c}
                    className="px-1.5 py-0.2 rounded bg-[#231b09] text-[#d29922] border border-[#523f14] font-mono text-[10px]"
                  >
                    ⚠ {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
