import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  XCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
} from "lucide-react";
import { Glass } from "../ui/Glass";
import { Eyebrow, RevealWords, FadeUp } from "../ui/Reveal";

export const ProblemSplit: React.FC = () => {
  // Slider position from 0 (all Re:Learn) to 100 (all Auto-grader)
  // Default at 50% split
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(10, Math.min(rect.width - 10, e.clientX - rect.left));
    const percentage = (x / rect.width) * 100;
    setSliderPos(percentage);
  }, []);

  const painPoints = [
    {
      title: "Opaque failures",
      desc: "Cold 'Test 3 Failed' without explaining the root misconception.",
      icon: XCircle,
      activeSide: sliderPos < 25,
    },
    {
      title: "Guess-and-check",
      desc: "Random trial-and-error edits reward luck over comprehension.",
      icon: RotateCcw,
      activeSide: sliderPos >= 25 && sliderPos < 50,
    },
    {
      title: "Leaked solutions",
      desc: "Raw AI copy-pasting creates an illusion of competence.",
      icon: AlertTriangle,
      activeSide: sliderPos >= 50 && sliderPos < 75,
    },
    {
      title: "False mastery",
      desc: "A single green test pass is mistaken for durable concept learning.",
      icon: Award,
      activeSide: sliderPos >= 75,
    },
  ];

  return (
    <section className="relative z-10 py-28 sm:py-36 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <Eyebrow accent="rose">Cognitive Diagnostic Gap</Eyebrow>
        <RevealWords
          text="Why traditional coding platforms fail novice programmers"
          as="h2"
          className="text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-[#F4F5F7] justify-center mb-4 leading-tight"
        />
        <FadeUp delay={0.15}>
          <p className="text-base sm:text-lg text-[#A3A9B5] max-w-xl mx-auto">
            Drag the comparison slider to see how Re:Learn replaces binary failure checks with deep conceptual diagnosis.
          </p>
        </FadeUp>
      </div>

      {/* Interactive Split Showcase */}
      <FadeUp delay={0.2}>
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative h-[380px] sm:h-[420px] rounded-3xl overflow-hidden select-none border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-ew-resize touch-none"
        >
          {/* RIGHT SIDE: Re:Learn Cognitive Architecture (Underneath layer) */}
          <div className="absolute inset-0 bg-[#0C1019] p-8 sm:p-12 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-[#00E5FF]">
              <span className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                RE:LEARN COGNITIVE DIAGNOSIS
              </span>
              <span className="hidden sm:inline px-2.5 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF]">
                Multi-Modal Scaffolding
              </span>
            </div>

            <div className="max-w-md ml-auto text-right space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                <span>Misconception Resolved: "Print != Return"</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Socratic Guided Retesting
              </h3>
              <p className="text-xs sm:text-sm text-[#A3A9B5] leading-relaxed">
                4-tier hint ladder directs mental focus without giving away code. Verified across 3 transfer scenarios before marking mastery.
              </p>
              <div className="pt-2 flex justify-end gap-2 text-[11px] font-mono text-emerald-400">
                <span className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Transfer Test: Passed
                </span>
                <span className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Delay Check: Scheduled
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#6B7280]">
              State: Durable cognitive retention verified
            </div>
          </div>

          {/* LEFT SIDE: Conventional Auto-Graders (Clipped over right side) */}
          <div
            className="absolute inset-0 bg-[#0B0C0E] border-r border-white/20 p-8 sm:p-12 flex flex-col justify-between"
            style={{
              clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
            }}
          >
            <div className="flex items-center justify-between text-xs font-mono text-rose-400">
              <span className="flex items-center gap-2 font-semibold">
                <XCircle className="w-4 h-4 text-rose-400" />
                CONVENTIONAL AUTO-GRADERS
              </span>
              <span className="hidden sm:inline px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300">
                Binary Pass / Fail
              </span>
            </div>

            <div className="max-w-md space-y-3">
              <div className="p-4 rounded-xl bg-black/80 border border-rose-500/30 font-mono text-xs text-rose-400 space-y-1">
                <div className="font-bold flex items-center gap-2">
                  <span>&gt; FAILED: Test Case 3</span>
                </div>
                <div className="text-zinc-400">Expected: 12</div>
                <div className="text-rose-300">Received: None</div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Zero Explanation Provided
              </h3>
              <p className="text-xs sm:text-sm text-[#A3A9B5] leading-relaxed">
                The student tweaks random variables until tests pass by fluke, leaving the foundational mental bug completely unaddressed.
              </p>
            </div>

            <div className="text-[11px] font-mono text-[#6B7280]">
              State: 84% probability of repeat bug next session
            </div>
          </div>

          {/* Draggable Divider Handle */}
          <div
            onPointerDown={handlePointerDown}
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[#00E5FF] via-white to-[#3B82F6] cursor-ew-resize z-30 shadow-[0_0_16px_#00E5FF]"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#11141B] border-2 border-white flex items-center justify-center shadow-xl">
              <div className="flex items-center gap-0.5 text-white">
                <span className="text-[10px] font-bold">&lsaquo;</span>
                <span className="text-[10px] font-bold">&rsaquo;</span>
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* 4 Compact One-Line Highlights Below */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {painPoints.map((pt, idx) => {
          const Icon = pt.icon;
          return (
            <Glass
              key={idx}
              tier={pt.activeSide ? "elevated" : "subtle"}
              className={`p-4 rounded-xl transition-all duration-300 ${
                pt.activeSide
                  ? "border-[#00E5FF]/40 bg-[#11141B] shadow-[0_0_20px_rgba(0,229,255,0.15)]"
                  : "border-white/[0.06] opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    pt.activeSide
                      ? "bg-[#00E5FF]/10 text-[#00E5FF]"
                      : "bg-white/5 text-[#A3A9B5]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F4F5F7]">
                    {pt.title}
                  </div>
                  <div className="text-xs text-[#A3A9B5] mt-1 leading-normal">
                    {pt.desc}
                  </div>
                </div>
              </div>
            </Glass>
          );
        })}
      </div>
    </section>
  );
};
