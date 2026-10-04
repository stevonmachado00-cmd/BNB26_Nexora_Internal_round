import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Brain,
  Cpu,
  ShieldCheck,
  RotateCw,
  Terminal,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Glass } from "../ui/Glass";

type LoopPhase =
  | "failing"
  | "misconception"
  | "probing"
  | "hint"
  | "verified";

export const HeroProductWindow: React.FC = () => {
  const [phase, setPhase] = useState<LoopPhase>("failing");
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 10s auto-play sequence loop
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    const timeline: { phase: LoopPhase; delay: number }[] = [
      { phase: "failing", delay: 0 },
      { phase: "misconception", delay: 2000 },
      { phase: "probing", delay: 4200 },
      { phase: "hint", delay: 6800 },
      { phase: "verified", delay: 8800 },
    ];

    let currentIdx = 0;
    const runNext = () => {
      setPhase(timeline[currentIdx].phase);
      const nextIdx = (currentIdx + 1) % timeline.length;
      const waitTime =
        nextIdx === 0
          ? 2600
          : timeline[nextIdx].delay - timeline[currentIdx].delay;
      currentIdx = nextIdx;
      timerRef.current = setTimeout(runNext, waitTime);
    };

    timerRef.current = setTimeout(runNext, 100);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, shouldReduceMotion]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full max-w-5xl mx-auto mt-12 sm:mt-16 [perspective:1400px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 6 }}
        animate={{ opacity: 1, y: 0, rotateX: 2 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {/* Glow halo behind window */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00E5FF]/20 via-[#3B82F6]/10 to-[#10B981]/15 rounded-3xl blur-2xl opacity-60 -z-10" />

        <Glass
          tier="elevated"
          className="rounded-2xl border border-white/10 overflow-hidden shadow-[0_24px_64px_-16px_rgba(0,0,0,0.85)]"
        >
          {/* Window Title Bar */}
          <div className="h-10 px-4 bg-[#090B0F]/90 border-b border-white/[0.06] flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]/80 inline-block" />
              <span className="ml-3 font-mono text-[11px] text-[#6B7280]">
                calculate_total.py — Pyodide WASM Runtime
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Tracing
              </span>
              <span className="text-[10px] font-mono text-[#6B7280]">
                {isPaused ? "Paused" : "Auto-Diagnosing"}
              </span>
            </div>
          </div>

          {/* Window Body: 2-Column Split */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[340px]">
            {/* Left: Code Editor (7 cols) */}
            <div className="md:col-span-7 p-6 bg-[#07080B]/80 font-mono text-[13px] leading-relaxed border-b md:border-b-0 md:border-r border-white/[0.06] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#6B7280] pb-3 mb-3 border-b border-white/[0.04]">
                  <span>1. PROBLEM: Calculate order total with 8% tax</span>
                  <span className="text-[#A3A9B5]">Python 3.11</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-4">
                    <span className="text-[#4B5563] w-4 text-right select-none">1</span>
                    <span>
                      <span className="text-[#3B82F6]">def</span>{" "}
                      <span className="text-[#00E5FF]">get_total</span>(price, tax):
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#4B5563] w-4 text-right select-none">2</span>
                    <span className="pl-4 text-[#A3A9B5]">
                      total = price + (price * tax)
                    </span>
                  </div>
                  {/* Faulty Line Highlight */}
                  <div
                    className={`flex items-center gap-4 py-1 px-1.5 rounded transition-colors duration-300 ${
                      phase === "failing" || phase === "misconception"
                        ? "bg-[#F43F5E]/15 border-l-2 border-[#F43F5E]"
                        : phase === "hint" || phase === "probing"
                        ? "bg-[#F59E0B]/15 border-l-2 border-[#F59E0B]"
                        : "bg-[#10B981]/15 border-l-2 border-[#10B981]"
                    }`}
                  >
                    <span className="text-[#4B5563] w-4 text-right select-none">3</span>
                    <span className="pl-4 flex items-center gap-2">
                      {phase === "verified" ? (
                        <span className="text-[#10B981] font-semibold">return total</span>
                      ) : (
                        <>
                          <span className="text-[#F43F5E]">print</span>
                          <span className="text-[#F4F5F7]">(total)</span>
                          <span className="text-[11px] text-[#6B7280] italic">
                            # returns None
                          </span>
                        </>
                      )}
                      <span className="inline-block w-1.5 h-4 bg-[#00E5FF] animate-pulse" />
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#4B5563] w-4 text-right select-none">4</span>
                    <span>&nbsp;</span>
                  </div>
                  <div className="flex items-center gap-4 text-[#6B7280]">
                    <span className="text-[#4B5563] w-4 text-right select-none">5</span>
                    <span>result = get_total(100, 0.08)</span>
                  </div>
                  <div className="flex items-center gap-4 text-[#6B7280]">
                    <span className="text-[#4B5563] w-4 text-right select-none">6</span>
                    <span>assert result == 108</span>
                  </div>
                </div>
              </div>

              {/* Execution Trace Mini Bar */}
              <div className="pt-4 mt-4 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#A3A9B5]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Trace: Line 3 executed &rarr; return value = </span>
                  <span className="font-semibold text-white">
                    {phase === "verified" ? "108" : "None"}
                  </span>
                </div>
                <span className="text-[10px] text-[#6B7280]">0.4ms locally</span>
              </div>
            </div>

            {/* Right: Adaptive Diagnosis Pipeline Panel (5 cols) */}
            <div className="md:col-span-5 p-6 bg-[#0B0D12]/90 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">
                    Cognitive Engine State
                  </span>
                  <span className="text-[10px] font-mono text-[#A3A9B5] px-2 py-0.5 rounded bg-white/5">
                    Step {phase === "failing" ? "1/5" : phase === "misconception" ? "2/5" : phase === "probing" ? "3/5" : phase === "hint" ? "4/5" : "5/5"}
                  </span>
                </div>

                {/* State 1: Test Failure */}
                {phase === "failing" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-semibold">
                      <AlertCircle className="w-4 h-4" />
                      <span>AssertionError on Test 1</span>
                    </div>
                    <p className="text-xs text-[#A3A9B5]">
                      Expected <code className="text-white">108</code>, received <code className="text-rose-300">None</code>. Initiating cognitive diagnosis...
                    </p>
                  </motion.div>
                )}

                {/* State 2: Misconception Detected */}
                {phase === "misconception" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2"
                  >
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-mono font-semibold">
                      <Brain className="w-3.5 h-3.5" />
                      Misconception: print ≠ return
                    </span>
                    <p className="text-xs text-[#A3A9B5] leading-relaxed">
                      Learner appears to treat console output as the caller’s return payload.
                    </p>
                  </motion.div>
                )}

                {/* State 3: Disambiguation Probe Question */}
                {phase === "probing" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/25 space-y-3"
                  >
                    <div className="flex items-center gap-1.5 text-[#00E5FF] text-[11px] font-mono font-semibold">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Discriminative Probe Question</span>
                    </div>
                    <div className="text-xs text-white font-medium">
                      What does <code className="text-[#00E5FF]">x = print(5)</code> store in x?
                    </div>
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="p-2 rounded-lg bg-black/40 border border-[#00E5FF]/40 text-[#00E5FF] flex items-center justify-between">
                        <span>A: None (Correct Model)</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                      </div>
                      <div className="p-2 rounded-lg bg-black/20 text-[#6B7280]">
                        <span>B: 5 (Misconception)</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* State 4: Targeted Hint Ladder */}
                {phase === "hint" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2"
                  >
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Hint Ladder: Tier 2 of 4
                    </span>
                    <p className="text-xs text-[#A3A9B5] leading-relaxed">
                      "You understand that print returns None. Replace <code className="text-amber-200">print(total)</code> on Line 3 with an explicit <code className="text-white">return</code> statement."
                    </p>
                  </motion.div>
                )}

                {/* State 5: Transfer Verified */}
                {phase === "verified" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2"
                  >
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-semibold">
                      <RotateCw className="w-3.5 h-3.5" />
                      Verified via Transfer Task
                    </span>
                    <p className="text-xs text-[#A3A9B5] leading-relaxed">
                      Learner successfully solved a disguised surface problem. Misconception marked <strong className="text-emerald-400">Resolved</strong>.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Loop Progress Indicator Dots */}
              <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {(["failing", "misconception", "probing", "hint", "verified"] as LoopPhase[]).map(
                    (p) => (
                      <span
                        key={p}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          phase === p
                            ? "w-6 bg-[#00E5FF]"
                            : "w-1.5 bg-white/20"
                        }`}
                      />
                    )
                  )}
                </div>
                <span className="text-[10px] font-mono text-[#6B7280]">
                  Hover to pause
                </span>
              </div>
            </div>
          </div>
        </Glass>

        {/* 4 Floating Icon-Led Glass Chips with gentle ±4px phase offsets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            {
              icon: Brain,
              label: "Cognitive Diagnosis",
              desc: "Deep belief vs careless slip",
              color: "text-[#00E5FF]",
              delay: 0,
            },
            {
              icon: Cpu,
              label: "In-Browser Sandbox",
              desc: "100% private Pyodide WASM",
              color: "text-emerald-400",
              delay: 0.5,
            },
            {
              icon: ShieldCheck,
              label: "Guardrailed AI Ladder",
              desc: "Never leaks solution code",
              color: "text-amber-400",
              delay: 1.0,
            },
            {
              icon: RotateCw,
              label: "Transfer Reassessment",
              desc: "Guaranteed conceptual retention",
              color: "text-[#3B82F6]",
              delay: 1.5,
            },
          ].map((chip, idx) => {
            const Icon = chip.icon;
            return (
              <motion.div
                key={idx}
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [-3, 3, -3],
                      }
                }
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: chip.delay,
                }}
              >
                <Glass
                  tier="subtle"
                  className="p-3.5 rounded-xl border border-white/[0.08] hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg bg-white/5 ${chip.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#F4F5F7]">
                        {chip.label}
                      </div>
                      <div className="text-[11px] text-[#A3A9B5]">
                        {chip.desc}
                      </div>
                    </div>
                  </div>
                </Glass>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
