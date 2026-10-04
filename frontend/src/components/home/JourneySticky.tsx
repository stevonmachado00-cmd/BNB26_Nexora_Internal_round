import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Glass } from "../ui/Glass";
import { Eyebrow, RevealWords, FadeUp } from "../ui/Reveal";

interface JourneyStep {
  id: number;
  label: string;
}

export const JourneySticky: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps: JourneyStep[] = [
    { id: 0, label: "Baseline" },
    { id: 1, label: "Sandbox" },
    { id: 2, label: "Diagnosis" },
    { id: 3, label: "Doubt Chat" },
    { id: 4, label: "Transfer" },
  ];

  return (
    <section className="relative z-10 py-28 sm:py-36 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Eyebrow accent="emerald">End-to-End Pedagogy</Eyebrow>
        <RevealWords
          text="The Five-Stage Learner Journey"
          as="h2"
          className="text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-[#F4F5F7] justify-center mb-3 leading-tight"
        />
        <FadeUp delay={0.1}>
          <p className="text-base sm:text-lg text-[#A3A9B5] max-w-xl mx-auto">
            From initial placement to multi-problem transfer verification: how Re:Learn ensures lasting mental models.
          </p>
        </FadeUp>
      </div>

      {/* Top Segmented Stepper Bar */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
        {steps.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setActiveStep(idx)}
            className={`px-4 py-2 rounded-full text-xs font-mono font-medium shrink-0 transition-all cursor-pointer ${
              activeStep === idx
                ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] font-semibold"
                : "bg-white/5 hover:bg-white/10 text-[#A3A9B5] hover:text-white border border-white/5"
            }`}
          >
            <span className="opacity-60 mr-1.5">0{idx + 1}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Centered Main Interactive Stage Panel */}
      <div className="w-full max-w-3xl sm:max-w-4xl mx-auto">
        <Glass
          tier="elevated"
          className="rounded-3xl border border-white/10 p-6 sm:p-10 min-h-[480px] sm:min-h-[500px] flex flex-col justify-between shadow-[0_24px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <span className="font-mono text-xs text-[#00E5FF] font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
              SIMULATED RUNTIME &bull; STAGE 0{activeStep + 1}
            </span>
            <span className="text-[11px] font-mono text-[#6B7280]">
              {steps[activeStep].label} Module
            </span>
          </div>

          <div className="py-6 sm:py-8 flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {/* STAGE 1: Adaptive Baseline */}
              {activeStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-4"
                >
                  <div className="text-xs font-mono text-[#A3A9B5]">
                    SELECT CAREER LEARNING TRACK
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {["Core Basics", "Placements", "Data Analysis"].map(
                      (track, i) => (
                        <div
                          key={i}
                          className={`p-3.5 rounded-xl border text-center font-mono text-xs ${
                            i === 1
                              ? "bg-[#00E5FF]/15 border-[#00E5FF] text-white font-bold"
                              : "bg-white/5 border-white/10 text-[#6B7280]"
                          }`}
                        >
                          {track}
                        </div>
                      )
                    )}
                  </div>
                  <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white">
                        Baseline Diagnostic Score
                      </div>
                      <div className="text-[11px] text-[#A3A9B5]">
                        5 concepts evaluated
                      </div>
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-emerald-400 flex items-center justify-center font-mono text-xs sm:text-sm font-bold text-emerald-400">
                      82%
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STAGE 2: Pyodide Sandbox */}
              {activeStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="p-4 sm:p-5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs sm:text-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between text-[#6B7280] pb-2 border-b border-white/5 text-xs">
                    <span>Pyodide WebAssembly Context</span>
                    <span className="text-emerald-400">0.2ms latency</span>
                  </div>
                  <div className="text-[#3B82F6]">import sys</div>
                  <div>{'print(f"Executing with Python {sys.version}")'}</div>
                  <div className="p-2.5 rounded bg-white/5 text-[#00E5FF] text-xs font-mono">
                    &gt; Execution Trace: Line 1 &rarr; Line 2 &rarr; Captured Scope
                  </div>
                </motion.div>
              )}

              {/* STAGE 3: Cognitive Diagnosis */}
              {activeStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="p-4 sm:p-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm">
                    <div className="font-bold flex items-center gap-2 text-rose-400 mb-1">
                      <Brain className="w-4 h-4" />
                      <span>Misconception Detected: Scope Leak</span>
                    </div>
                    <p className="text-[#A3A9B5] leading-relaxed">
                      You modified a global variable inside a local loop without declaration.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-[#00E5FF]">
                    Triggering Targeted Probe Question...
                  </div>
                </motion.div>
              )}

              {/* STAGE 4: Guardrailed Doubt Chat */}
              {activeStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-2.5 text-xs sm:text-sm font-mono"
                >
                  <div className="p-3 rounded-lg bg-white/5 text-[#A3A9B5] ml-auto max-w-[80%] text-right">
                    "Can you just give me the corrected code?"
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] mr-auto max-w-[85%] space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-white">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Tier 1: Guiding Question</span>
                    </div>
                    <p className="text-xs text-[#A3A9B5] leading-relaxed">
                      "What is the lifecycle of variable `count` when the function exits?"
                    </p>
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#6B7280] text-center pt-1">
                    [Locked Tiers: Clue &bull; Contrast &bull; Model Example]
                  </div>
                </motion.div>
              )}

              {/* STAGE 5: Transfer Reassessment */}
              {activeStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-3"
                >
                  <div className="text-xs font-mono text-[#A3A9B5]">
                    TRANSFER RETENTION SUITE
                  </div>
                  {[
                    { task: "Transfer Task 1: String Formatter", status: "Verified" },
                    { task: "Transfer Task 2: Nested Accumulator", status: "Verified" },
                    { task: "Delayed Check: 48h Login Test", status: "Scheduled" },
                  ].map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 sm:p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs sm:text-sm font-mono"
                    >
                      <span className="text-white">{t.task}</span>
                      <span
                        className={`font-semibold ${
                          t.status === "Verified"
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
            <span className="text-[#6B7280]">
              Step {activeStep + 1} of {steps.length}
            </span>
            <button
              onClick={() =>
                setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))
              }
              className="text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Next Stage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Glass>
      </div>
    </section>
  );
};
