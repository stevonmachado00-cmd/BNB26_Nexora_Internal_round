import React, { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import { ArrowRight } from "lucide-react";
import { Eyebrow, RevealWords, FadeUp } from "../components/ui/Reveal";
import { MagneticButton } from "../components/ui/MagneticButton";
import { ProblemSplit } from "../components/home/ProblemSplit";
import { BentoFlashcards } from "../components/home/BentoFlashcards";
import { MacBookProbeSection } from "../components/home/MacBookProbeSection";
import { JourneySticky } from "../components/home/JourneySticky";
import { LearnerStateMachine } from "../components/home/LearnerStateMachine";
import { FinalCta } from "../components/home/FinalCta";

interface HeroSectionProps {
  onStartLearning: () => void;
  onGoToDashboard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartLearning,
  onGoToDashboard,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (shouldReduceMotion) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      smoothWheel: true,
    });

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [shouldReduceMotion]);

  // Detect touch device & pointer spotlight
  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToMethodology = useCallback(() => {
    const el = document.getElementById("methodology-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight * 1.5, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#07080B] text-[#F4F5F7] font-sans selection:bg-[#00E5FF]/25 selection:text-white overflow-x-hidden">
      {/* SVG Filter for Liquid Glass Refraction (Progressive Enhancement) */}
      <svg className="hidden" aria-hidden="true">
        <filter id="liquid-glass">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Film Grain Texture Overlay */}
      <div className="fixed inset-0 film-grain z-50 pointer-events-none opacity-40" />

      {/* Desktop Soft Cursor Spotlight */}
      {!isTouchDevice && (
        <div
          className="fixed pointer-events-none z-10 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300 opacity-25"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            background:
              "radial-gradient(circle, rgba(0,229,255,0.08) 0%, rgba(59,130,246,0.03) 50%, transparent 70%)",
          }}
        />
      )}

      {/* Slow-Drifting Aurora Mesh Gradient behind Hero only */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[900px] overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: ["-5%", "5%", "-5%"],
                  y: ["-3%", "4%", "-3%"],
                  scale: [1, 1.08, 1],
                }
          }
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] left-[15%] w-[650px] h-[480px] bg-gradient-to-br from-[#00E5FF]/14 via-[#3B82F6]/8 to-transparent rounded-full blur-[120px] opacity-70"
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: ["5%", "-6%", "5%"],
                  y: ["4%", "-4%", "4%"],
                  scale: [1.05, 0.95, 1.05],
                }
          }
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] right-[15%] w-[550px] h-[440px] bg-gradient-to-bl from-[#3B82F6]/12 via-[#10B981]/6 to-transparent rounded-full blur-[130px] opacity-60"
        />

        {/* Dotted grid with radial mask behind Hero demo */}
        <div
          className="absolute inset-0 dotted-grid opacity-30"
          style={{
            maskImage:
              "radial-gradient(ellipse 65% 55% at 50% 40%, black 20%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 65% 55% at 50% 40%, black 20%, transparent 80%)",
          }}
        />
      </div>

      {/* SECTION 1: HERO (Show, Don't Tell) */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-12 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        <Eyebrow accent="cyan">Cognitive Lab &bull; Dark and Precise</Eyebrow>

        {/* Hero Headline with single gradient keyword */}
        <RevealWords
          text="Learn programming by understanding your mistakes."
          gradientWord="mistakes."
          as="h1"
          className="text-4xl sm:text-7xl lg:text-[84px] font-extrabold tracking-[-0.035em] text-[#F4F5F7] justify-center leading-[1.08] max-w-4xl"
        />

        {/* Concise One-Sentence Subcopy */}
        <FadeUp delay={0.15}>
          <p className="mt-6 text-base sm:text-xl text-[#A3A9B5] max-w-2xl mx-auto leading-relaxed font-normal">
            Re:Learn uncovers the exact conceptual misconception behind your bug, proves it's gone with transfer checks, and remembers it.
          </p>
        </FadeUp>

        {/* Primary CTAs */}
        <FadeUp delay={0.25}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <MagneticButton
              variant="primary"
              size="lg"
              onClick={onStartLearning}
            >
              <span>Start Learning Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              size="lg"
              onClick={onGoToDashboard}
            >
              <span>Explore Dashboard</span>
            </MagneticButton>
          </div>
        </FadeUp>
      </section>

      {/* SECTION 2: PROBE QUESTION LIVE (MacBook Pro + 4 Feature Cards + Explore Methodology) */}
      <MacBookProbeSection onExploreMethodology={scrollToMethodology} />

      {/* SECTION 3: PROBLEM STATEMENT (Before / After Split) */}
      <div id="methodology-section">
        <ProblemSplit />
      </div>

      {/* SECTION 4: UNDER THE HOOD (Interactive 3D Bento Flashcards) */}
      <BentoFlashcards />

      {/* SECTION 5: LEARNER JOURNEY (5-Stage Centered Interactive Stage) */}
      <JourneySticky />

      {/* SECTION 6: LEARNER MODEL (Animated State Machine Mastery Graph) */}
      <LearnerStateMachine />

      {/* SECTION 7: FINAL CTA & MINIMAL FOOTER */}
      <FinalCta
        onStartLearning={onStartLearning}
        onGoToDashboard={onGoToDashboard}
      />
    </div>
  );
};
