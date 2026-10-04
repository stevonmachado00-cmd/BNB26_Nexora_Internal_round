import React, { useState } from "react";
import {
  LearnerProfile,
  Misconception,
  LearningHistoryEvent,
  LearnerSkill,
} from "../types";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  History,
  Terminal,
} from "lucide-react";
import { SkillBar } from "../components/common/SkillBar";
import { Badge } from "../components/common/Badge";
import { Modal } from "../components/common/Modal";

interface DashboardPageProps {
  learner: LearnerProfile;
  misconceptions: Misconception[];
  historyEvents: LearningHistoryEvent[];
  onContinueLearning: () => void;
  onReviewMisconception: (misconceptionId: string) => void;
  onTriggerDelayedRecheck: () => void;
  onNavigateToHistory: () => void;
  delayedCheckDue?: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  learner,
  misconceptions,
  historyEvents,
  onContinueLearning,
  onReviewMisconception,
  onTriggerDelayedRecheck,
  onNavigateToHistory,
  delayedCheckDue = false,
}) => {
  const [selectedConcept, setSelectedConcept] = useState<LearnerSkill | null>(null);

  const activeMisconceptions = misconceptions.filter(
    (m) => m.status === "active" || m.status === "recurring"
  );

  return (
    <div className="p-5 max-w-5xl mx-auto space-y-5 text-[#c9d1d9] select-none">
      {/* Delayed Re-Check Notification Banner */}
      {delayedCheckDue && (
        <div className="p-3.5 rounded bg-[#161d28] border border-[#388bfd]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#1f293d] border border-[#37496d] flex items-center justify-center text-[#58a6ff] shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-[#f0f6fc] font-mono flex items-center gap-2">
                <span>Delayed Memory Retention Check Due: Return vs Print</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0e1b2e] text-[#58a6ff] border border-[#1f3b60] uppercase">
                  Spaced Retention
                </span>
              </div>
              <p className="text-[11px] text-[#8b949e] mt-0.5">
                Spaced interval elapsed since initial transfer pass. Verify whether the mental model remains consolidated.
              </p>
            </div>
          </div>

          <button
            onClick={onTriggerDelayedRecheck}
            className="px-3 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-mono font-semibold text-xs border border-[#2ea043] transition-colors self-start sm:self-auto shrink-0"
          >
            Start Re-Check →
          </button>
        </div>
      )}

      {/* Greeting Header */}
      <div className="space-y-0.5">
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#f0f6fc] font-mono">
          Learner: {learner.name.split(" ")[0]} // Level {learner.level}
        </h1>
        <p className="text-xs text-[#8b949e] font-mono">
          Target track: <span className="text-[#f0f6fc]">{learner.goal}</span> • Python Mastery: <span className="text-[#3fb950] font-bold">{learner.masteryPercentage}%</span>
        </p>
      </div>

      {/* Recommended Problem Banner */}
      <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-3">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span className="text-[#8b949e] font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" />
            Recommended Problem
          </span>
          <span className="text-[#8b949e]">
            Difficulty: <span className="text-[#d29922] font-bold">Medium</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <div className="md:col-span-2 space-y-1.5">
            <div className="text-[11px] text-[#8b949e] font-mono">
              Domain: <span className="text-[#c9d1d9]">Functions → Return Values & Caller Scope</span>
            </div>
            <h3 className="text-base font-bold text-[#f0f6fc] font-mono">
              Problem 12: Calculate Total (Sum of Two Numbers)
            </h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Reinforce the strict boundary between terminal side-effects and returned data variables.
            </p>

            <div className="space-y-1 pt-0.5 max-w-sm font-mono text-xs">
              <div className="flex justify-between text-[10px] text-[#8b949e]">
                <span>Unit Progress</span>
                <span className="text-[#f0f6fc] font-semibold">78%</span>
              </div>
              <div className="w-full bg-[#090d13] h-1.5 rounded-sm overflow-hidden border border-[#212734]">
                <div className="bg-[#388bfd] h-full rounded-sm" style={{ width: "78%" }} />
              </div>
            </div>
          </div>

          <div className="flex md:justify-end">
            <button
              onClick={onContinueLearning}
              className="w-full md:w-auto px-4 py-2 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-mono font-bold text-xs border border-[#2ea043] flex items-center justify-center gap-2 transition-colors"
            >
              <span>Solve Problem</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Skill Map vs Active Misconceptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Skill Map (2 cols) */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8b949e]">
              PYTHON SKILL MAP
            </h3>
            <span className="text-[10px] text-[#6e7681] font-mono">
              Click concept for cognitive breakdown
            </span>
          </div>

          <div className="space-y-1.5">
            {learner.skills.map((skill) => (
              <SkillBar
                key={skill.concept}
                skill={skill}
                onClick={() => setSelectedConcept(skill)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Active Misconceptions & Recent Activity */}
        <div className="space-y-4">
          {/* Active Misconceptions Card */}
          <div className="p-3.5 rounded bg-[#0e1218] border border-[#212734] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8b949e] flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-[#d29922]" />
                Active Misconceptions
              </h3>
              <span className="text-[11px] font-mono font-semibold text-[#d29922]">
                {activeMisconceptions.length} active
              </span>
            </div>

            <div className="space-y-2">
              {activeMisconceptions.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded bg-[#090d13] border border-[#3e2e0e] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#f0f6fc] text-xs font-mono">{m.name}</span>
                    <Badge type={m.status} label={m.status.toUpperCase()} size="sm" />
                  </div>
                  <div className="text-[11px] text-[#8b949e] leading-snug">
                    {m.faultyBelief}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#1a202c] text-[10px] text-[#6e7681] font-mono">
                    <span>Seen {m.occurrenceCount}x</span>
                    <button
                      onClick={() => onReviewMisconception(m.id)}
                      className="text-[#58a6ff] hover:text-[#79b8ff] font-bold"
                    >
                      Reassess →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="p-3.5 rounded bg-[#0e1218] border border-[#212734] space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8b949e] flex items-center gap-1.5">
                <History className="w-3 h-3 text-[#8b949e]" />
                Recent Activity
              </h3>
              <button
                onClick={onNavigateToHistory}
                className="text-[10px] text-[#58a6ff] hover:text-[#79b8ff] font-mono"
              >
                View all
              </button>
            </div>

            <div className="space-y-1.5">
              {historyEvents.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className="p-2 rounded bg-[#090d13] border border-[#1e2533] flex items-start gap-2"
                >
                  {event.type.includes("resolved") || event.type.includes("solved") || event.type.includes("passed") ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-[#d29922] shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#c9d1d9] text-[11px] truncate font-mono">
                      {event.title}
                    </div>
                    <div className="text-[10px] text-[#6e7681] truncate font-mono">
                      {event.relatedConcept} • {event.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Concept Breakdown Modal */}
      {selectedConcept && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedConcept(null)}
          title={`Concept Breakdown: ${selectedConcept.concept}`}
          subtitle="Detailed cognitive analysis and evaluation history."
          maxWidth="md"
        >
          <div className="space-y-3 text-xs text-[#c9d1d9]">
            <div className="p-3 rounded bg-[#090d13] border border-[#212734] flex items-center justify-between">
              <div>
                <span className="text-[#8b949e] text-[11px] font-mono block">Demonstrated Mastery</span>
                <span className="text-xl font-bold font-mono text-[#f0f6fc]">
                  {selectedConcept.masteryPercentage}%
                </span>
              </div>
              <Badge label={selectedConcept.status.toUpperCase()} variant="info" />
            </div>

            <p className="leading-relaxed text-[#8b949e] text-xs">
              Mastery in <strong>{selectedConcept.concept}</strong> is measured using verified problem solving,
              transfer tests, and absence of active misconceptions.
            </p>

            <div className="flex justify-end pt-2 font-mono">
              <button
                onClick={() => setSelectedConcept(null)}
                className="px-3.5 py-1.5 rounded bg-[#161b24] hover:bg-[#1f2634] text-[#f0f6fc] text-xs border border-[#262e3d] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
