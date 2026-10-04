import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Terminal,
  Activity,
  Lightbulb,
} from "lucide-react";
import { Glass } from "../ui/Glass";
import { Eyebrow, RevealWords, FadeUp } from "../ui/Reveal";

export const LiveProbeTerminal: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedOption(id);
    if (id === "10" || id === "Error") {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 350);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
  };

  return (
    <section className="relative z-10 py-28 sm:py-36 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <Eyebrow accent="amber">Interactive Diagnosis</Eyebrow>
        <RevealWords
          text="Experience the Probe Question Live"
          as="h2"
          className="text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-[#F4F5F7] justify-center mb-3 leading-tight"
        />
        <FadeUp delay={0.1}>
          <p className="text-base sm:text-lg text-[#A3A9B5] max-w-xl mx-auto">
            Test the engine yourself. Pick an answer to see how Re:Learn differentiates a harmless slip from a deep misconception.
          </p>
        </FadeUp>
      </div>

      <FadeUp delay={0.2}>
        <Glass
          tier="elevated"
          className="rounded-3xl border border-white/10 overflow-hidden shadow-[0_24px_64px_-16px_rgba(0,0,0,0.8)]"
        >
          {/* Terminal Title Bar */}
          <div className="h-11 px-5 bg-[#090B0F]/95 border-b border-white/[0.06] flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]/80" />
              <span className="ml-3 font-mono text-xs text-[#A3A9B5] flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" />
                probe_diagnostic_engine.py
              </span>
            </div>

            {selectedOption && (
              <button
                onClick={handleReset}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-[#A3A9B5] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
            {/* LEFT: Code Window with Pulsing Marker on Buggy Line (6 cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-[#07080B]/90 font-mono text-xs sm:text-sm border-b lg:border-b-0 lg:border-r border-white/[0.06] flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-[#6B7280] mb-4 pb-2 border-b border-white/[0.04] flex items-center justify-between">
                  <span>STUDENT CODE (AssertionError)</span>
                  <span className="text-rose-400">Returned None</span>
                </div>

                <div className="space-y-1.5 leading-relaxed">
                  <div className="flex items-center gap-4 text-[#4B5563]">
                    <span className="w-4 text-right">1</span>
                    <span className="text-[#3B82F6]">def</span>{" "}
                    <span className="text-[#00E5FF]">calc_discount</span>(price, pct):
                  </div>
                  <div className="flex items-center gap-4 text-[#A3A9B5]">
                    <span className="w-4 text-right text-[#4B5563]">2</span>
                    <span className="pl-4">discount = price * (pct / 100)</span>
                  </div>
                  <div className="flex items-center gap-4 text-[#A3A9B5]">
                    <span className="w-4 text-right text-[#4B5563]">3</span>
                    <span className="pl-4">final_price = price - discount</span>
                  </div>

                  {/* Pulsing Marker on Line 4 */}
                  <div className="flex items-center gap-4 py-1.5 px-2 -mx-2 rounded bg-rose-500/10 border-l-2 border-[#F43F5E] text-rose-300 relative group">
                    <span className="w-4 text-right text-rose-400 font-bold">4</span>
                    <span className="pl-4 flex items-center gap-2">
                      <span className="text-[#F43F5E] font-semibold">print</span>
                      <span>(final_price)</span>
                      <span className="w-2 h-2 rounded-full bg-[#F43F5E] animate-ping" />
                    </span>
                    <span className="absolute right-3 text-[10px] text-rose-400 font-mono uppercase tracking-wider">
                      Buggy Line
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[#4B5563]">
                    <span className="w-4 text-right">5</span>
                    <span>&nbsp;</span>
                  </div>
                  <div className="flex items-center gap-4 text-[#6B7280]">
                    <span className="w-4 text-right">6</span>
                    <span>total = calc_discount(100, 20)</span>
                  </div>
                </div>
              </div>

              {/* Memory State Tracer Table */}
              <div className="mt-8 pt-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#A3A9B5] mb-2.5">
                  <Activity className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Pyodide Variable State Tracer:</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded bg-white/5 border border-white/5">
                    <div className="text-[10px] text-[#6B7280]">price</div>
                    <div className="text-white font-semibold mt-0.5">100</div>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/5">
                    <div className="text-[10px] text-[#6B7280]">discount</div>
                    <div className="text-white font-semibold mt-0.5">20.0</div>
                  </div>
                  <div
                    className={`p-2 rounded border transition-colors ${
                      selectedOption === "None"
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : selectedOption === "10"
                        ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                        : "bg-white/5 border-white/5 text-amber-300"
                    }`}
                  >
                    <div className="text-[10px] text-[#6B7280]">return val</div>
                    <div className="font-bold mt-0.5">
                      {selectedOption === "None"
                        ? "None (Fixed!)"
                        : selectedOption === "10"
                        ? "None != 80"
                        : "None"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Probe Question & Rich Choice Tiles (6 cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-[#0C0E14]/95 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#00E5FF] font-semibold flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    DISAMBIGUATING PROBE
                  </span>
                  <span className="text-[10px] font-mono text-[#6B7280]">
                    Single Question Isolation
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <p className="text-sm sm:text-base font-semibold text-white leading-snug">
                    "What will variable <code className="text-[#00E5FF] font-mono">res</code> store after executing:
                    <br />
                    <span className="font-mono text-emerald-400 block mt-1">
                      res = print(10)
                    </span>
                    ?"
                  </p>
                </div>

                {/* 3 Choice Tiles */}
                <motion.div
                  animate={isShaking ? { x: [-4, 4, -4, 4, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className="space-y-2.5"
                >
                  {[
                    {
                      id: "None",
                      label: "None",
                      desc: "print() outputs to stdout and returns None",
                      tag: "Correct Mental Model",
                    },
                    {
                      id: "10",
                      label: "10",
                      desc: "print() evaluates and yields 10 to caller",
                      tag: "Common Misconception",
                    },
                    {
                      id: "Error",
                      label: "TypeError / SyntaxError",
                      desc: "Cannot assign void function return",
                      tag: "Syntax Confusion",
                    },
                  ].map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    const isSuccess = opt.id === "None" && isSelected;
                    const isFailure = opt.id !== "None" && isSelected;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between select-none ${
                          isSuccess
                            ? "bg-emerald-500/15 border-emerald-500/50 shadow-[0_0_24px_rgba(16,185,129,0.25)]"
                            : isFailure
                            ? "bg-rose-500/15 border-rose-500/50 shadow-[0_0_24px_rgba(244,63,94,0.25)]"
                            : "bg-white/[0.02] hover:bg-white/[0.06] border-white/10 hover:border-white/20 text-[#A3A9B5]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-base text-white">
                              {opt.label}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#6B7280]">
                              {opt.tag}
                            </span>
                          </div>
                          <div className="text-xs text-[#A3A9B5] mt-1">
                            {opt.desc}
                          </div>
                        </div>

                        {isSelected && (
                          <div>
                            {isSuccess ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-rose-400" />
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              </div>

              {/* Dynamic Feedback Card */}
              <AnimatePresence mode="wait">
                {selectedOption && (
                  <motion.div
                    key={selectedOption}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4"
                  >
                    {selectedOption === "None" && (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Diagnosis: Careless Slip (Not a Misconception)</span>
                        </div>
                        <p className="text-[#A3A9B5]">
                          You understand return semantics. Re:Learn provides a single-line syntax reminder instead of forcing you through a lengthy lesson.
                        </p>
                      </div>
                    )}

                    {selectedOption === "10" && (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-rose-400">
                          <XCircle className="w-4 h-4" />
                          <span>Diagnosis: Conceptual Misconception Confirmed</span>
                        </div>
                        <p className="text-[#A3A9B5]">
                          You treat console output as the caller's value. Re:Learn immediately routes to the "Stdout vs Caller Return" contrast module.
                        </p>
                      </div>
                    )}

                    {selectedOption === "Error" && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-amber-400">
                          <Lightbulb className="w-4 h-4" />
                          <span>Diagnosis: Syntax Model Ambiguity</span>
                        </div>
                        <p className="text-[#A3A9B5]">
                          Assigning the result of any function is legal Python. Functions without a return default to <code className="text-white">None</code>.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Glass>
      </FadeUp>
    </section>
  );
};
