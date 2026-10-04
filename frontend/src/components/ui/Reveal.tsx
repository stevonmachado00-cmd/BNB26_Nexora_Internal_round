import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface EyebrowProps {
  children: React.ReactNode;
  accent?: "cyan" | "amber" | "emerald" | "rose";
  className?: string;
}

export const Eyebrow: React.FC<EyebrowProps> = ({
  children,
  accent = "cyan",
  className = "",
}) => {
  const dotColor = {
    cyan: "bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]",
    amber: "bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]",
    emerald: "bg-[#10B981] shadow-[0_0_8px_#10B981]",
    rose: "bg-[#F43F5E] shadow-[0_0_8px_#F43F5E]",
  }[accent];

  return (
    <div
      className={`inline-flex items-center gap-2 text-xs font-normal tracking-wide text-[#A3A9B5] mb-4 ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="font-sans">{children}</span>
    </div>
  );
};

interface RevealWordsProps {
  text: string;
  gradientWord?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export const RevealWords: React.FC<RevealWordsProps> = ({
  text,
  gradientWord,
  className = "",
  as = "h1",
}) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.045 },
    },
  };

  const wordAnimation = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 28,
      filter: shouldReduceMotion ? "none" : "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const Component = motion[as];

  return (
    <Component
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={`overflow-hidden flex flex-wrap gap-x-[0.28em] gap-y-[0.1em] ${className}`}
    >
      {words.map((word, i) => {
        const isGradient = gradientWord && word.toLowerCase().includes(gradientWord.toLowerCase());
        return (
          <motion.span
            key={i}
            variants={wordAnimation}
            className={`inline-block ${
              isGradient
                ? "text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#3B82F6]"
                : ""
            }`}
          >
            {word}
          </motion.span>
        );
      })}
    </Component>
  );
};

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FadeUp: React.FC<FadeUpProps> = ({
  children,
  delay = 0,
  className = "",
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
