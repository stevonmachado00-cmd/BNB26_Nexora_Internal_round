import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Terminal, Code2, ShieldCheck, Heart } from "lucide-react";
import { Glass } from "../ui/Glass";
import { MagneticButton } from "../ui/MagneticButton";

interface FinalCtaProps {
  onStartLearning: () => void;
  onGoToDashboard: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({
  onStartLearning,
  onGoToDashboard,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Floating background code glyph particles (<= 20 elements)
  const glyphs = ["{ }", "def", "return", "print", "[]", "->", "==", "lambda", ":", "assert", "if", "else"];

  return (
    <section className="relative z-10 py-28 sm:py-36 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      {/* Elevated Glass CTA Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-16 text-center select-none">
        {/* Soft accent spotlight behind container */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#00E5FF]/20 via-[#3B82F6]/15 to-[#10B981]/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Ambient floating code glyph particles */}
        {!shouldReduceMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 opacity-20">
            {glyphs.map((g, i) => (
              <motion.span
                key={i}
                initial={{
                  x: `${(i * 19) % 90}%`,
                  y: `${(i * 27) % 85}%`,
                }}
                animate={{
                  y: ["-8px", "8px", "-8px"],
                  rotate: [0, 4, -4, 0],
                }}
                transition={{
                  duration: 6 + (i % 4),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
                className="absolute font-mono text-xs text-[#00E5FF]"
              >
                {g}
              </motion.span>
            ))}
          </div>
        )}

        <Glass
          tier="elevated"
          className="rounded-3xl border border-white/15 p-8 sm:p-14 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.85)] max-w-4xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#A3A9B5]">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Interactive Python Sandbox &bull; Cognitive Diagnostics</span>
          </div>

          <h2 className="text-3xl sm:text-6xl font-extrabold tracking-[-0.035em] text-[#F4F5F7] leading-tight">
            Stop guessing.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#3B82F6]">
              Start mastering.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#A3A9B5] max-w-xl mx-auto leading-relaxed">
            Diagnose the exact faulty beliefs holding back your Python code and build authentic problem-solving intuition.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <MagneticButton
              variant="primary"
              size="lg"
              onClick={onStartLearning}
              className="w-full sm:w-auto"
            >
              <span>Launch Learning Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              size="lg"
              onClick={onGoToDashboard}
              className="w-full sm:w-auto"
            >
              Explore Fundamentals
            </MagneticButton>
          </div>
        </Glass>
      </div>

      {/* Minimal Tasteful Footer */}
      <footer className="mt-20 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] font-mono gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white text-black font-extrabold text-[10px] flex items-center justify-center">
            RE
          </div>
          <span className="font-bold text-[#A3A9B5]">RE:LEARN</span>
          <span>&bull; Cognitive Python Lab</span>
        </div>

        <div className="flex items-center gap-6 text-[#A3A9B5]">
          <button
            onClick={onStartLearning}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Sandbox
          </button>
          <button
            onClick={onGoToDashboard}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Curriculum
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors cursor-pointer"
          >
            Open Source
          </a>
        </div>

        <div>
          &copy; {new Date().getFullYear()} Re:Learn. Precision cognitive science.
        </div>
      </footer>
    </section>
  );
};
