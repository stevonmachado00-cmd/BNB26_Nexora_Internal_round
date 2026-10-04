"use client";

import React, { useState } from "react";
import {
  cubicBezier,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import {
  Terminal,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  RotateCw,
  Activity,
  Sparkles,
  X,
  Brain,
  Cpu,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { Glass } from "../ui/Glass";

// Module-level constants & easings
const BLUE = "#6182ff";
const hingeEase = cubicBezier(0.34, 0, 0.1, 1);

// Deterministic star field (20 points)
const STARS = [
  [7, 22, 0.16],
  [16, 64, 0.10],
  [24, 36, 0.20],
  [33, 79, 0.12],
  [39, 14, 0.15],
  [46, 55, 0.09],
  [54, 29, 0.18],
  [60, 70, 0.11],
  [66, 43, 0.14],
  [73, 17, 0.10],
  [79, 61, 0.17],
  [85, 33, 0.12],
  [90, 75, 0.15],
  [94, 49, 0.10],
  [12, 9, 0.13],
  [29, 6, 0.14],
  [57, 11, 0.10],
  [88, 8, 0.12],
  [4, 47, 0.11],
  [96, 26, 0.13],
] as const;

// Constellation lines — outer margins only
const CONSTELLATION = [
  [79, 61, 85, 33],
  [85, 33, 90, 75],
  [90, 75, 94, 49],
  [7, 22, 16, 64],
  [16, 64, 4, 47],
  [24, 36, 33, 79],
  [73, 17, 79, 61],
] as const;

// 73-Key Keyboard layout (6 rows)
const ROWS: number[][] = [
  Array(13).fill(1),
  [1.4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.4],
  [1.65, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.2],
  [1.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.95],
  [2.45, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.45],
  [1.3, 1.3, 1.3, 6.8, 1.3, 1.3, 1.3],
];

interface MacBookProbeSectionProps {
  onExploreMethodology?: () => void;
}

export const MacBookProbeSection: React.FC<MacBookProbeSectionProps> = ({
  onExploreMethodology,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Probe Question Interactive State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // In-place smooth spring animation (NO page scrolling)
  const progress = useMotionValue(0);
  const sp = useSpring(progress, {
    stiffness: 160,
    damping: 24,
    mass: 0.5,
    restDelta: 0.0001,
  });

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    progress.set(nextState ? 1 : 0);
  };

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

  // Motion transforms driven directly by sp [0 -> 1]
  const lidAngle = useTransform(
    sp,
    [0.0, 0.25, 0.65, 0.88, 0.95, 1.0],
    [-90, -70, -28, -6, 1.1, 0],
    { ease: hingeEase }
  );
  const lidRotate = useTransform(lidAngle, (a) => `rotateX(${a}deg)`);

  const led = useTransform(sp, [0.45, 0.8], [0, 1], { clamp: true });
  const panelBlack = useTransform(sp, [0.65, 0.92], [1, 0], { clamp: true });
  const bloom = useTransform(sp, [0.65, 0.92, 1.0], [0, 0.35, 0.26], { clamp: true });
  const contentOpacity = useTransform(sp, [0.72, 0.96], [0, 1], { clamp: true });

  // Text disappears as laptop opens
  const textOpacity = useTransform(sp, [0.0, 0.45], [1, 0], { clamp: true });
  const textY = useTransform(sp, [0.0, 0.45], [0, -32], { clamp: true });
  const textBlurN = useTransform(sp, [0.0, 0.45], [0, 10], { clamp: true });
  const textFilter = useTransform(textBlurN, (b) => `blur(${b}px)`);

  return (
    <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 w-full flex flex-col items-center select-none overflow-hidden bg-[#04050a]">
      {/* AMBIENT STUDIO LIGHTING */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Base wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 52%, #0a1020 0%, #070a14 45%, #04050a 100%)",
          }}
        />

        {/* Flanking rim lights */}
        <div
          className="absolute left-[5%] top-1/2 h-[60vh] w-[32vw] -translate-y-1/2 rounded-full blur-[110px]"
          style={{
            background: `radial-gradient(ellipse at center, ${BLUE}35, ${BLUE}12 45%, transparent 72%)`,
          }}
        />
        <div
          className="absolute right-[5%] top-1/2 h-[60vh] w-[32vw] -translate-y-1/2 rounded-full blur-[110px]"
          style={{
            background: `radial-gradient(ellipse at center, ${BLUE}35, ${BLUE}12 45%, transparent 72%)`,
          }}
        />

        {/* Pool behind machine */}
        <div
          className="absolute left-1/2 top-[55%] h-[48vh] w-[56vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
          style={{
            background: `radial-gradient(ellipse at center, ${BLUE}28, ${BLUE}0c 48%, transparent 74%)`,
          }}
        />

        {/* Faint grid */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
            maskImage: "radial-gradient(ellipse at center, #000 10%, transparent 64%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, #000 10%, transparent 64%)",
          }}
        />

        {/* Constellation SVG */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {CONSTELLATION.map(([x1, y1, x2, y2], i) => (
            <line
              key={i}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="rgba(190,205,255,0.08)"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Stars */}
        {STARS.map(([x, y, op], i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: 1.5,
              height: 1.5,
              opacity: op,
            }}
          />
        ))}

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 78% 68% at 50% 50%, transparent 42%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      {/* INTRO TEXT & CLOSE BUTTON CONTAINER */}
      <div className="relative z-30 flex flex-col items-center px-4 text-center max-w-4xl mx-auto mb-8 sm:mb-12">
        <motion.div
          style={{
            opacity: textOpacity,
            y: textY,
            filter: textFilter,
            pointerEvents: isOpen ? "none" : "auto",
          }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono font-medium uppercase tracking-[0.25em] text-[#00E5FF] mb-3">
            <Sparkles className="w-3 h-3 text-[#00E5FF]" />
            <span>Interactive Diagnostic Lab</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-white max-w-3xl leading-[1.1]">
            Experience the Probe Question Live
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-white/50 max-w-md leading-relaxed">
            Test the engine yourself. Pick an answer to see how Re:Learn differentiates a harmless slip from a deep misconception.
          </p>

          {/* Compact, short & simple button */}
          <div className="mt-5">
            <button
              onClick={handleToggle}
              className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs font-mono shadow-[0_0_24px_rgba(255,255,255,0.3)] hover:shadow-[0_0_32px_rgba(0,229,255,0.5)] flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/80"
            >
              <span>Test Live</span>
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            </button>
          </div>
        </motion.div>

        {/* FLOATING CLOSE BUTTON (Smoothly appears above the open MacBook) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 z-40 flex items-center justify-center pointer-events-auto"
            >
              <button
                onClick={handleToggle}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/40 text-white font-mono text-xs flex items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <X className="w-3.5 h-3.5 text-white/80 group-hover:rotate-90 transition-transform duration-200" />
                <span>Close MacBook</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* THE MACBOOK PRO 3D APPARATUS */}
      <div
        className="relative z-10"
        style={{
          ["--mbw" as any]: "min(78vw, calc((86svh - 6rem) / 0.775), 1140px)",
          width: "var(--mbw)",
        }}
      >
        {/* 3D STAGE */}
        <div
          className="relative w-full"
          style={{
            perspective: "calc(var(--mbw) * 2.45)",
            perspectiveOrigin: "50% 34%",
          }}
        >
          {/* THE LID */}
          <motion.div
            className="relative z-20 w-full"
            style={{
              transform: lidRotate,
              transformOrigin: "50% 100%",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Rear shell (visible when shut) */}
            <div
              className="absolute inset-0 rounded-t-[0.85rem] rounded-b-[3px] overflow-hidden"
              style={{
                transform: "translateZ(-4px) rotateY(180deg)",
                background:
                  "linear-gradient(178deg,#303036 0%,#1e1e23 14%,#16161a 48%,#101013 100%)",
              }}
            >
              {/* Brushed grain */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)",
                }}
              />
              {/* Apple-grade subtle specular logo in center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center font-mono font-bold text-white/40 text-[11px]">
                RE
              </div>
            </div>

            {/* Display chassis */}
            <div
              className="relative aspect-[16/9.2] w-full rounded-t-[0.85rem] rounded-b-[3px] p-[0.8%]"
              style={{
                transformStyle: "preserve-3d",
                background:
                  "linear-gradient(180deg,#46464e 0%,#2b2b32 1.6%,#1b1b20 28%,#141418 100%)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.16), inset 0 1.5px 0 rgba(255,255,255,0.62), inset 1px 0 0 rgba(255,255,255,0.24), inset -1px 0 0 rgba(255,255,255,0.24), 0 0 70px rgba(97,130,255,0.16)",
              }}
            >
              {/* Chamfer span */}
              <span
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{ boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.28)" }}
              />

              {/* Key-light span */}
              <span
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{
                  background:
                    "radial-gradient(130% 90% at 16% -12%, rgba(255,255,255,0.15), rgba(255,255,255,0.04) 38%, transparent 62%)",
                }}
              />

              {/* PANEL (live DOM container) */}
              <div
                className="relative h-full w-full overflow-hidden rounded-[0.5rem] bg-black"
                style={{ containerType: "inline-size" }}
              >
                {/* LIVE INTERACTIVE PROBE QUESTION TERMINAL ON SCREEN */}
                <motion.div
                  style={{ opacity: contentOpacity }}
                  className="relative w-full h-full bg-[#08090D] flex flex-col justify-between p-3 sm:p-5 select-auto text-left"
                >
                  {/* Terminal Title Bar */}
                  <div className="h-8 px-3 bg-[#0C0E14] border-b border-white/[0.06] rounded-t-lg flex items-center justify-between select-none">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggle}
                        title="Close MacBook"
                        className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] hover:opacity-75 transition-opacity cursor-pointer"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                      <span className="ml-2 font-mono text-[11px] text-[#A3A9B5] flex items-center gap-1.5">
                        <Terminal className="w-3 h-3 text-[#00E5FF]" />
                        probe_diagnostic_engine.py
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedOption && (
                        <button
                          onClick={handleReset}
                          className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-mono text-[#A3A9B5] hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Reset</span>
                        </button>
                      )}
                      <button
                        onClick={handleToggle}
                        className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] font-mono text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Close MacBook"
                      >
                        <X className="w-3 h-3 text-[#FF5F56]" />
                        <span>Close</span>
                      </button>
                    </div>
                  </div>

                  {/* Terminal Content: Code on Left, Probe on Right */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 flex-1 py-2 overflow-y-auto">
                    {/* Left: Code with Pulsing Buggy Marker (6 cols) */}
                    <div className="md:col-span-6 p-3 rounded-xl bg-[#050608] border border-white/[0.05] font-mono text-[11px] sm:text-xs leading-relaxed flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] text-[#6B7280] pb-1.5 mb-2 border-b border-white/[0.04] flex items-center justify-between">
                          <span>STUDENT CODE</span>
                          <span className="text-rose-400">AssertionError</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-3 text-[#4B5563]">
                            <span className="w-3 text-right">1</span>
                            <span className="text-[#3B82F6]">def</span>{" "}
                            <span className="text-[#00E5FF]">calc_discount</span>(price, pct):
                          </div>
                          <div className="flex items-center gap-3 text-[#A3A9B5]">
                            <span className="w-3 text-right text-[#4B5563]">2</span>
                            <span className="pl-3">discount = price * (pct / 100)</span>
                          </div>
                          <div className="flex items-center gap-3 text-[#A3A9B5]">
                            <span className="w-3 text-right text-[#4B5563]">3</span>
                            <span className="pl-3">final_price = price - discount</span>
                          </div>

                          {/* Pulsing Marker on Line 4 */}
                          <div className="flex items-center gap-3 py-1 px-1.5 -mx-1.5 rounded bg-rose-500/10 border-l-2 border-[#F43F5E] text-rose-300">
                            <span className="w-3 text-right text-rose-400 font-bold">4</span>
                            <span className="pl-3 flex items-center gap-1.5">
                              <span className="text-[#F43F5E] font-semibold">print</span>
                              <span>(final_price)</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E] animate-ping" />
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[#4B5563]">
                            <span className="w-3 text-right">5</span>
                            <span>&nbsp;</span>
                          </div>
                          <div className="flex items-center gap-3 text-[#6B7280]">
                            <span className="w-3 text-right">6</span>
                            <span>total = calc_discount(100, 20)</span>
                          </div>
                        </div>
                      </div>

                      {/* Memory Tracer Box */}
                      <div className="pt-2 mt-2 border-t border-white/[0.04]">
                        <div className="flex items-center gap-1.5 text-[10px] text-[#A3A9B5] mb-1">
                          <Activity className="w-3 h-3 text-[#00E5FF]" />
                          <span>Pyodide Variable State:</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                          <div className="p-1 rounded bg-white/5">
                            <div className="text-[#6B7280]">price</div>
                            <div className="text-white font-semibold">100</div>
                          </div>
                          <div className="p-1 rounded bg-white/5">
                            <div className="text-[#6B7280]">discount</div>
                            <div className="text-white font-semibold">20.0</div>
                          </div>
                          <div
                            className={`p-1 rounded border transition-colors ${
                              selectedOption === "None"
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                                : selectedOption === "10"
                                ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                                : "bg-white/5 border-white/5 text-amber-300"
                            }`}
                          >
                            <div className="text-[#6B7280]">return</div>
                            <div className="font-bold">
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

                    {/* Right: Interactive Probe Question (6 cols) */}
                    <div className="md:col-span-6 p-3 rounded-xl bg-[#0A0C12] border border-white/[0.05] flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#00E5FF] font-semibold flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            DISAMBIGUATION PROBE
                          </span>
                          <span className="text-[9px] font-mono text-[#6B7280]">
                            Live Sandbox
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-white leading-snug">
                          What will variable <code className="text-[#00E5FF]">res</code> store after executing:{" "}
                          <span className="font-mono text-emerald-400 block mt-0.5">
                            res = print(10)
                          </span>
                          ?
                        </div>

                        {/* 3 Choice Buttons */}
                        <motion.div
                          animate={isShaking ? { x: [-3, 3, -3, 3, 0] } : {}}
                          transition={{ duration: 0.3 }}
                          className="space-y-1.5"
                        >
                          {[
                            {
                              id: "None",
                              label: "None",
                              desc: "print() outputs to stdout and returns None",
                              tag: "Correct Model",
                            },
                            {
                              id: "10",
                              label: "10",
                              desc: "print() evaluates and yields 10 to caller",
                              tag: "Misconception",
                            },
                            {
                              id: "Error",
                              label: "Error",
                              desc: "Cannot assign void function return",
                              tag: "Syntax Slip",
                            },
                          ].map((opt) => {
                            const isSelected = selectedOption === opt.id;
                            const isSuccess = opt.id === "None" && isSelected;
                            const isFailure = opt.id !== "None" && isSelected;

                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleSelect(opt.id)}
                                className={`w-full p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                                  isSuccess
                                    ? "bg-emerald-500/15 border-emerald-500/50 shadow-[0_0_16px_rgba(16,185,129,0.2)]"
                                    : isFailure
                                    ? "bg-rose-500/15 border-rose-500/50 shadow-[0_0_16px_rgba(244,63,94,0.2)]"
                                    : "bg-white/[0.02] hover:bg-white/[0.06] border-white/10 text-[#A3A9B5]"
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-xs text-white">
                                      {opt.label}
                                    </span>
                                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-[#6B7280]">
                                      {opt.tag}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-[#A3A9B5] mt-0.5">
                                    {opt.desc}
                                  </div>
                                </div>

                                {isSelected && (
                                  <div>
                                    {isSuccess ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-rose-400" />
                                    )}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </motion.div>
                      </div>

                      {/* Feedback Banner */}
                      <AnimatePresence mode="wait">
                        {selectedOption && (
                          <motion.div
                            key={selectedOption}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="mt-2 text-[10px] leading-relaxed"
                          >
                            {selectedOption === "None" && (
                              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                                <strong>Diagnosis: Careless Slip!</strong> You understand return values. Re:Learn provides a 1-line syntax reminder instead of forcing a long lesson.
                              </div>
                            )}
                            {selectedOption === "10" && (
                              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
                                <strong>Diagnosis: Misconception Confirmed!</strong> You treat console print as return. Re:Learn launches the Output vs Return contrast lesson.
                              </div>
                            )}
                            {selectedOption === "Error" && (
                              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                                <strong>Diagnosis: Syntax Ambiguity.</strong> Functions without a return default to None in Python.
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>

                {/* Power-on veil */}
                <motion.div
                  style={{ opacity: panelBlack }}
                  className="pointer-events-none absolute inset-0 bg-black"
                />

                {/* Notch */}
                <div className="absolute left-1/2 top-0 z-30 flex h-[2.4%] w-[10.5%] -translate-x-1/2 items-center justify-center rounded-b-[0.4rem] bg-black">
                  <span className="h-[3px] w-[3px] rounded-full bg-[#17171c] ring-[0.5px] ring-white/10" />
                </div>

                {/* Stacked glass reflections */}
                <div
                  className="pointer-events-none absolute inset-0 z-20"
                  style={{
                    background:
                      "linear-gradient(118deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.035) 11%, rgba(255,255,255,0) 33%, rgba(255,255,255,0) 68%, rgba(255,255,255,0.025) 89%, rgba(255,255,255,0.055) 100%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-[26%] z-20"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.055), transparent)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0 z-20"
                  style={{
                    background:
                      "radial-gradient(115% 85% at 50% 42%, transparent 58%, rgba(0,0,0,0.34) 100%)",
                  }}
                />
              </div>
            </div>

            {/* Bloom off panel */}
            <motion.div
              style={{
                opacity: bloom,
                background:
                  "radial-gradient(ellipse at center, rgba(175,200,255,0.26), transparent 66%)",
              }}
              className="pointer-events-none absolute -inset-[7%] -z-10 rounded-[1.8rem] blur-[44px]"
            />
          </motion.div>

          {/* THE BASE */}
          <div
            className="relative z-10 w-full"
            style={{
              paddingBottom: "10.5%",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Rotated deck */}
            <div
              className="absolute inset-x-0 top-0"
              style={{
                paddingBottom: "52%",
                transformOrigin: "50% 0%",
                transform: "rotateX(88.92deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Aluminium deck surface */}
              <div
                className="absolute inset-0 rounded-[10px]"
                style={{
                  background:
                    "linear-gradient(168deg,#8b8b99 0%,#6a6a78 7%,#50505b 26%,#3e3e47 58%,#33333b 82%,#2b2b32 100%)",
                  boxShadow:
                    "inset 0 1.5px 0 rgba(255,255,255,0.55), inset 1.5px 0 0 rgba(255,255,255,0.30), inset -1.5px 0 0 rgba(255,255,255,0.30), 0 0 0 1px rgba(0,0,0,0.65)",
                }}
              >
                {/* Brushed grain */}
                <div
                  className="absolute inset-0 opacity-[0.35]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 3px)",
                  }}
                />

                {/* Key light */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 82% 62% at 22% -4%, rgba(255,255,255,0.16), rgba(255,255,255,0.05) 42%, transparent 68%)",
                  }}
                />

                {/* Cool bounce */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 55% 70% at 96% 40%, rgba(150,178,255,0.09), transparent 62%)",
                  }}
                />

                {/* Hinge shadow */}
                <div
                  className="absolute inset-x-[3%] top-0 h-[3.5%] rounded-b-[4px]"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.25))",
                  }}
                />

                {/* Two speaker grilles */}
                <div
                  className="absolute left-[3.5%] top-[9%] h-[41%] w-[5.5%] rounded-[3px] opacity-70"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(0,0,0,0.55) 34%, transparent 36%)",
                    backgroundSize: "4px 4px",
                  }}
                />
                <div
                  className="absolute right-[3.5%] top-[9%] h-[41%] w-[5.5%] rounded-[3px] opacity-70"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(0,0,0,0.55) 34%, transparent 36%)",
                    backgroundSize: "4px 4px",
                  }}
                />

                {/* KEYBOARD (73 keys total) */}
                <div className="absolute left-1/2 top-[7%] h-[45%] w-[86%] -translate-x-1/2">
                  {/* Recessed well */}
                  <div
                    className="absolute -inset-[1.5%] rounded-[6px] bg-[#08080a]"
                    style={{
                      boxShadow:
                        "inset 0 2px 6px rgba(0,0,0,0.98), inset 0 -1px 0 rgba(255,255,255,0.06)",
                    }}
                  />

                  {/* Backlight pool */}
                  <motion.div
                    style={{
                      opacity: led,
                      background:
                        "radial-gradient(ellipse at center, rgba(214,228,255,0.10), rgba(214,228,255,0.03) 52%, transparent 76%)",
                    }}
                    className="absolute -inset-[6%] rounded-[10px] blur-[7px]"
                  />

                  {/* Keyboard Rows */}
                  <div className="relative flex h-full flex-col gap-[1.6%]">
                    {ROWS.map((row, r) => (
                      <div
                        key={r}
                        className="flex gap-[0.8%]"
                        style={{ flex: r === 0 ? 0.8 : 1 }}
                      >
                        {row.map((weight, k) => (
                          <div
                            key={k}
                            className="relative rounded-[2px]"
                            style={{
                              flex: weight,
                              background:
                                "linear-gradient(180deg,#232329 0%,#17171c 45%,#0f0f13 100%)",
                              boxShadow:
                                "inset 0 0.8px 0 rgba(255,255,255,0.30), inset 0 -0.5px 0 rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.95)",
                            }}
                          >
                            {/* Per-key edge light */}
                            <motion.span
                              style={{ opacity: led }}
                              className="absolute -inset-[0.5px] rounded-[2.5px] bg-[rgba(214,228,255,0.085)] blur-[1.4px]"
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Raking sheen */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[4px]"
                    style={{
                      background:
                        "linear-gradient(102deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 18%, transparent 40%)",
                    }}
                  />
                </div>

                {/* Trackpad */}
                <div
                  className="absolute bottom-[7%] left-1/2 h-[36%] w-[45%] -translate-x-1/2 rounded-[8px]"
                  style={{
                    background:
                      "linear-gradient(170deg,#3a3a41 0%,#33333a 45%,#2c2c32 100%)",
                    boxShadow:
                      "inset 0 0 0 1px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.14)",
                  }}
                />
              </div>

              {/* Front edge wall */}
              <div
                className="absolute inset-x-0 top-full"
                style={{
                  height: "3.1%",
                  transformOrigin: "50% 0%",
                  transform: "rotateX(-88.92deg)",
                }}
              >
                <div
                  className="relative h-full w-full rounded-b-[9px]"
                  style={{
                    background:
                      "linear-gradient(180deg,#5c5c68 0%,#43434d 18%,#303037 50%,#1f1f24 78%,#141418 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.40), inset 1px 0 0 rgba(255,255,255,0.14), inset -1px 0 0 rgba(255,255,255,0.14), 0 0 0 1px rgba(0,0,0,0.55)",
                  }}
                >
                  {/* Finger groove span */}
                  <span className="absolute left-1/2 top-0 h-[62%] w-[11%] -translate-x-1/2 rounded-b-[6px] bg-black/45" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact shadows */}
          <div className="pointer-events-none absolute -bottom-[2%] left-1/2 h-[4%] w-[74%] -translate-x-1/2 rounded-[50%] bg-black blur-[14px] -z-10" />
          <div className="pointer-events-none absolute -bottom-[5%] left-1/2 h-[9%] w-[104%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-[40px] -z-10" />
        </div>

        {/* SURFACE REFLECTION (Radial gradients only) */}
        <div className="pointer-events-none absolute inset-x-[-6%] top-full h-[34%] -z-20">
          <div
            className="absolute left-1/2 top-0 h-[62%] w-[72%] -translate-x-1/2 blur-[14px]"
            style={{
              background:
                "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(150,168,212,0.20) 0%, rgba(110,128,170,0.07) 38%, transparent 72%)",
            }}
          />
          <div
            className="absolute left-1/2 top-0 h-[26%] w-[52%] -translate-x-1/2 blur-[9px]"
            style={{
              background:
                "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(190,205,240,0.22) 0%, transparent 68%)",
            }}
          />
          <motion.div
            style={{ opacity: bloom }}
            className="absolute left-1/2 top-0 h-[40%] w-[40%] -translate-x-1/2 blur-[20px]"
          >
            <div
              className="h-full w-full"
              style={{
                background:
                  "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(165,192,255,0.20) 0%, transparent 70%)",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* 4 Floating Icon-Led Glass Chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14 sm:mt-16 w-full max-w-5xl mx-auto px-4 z-10">
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

      {/* Minimal Animated Scroll Cue */}
      {onExploreMethodology && (
        <button
          onClick={onExploreMethodology}
          aria-label="Scroll to explore methodology"
          className="mt-12 inline-flex items-center gap-1.5 text-xs font-mono text-[#6B7280] hover:text-[#A3A9B5] transition-colors cursor-pointer group z-10"
        >
          <span>Explore methodology</span>
          <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </button>
      )}
    </section>
  );
};
