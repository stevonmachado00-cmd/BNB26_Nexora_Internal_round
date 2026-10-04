import React from "react";
import { Modal } from "../common/Modal";
import { ChevronRight, Terminal } from "lucide-react";

export interface DemoScene {
  step: number;
  title: string;
  route: string;
  summary: string;
  actionHint: string;
  actionButtonText: string;
}

export const DEMO_SCENES: DemoScene[] = [
  {
    step: 1,
    title: "Scene 1: Learner Dashboard & Starting State",
    route: "/dashboard",
    summary: "Alex is at Level 8 with 67% Python Mastery and 2 active misconceptions ('Return vs Print', 'Loop boundaries').",
    actionHint: "Inspect the skill map and active misconceptions, then proceed to the recommended problem.",
    actionButtonText: "Go to Continue Learning (Scene 2)",
  },
  {
    step: 2,
    title: "Scene 2: Problem & Monaco Pre-Seeded Code",
    route: "/learn",
    summary: "Problem 12: Write an add(a, b) function. Pre-seeded with a common beginner misconception: print(a + b).",
    actionHint: "Notice the code in the Monaco editor uses print() instead of return. Click 'Run Code'.",
    actionButtonText: "Open Problem & Run Code (Scene 3)",
  },
  {
    step: 3,
    title: "Scene 3: Line-Level Diagnosis & Misconception Detection",
    route: "/learn",
    summary: "Tests fail (stdout has 8, return value is None). Line 2 is decorated and highlighted. Diagnosis card detects 'Return vs Print' with 87% confidence.",
    actionHint: "Notice how Re:Learn pinpoints the exact line and underlying belief rather than generic 'Wrong Answer'.",
    actionButtonText: "Inspect Execution Trace (Scene 4)",
  },
  {
    step: 4,
    title: "Scene 4: Interactive Execution Trace",
    route: "/learn?trace=open",
    summary: "Visual memory stepper demonstrates step-by-step why stdout produced '8' while the caller variable received 'None'.",
    actionHint: "Step through the frames to observe variable scopes and output streams.",
    actionButtonText: "Answer Diagnostic Probe (Scene 5)",
  },
  {
    step: 5,
    title: "Scene 5: Diagnostic Probe Discrimination",
    route: "/learn?probe=open",
    summary: "System presents probe question: 'What does x = print(5) store?' Selecting 'None' boosts confidence to 94% and eliminates slips.",
    actionHint: "Answer 'None' to watch the diagnosis confidence calibrate instantly.",
    actionButtonText: "Ask Re:Learn AI & Hint Ladder (Scene 6)",
  },
  {
    step: 6,
    title: "Scene 6: Ask Re:Learn Doubt Chat & Hint Ladder",
    route: "/learn?tab=chat",
    summary: "Contextual AI tutor guides the student with a 4-level hint ladder without dumping the final solution.",
    actionHint: "Click a suggested question like 'Why is print different from return?' to observe the guidance.",
    actionButtonText: "Launch Targeted Reassessment (Scene 7)",
  },
  {
    step: 7,
    title: "Scene 7: Targeted Transfer Reassessment",
    route: "/reassessment/return-vs-print",
    summary: "Solving the same problem is not enough. Re:Learn tests the concept in transfer problems (Sales Tax calculation & Shipping).",
    actionHint: "Observe transfer assessment in a new surface context with different variable names.",
    actionButtonText: "Switch Teaching Style (Scene 8)",
  },
  {
    step: 8,
    title: "Scene 8: Adaptive Teaching Style Switch",
    route: "/reassessment/return-vs-print?view=style",
    summary: "When a concept fails to transfer, Re:Learn switches representations: Contrast Examples vs Visual Trace vs Step-by-Step.",
    actionHint: "Notice the platform remembers Alex's strongest learning style ('Contrast examples').",
    actionButtonText: "Predict & Explain Mode (Scene 9)",
  },
  {
    step: 9,
    title: "Scene 9: Predict & Explain Cognitive Check",
    route: "/reassessment/return-vs-print?view=predict",
    summary: "Learner predicts what print(a, b) outputs and provides a written rationale. The model verifies genuine understanding vs guesswork.",
    actionHint: "Enter an explanation to see the model qualify whether the mental model is sound.",
    actionButtonText: "Delayed Re-Check & Resolution (Scene 10)",
  },
  {
    step: 10,
    title: "Scene 10: Delayed Re-Check & Misconception Graduation",
    route: "/dashboard?recheck=open",
    summary: "Spaced delayed check verifies long-term memory retention. Upon passing, 'Return vs Print' officially graduates from Active to Resolved!",
    actionHint: "Confirm the memory check to trigger mastery level advancement.",
    actionButtonText: "View Updated Dashboard & History (Scene 11)",
  },
  {
    step: 11,
    title: "Scene 11: Updated Learner Model & History",
    route: "/dashboard",
    summary: "Mastery increases from 67% to 70%, active misconceptions decrease to 1, resolved increases to 18. All timeline events recorded.",
    actionHint: "Browse to the Misconceptions catalog and Learning History to view the complete audit trail.",
    actionButtonText: "Explore Platform Freely",
  },
];

interface DemoTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentSceneIndex: number;
  onSelectScene: (sceneIndex: number) => void;
}

export const DemoTourGuide: React.FC<DemoTourGuideProps> = ({
  isOpen,
  onClose,
  currentSceneIndex,
  onSelectScene,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Re:Learn 3-Minute Interactive Demo Tour"
      subtitle="Step-by-step presentation walkthrough of the cognitive learning loop."
      maxWidth="2xl"
    >
      <div className="space-y-3.5 text-xs text-[#c9d1d9]">
        <div className="p-3 rounded bg-[#12161f] border border-[#212734] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span className="font-semibold text-[#f0f6fc] font-mono text-[11px]">
              Interactive Scenario Controller
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#8b949e]">
            Scene {currentSceneIndex + 1} / {DEMO_SCENES.length}
          </span>
        </div>

        {/* Scene List */}
        <div className="space-y-1.5 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
          {DEMO_SCENES.map((scene, idx) => {
            const isCurrent = idx === currentSceneIndex;
            return (
              <div
                key={scene.step}
                onClick={() => onSelectScene(idx)}
                className={`p-3 rounded border text-left cursor-pointer transition-colors ${
                  isCurrent
                    ? "bg-[#161d28] border-[#388bfd]/60 text-[#f0f6fc]"
                    : "bg-[#0e1218] border-[#212734] hover:border-[#303848] hover:bg-[#12161f] text-[#8b949e]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-mono text-xs ${
                      isCurrent ? "text-[#f0f6fc] font-bold" : "text-[#c9d1d9]"
                    }`}
                  >
                    {scene.title}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#388bfd] text-white font-mono font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[#8b949e] text-[11px] leading-relaxed">
                  {scene.summary}
                </p>
                {isCurrent && (
                  <div className="mt-2 pt-2 border-t border-[#232c3d] flex items-center justify-between text-[#8b949e] text-[10px] font-mono">
                    <span>Target: {scene.actionHint}</span>
                    <span className="font-bold flex items-center gap-1 text-[#f0f6fc]">
                      Execute →
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#212734]">
          <button
            onClick={() => onSelectScene(Math.max(0, currentSceneIndex - 1))}
            disabled={currentSceneIndex === 0}
            className="px-3 py-1.5 rounded bg-[#161b24] hover:bg-[#1f2634] disabled:opacity-40 font-mono text-xs text-[#c9d1d9] border border-[#262e3d] transition-colors"
          >
            ← Previous
          </button>

          <button
            onClick={() => {
              if (currentSceneIndex < DEMO_SCENES.length - 1) {
                onSelectScene(currentSceneIndex + 1);
              } else {
                onClose();
              }
            }}
            className="px-4 py-1.5 rounded bg-[#1e2736] hover:bg-[#273347] text-[#f0f6fc] font-mono font-semibold text-xs border border-[#37465f] flex items-center gap-1.5 transition-colors"
          >
            <span>{DEMO_SCENES[currentSceneIndex].actionButtonText}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

