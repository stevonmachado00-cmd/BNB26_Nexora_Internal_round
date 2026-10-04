import React, { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  RotateCw,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Eyebrow, RevealWords, FadeUp } from "../ui/Reveal";

interface CardSpec {
  id: string;
  number: string;
  title: string;
  category: string;
  accentColor: string;
  glowColor: string;
  frontVisual: React.ReactNode;
  frontSummary: string;
  backTitle: string;
  backBullets: string[];
  takeaway: string;
}

export const BentoFlashcards: React.FC = () => {
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();

  const toggleFlip = useCallback((id: string) => {
    setFlippedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const flipAllCards = useCallback(() => {
    const allFlipped = ["c1", "c2", "c3", "c4"].every((id) => flippedMap[id]);
    ["c1", "c2", "c3", "c4"].forEach((id, idx) => {
      setTimeout(() => {
        setFlippedMap((prev) => ({ ...prev, [id]: !allFlipped }));
      }, idx * 60);
    });
  }, [flippedMap]);

  const cards: CardSpec[] = [
    {
      id: "c1",
      number: "01",
      title: "Look-Alike Bugs",
      category: "DISAMBIGUATION",
      accentColor: "#00E5FF",
      glowColor: "rgba(0, 229, 255, 0.2)",
      frontVisual: (
        <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs space-y-1 my-3">
          <div className="text-[#6B7280]"># Did learner forget return or misunderstand print?</div>
          <div><span className="text-[#3B82F6]">def</span> <span className="text-[#00E5FF]">add</span>(a, b):</div>
          <div className="pl-4 text-[#F43F5E]">print(a + b) <span className="text-[#6B7280]"># None</span></div>
        </div>
      ),
      frontSummary: "Two learners submit the exact same code for opposite psychological reasons.",
      backTitle: "One-Question Probe Disambiguation",
      backBullets: [
        "Detects statistical tie between slip vs misconception.",
        "Asks 1 probe question: 'What does x = print(5) store?'",
        "If 'None' → quick syntax alert; if '5' → full output-vs-return lesson.",
      ],
      takeaway: "Saves proficient learners time while catching true novices.",
    },
    {
      id: "c2",
      number: "02",
      title: "The Hint Ladder",
      category: "LLM GUARDRAILS",
      accentColor: "#F59E0B",
      glowColor: "rgba(245, 158, 11, 0.2)",
      frontVisual: (
        <div className="flex items-center gap-1.5 py-3 my-2">
          {["1. Question", "2. Clue", "3. Contrast", "4. Model"].map((tier, idx) => (
            <div
              key={idx}
              className={`flex-1 p-2 rounded-lg text-center font-mono text-[10px] border ${
                idx === 1
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold"
                  : "bg-white/5 border-white/5 text-[#6B7280]"
              }`}
            >
              {tier}
            </div>
          ))}
        </div>
      ),
      frontSummary: "Unrestricted AI code completion ruins memory formation.",
      backTitle: "4-Stage Scaffolded Guidance",
      backBullets: [
        "Tier 1: Socratic guiding question on problem logic.",
        "Tier 2: Targeted hint pointing to relevant line.",
        "Tier 3 & 4: Contrast & worked samples on unrelated tasks.",
      ],
      takeaway: "Never hands over code to the current task.",
    },
    {
      id: "c3",
      number: "03",
      title: "Transfer Proof",
      category: "REASSESSMENT",
      accentColor: "#10B981",
      glowColor: "rgba(16, 185, 129, 0.2)",
      frontVisual: (
        <div className="flex items-center justify-between p-3 my-2 rounded-xl bg-black/40 border border-white/10 font-mono text-xs">
          <span className="text-[#A3A9B5]">Initial Pass</span>
          <span className="text-[#6B7280]">&rarr;</span>
          <span className="text-amber-400">Transfer #1</span>
          <span className="text-[#6B7280]">&rarr;</span>
          <span className="text-emerald-400 font-bold">Transfer #2</span>
        </div>
      ),
      frontSummary: "A correct patch immediately after reading advice is echo memory.",
      backTitle: "Multi-Surface Verification",
      backBullets: [
        "Disguised transfer problems with identical logic traps.",
        "Predict-and-explain verification on unfamiliar code.",
        "Delayed check administered automatically upon next login.",
      ],
      takeaway: "A single green test pass is never proof of learning.",
    },
    {
      id: "c4",
      number: "04",
      title: "Pyodide WASM",
      category: "SANDBOX ARCHITECTURE",
      accentColor: "#3B82F6",
      glowColor: "rgba(59, 130, 246, 0.2)",
      frontVisual: (
        <div className="p-3 my-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between font-mono text-xs text-[#00E5FF]">
          <span>&gt; Python 3.11 WASM</span>
          <span className="text-emerald-400">0ms server latency</span>
        </div>
      ),
      frontSummary: "Captures line-by-line variable state with zero server roundtrips.",
      backTitle: "Local Browser Sandboxing",
      backBullets: [
        "Code executes 100% locally via WebAssembly.",
        "Captures variable scope history at each statement.",
        "Complete learner privacy: code never leaves client.",
      ],
      takeaway: "Safe, instant micro-state visual tracing.",
    },
  ];

  return (
    <section className="relative z-10 py-28 sm:py-36 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
      {/* Background aurora pool behind cards */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] max-w-full h-[500px] bg-gradient-to-tr from-[#00E5FF]/10 via-[#3B82F6]/5 to-[#10B981]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <Eyebrow accent="cyan">Under the Hood</Eyebrow>
          <RevealWords
            text="Interactive Cognitive Flashcards"
            as="h2"
            className="text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-[#F4F5F7] mb-3"
          />
          <FadeUp delay={0.1}>
            <p className="text-base text-[#A3A9B5] max-w-lg">
              Click any card to flip and inspect the cognitive science mechanisms driving Re:Learn.
            </p>
          </FadeUp>
        </div>

        <button
          onClick={flipAllCards}
          className="self-start sm:self-auto shrink-0 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#F4F5F7] flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-[#00E5FF]/40"
        >
          <RotateCw className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Flip All Cards</span>
        </button>
      </div>

      {/* 2x2 Clean Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {cards.map((card) => {
          const isFlipped = !!flippedMap[card.id];

          return (
            <div
              key={card.id}
              tabIndex={0}
              role="button"
              aria-pressed={isFlipped}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleFlip(card.id);
                }
              }}
              onClick={() => toggleFlip(card.id)}
              className="h-[380px] sm:h-[370px] cursor-pointer [perspective:1400px] select-none outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded-2xl relative"
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 24,
                }}
                className="w-full h-full relative [transform-style:preserve-3d] rounded-2xl"
              >
                {/* FRONT FACE */}
                <div
                  className="absolute inset-0 w-full h-full [backface-visibility:hidden] p-6 sm:p-7 rounded-2xl glass-default border border-white/10 hover:border-[#00E5FF]/40 flex flex-col justify-between transition-colors duration-300"
                  style={{
                    boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5)`,
                  }}
                >
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs text-[#6B7280]">
                        #{card.number} &bull; {card.category}
                      </span>
                      <span className="text-[11px] font-mono text-[#A3A9B5] flex items-center gap-1.5">
                        <span>Flip</span>
                        <RotateCw className="w-3 h-3 text-[#00E5FF]" />
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {card.title}
                    </h3>

                    {card.frontVisual}

                    <p className="text-sm text-[#A3A9B5] leading-relaxed mt-2">
                      {card.frontSummary}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#00E5FF]">
                    <span className="font-semibold">Inspect Resolution</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* BACK FACE */}
                <div
                  className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] p-6 sm:p-7 rounded-2xl glass-elevated border border-[#00E5FF]/40 flex flex-col justify-between transition-colors duration-300"
                  style={{
                    boxShadow: `0 20px 48px -12px rgba(0,0,0,0.8), 0 0 32px -8px ${card.glowColor}`,
                  }}
                >
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs text-[#00E5FF] font-semibold">
                        RE:LEARN MECHANISM
                      </span>
                      <span className="text-[11px] font-mono text-[#A3A9B5] flex items-center gap-1">
                        <span>Back</span>
                        <RotateCcw className="w-3 h-3" />
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                      {card.backTitle}
                    </h3>

                    <ul className="space-y-2 text-xs sm:text-sm text-[#F4F5F7]">
                      {card.backBullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-3 border-t border-white/[0.08]">
                    <div className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider mb-1">
                      Core Cognitive Principle
                    </div>
                    <p className="text-xs font-semibold text-emerald-400">
                      "{card.takeaway}"
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
