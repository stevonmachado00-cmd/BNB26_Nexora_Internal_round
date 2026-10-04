import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  RotateCcw,
  Target,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Glass } from "../ui/Glass";
import { Eyebrow, RevealWords, FadeUp } from "../ui/Reveal";

interface StateNode {
  id: string;
  name: string;
  tag: string;
  color: string;
  glow: string;
  textColor: string;
  definition: string;
  x: number;
  y: number;
}

export const LearnerStateMachine: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeTokenIdx, setActiveTokenIdx] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const nodes: StateNode[] = [
    {
      id: "never_seen",
      name: "Never Seen",
      tag: "QUEUED IN SYLLABUS",
      color: "rgba(255, 255, 255, 0.08)",
      glow: "rgba(255, 255, 255, 0.15)",
      textColor: "text-[#A3A9B5]",
      definition: "Concepts and edge cases waiting in your learning syllabus. Problems will test for these at higher levels.",
      x: 15,
      y: 50,
    },
    {
      id: "active",
      name: "Active",
      tag: "UNDER REMEDIATION",
      color: "rgba(244, 63, 94, 0.15)",
      glow: "rgba(244, 63, 94, 0.35)",
      textColor: "text-[#F43F5E]",
      definition: "Identified misconception currently undergoing targeted intervention, hint ladder guidance, and transfer checks.",
      x: 40,
      y: 50,
    },
    {
      id: "resolved",
      name: "Resolved",
      tag: "VERIFIED DURABLE",
      color: "rgba(16, 185, 129, 0.15)",
      glow: "rgba(16, 185, 129, 0.35)",
      textColor: "text-[#10B981]",
      definition: "Score remained low across at least 2 distinct transfer problems and survived a delayed login re-check.",
      x: 82,
      y: 50,
    },
    {
      id: "recurring",
      name: "Recurring",
      tag: "REFRESHER SCHEDULED",
      color: "rgba(245, 158, 11, 0.15)",
      glow: "rgba(245, 158, 11, 0.35)",
      textColor: "text-[#F59E0B]",
      definition: "A previously resolved misconception resurfaced in new code. The system switches teaching styles immediately.",
      x: 61,
      y: 82,
    },
  ];

  // Auto-play traveling token through states
  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setActiveTokenIdx((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const activeNode = nodes.find((n) => n.id === hoveredNode) || nodes[activeTokenIdx];

  return (
    <section className="relative z-10 py-28 sm:py-36 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <Eyebrow accent="cyan">Continuous Learner Model</Eyebrow>
        <RevealWords
          text="State-Machine Mastery Engine"
          as="h2"
          className="text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-[#F4F5F7] justify-center mb-3 leading-tight"
        />
        <FadeUp delay={0.1}>
          <p className="text-base sm:text-lg text-[#A3A9B5] max-w-xl mx-auto">
            Every concept maintains an active state vector. Misconceptions never disappear without proof.
          </p>
        </FadeUp>
      </div>

      <FadeUp delay={0.2}>
        <Glass
          tier="elevated"
          className="rounded-3xl border border-white/10 p-6 sm:p-12 overflow-hidden shadow-[0_24px_64px_-16px_rgba(0,0,0,0.8)] relative"
        >
          {/* SVG Canvas for Flowing Connection Paths */}
          <div className="relative w-full h-[320px] sm:h-[360px]">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1000 400"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A3A9B5" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="recurGradient" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Path 1: Never Seen -> Active */}
              <path
                d="M 170 200 L 380 200"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
                strokeDasharray="6 6"
                fill="none"
              />

              {/* Path 2: Active -> Resolved */}
              <path
                d="M 460 200 L 780 200"
                stroke="url(#pathGradient)"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Path 3: Resolved -> Recurring (Curved down loop) */}
              <path
                d="M 830 230 C 830 330, 660 330, 610 330"
                stroke="rgba(245, 158, 11, 0.4)"
                strokeWidth="2"
                strokeDasharray="4 4"
                fill="none"
              />

              {/* Path 4: Recurring -> Active (Loop back) */}
              <path
                d="M 570 330 C 420 330, 420 250, 420 230"
                stroke="url(#recurGradient)"
                strokeWidth="2"
                fill="none"
              />

              {/* Particle indicator moving along edge */}
              {!shouldReduceMotion && (
                <circle r="4" fill="#00E5FF" className="filter drop-shadow-[0_0_8px_#00E5FF]">
                  <animateMotion
                    path="M 170 200 L 420 200 L 820 200 C 820 330, 660 330, 610 330 C 420 330, 420 250, 420 200"
                    dur="7s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </svg>

            {/* Interactive State Nodes */}
            <div className="absolute inset-0">
              {nodes.map((node, idx) => {
                const isCurrent = activeTokenIdx === idx;
                const isHovered = hoveredNode === node.id;

                return (
                  <div
                    key={node.id}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    className="absolute cursor-pointer select-none"
                  >
                    <motion.div
                      animate={{
                        scale: isHovered ? 1.08 : isCurrent ? 1.04 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="px-5 py-3 rounded-full border flex items-center gap-2.5 backdrop-blur-xl transition-shadow"
                      style={{
                        backgroundColor: node.color,
                        borderColor: isHovered || isCurrent ? node.glow : "rgba(255,255,255,0.12)",
                        boxShadow:
                          isHovered || isCurrent
                            ? `0 0 24px ${node.glow}`
                            : "0 8px 20px rgba(0,0,0,0.5)",
                      }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            node.id === "resolved"
                              ? "#10B981"
                              : node.id === "active"
                              ? "#F43F5E"
                              : node.id === "recurring"
                              ? "#F59E0B"
                              : "#A3A9B5",
                        }}
                      />
                      <span className="font-mono text-xs font-bold text-white">
                        {node.name}
                      </span>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active / Hovered Definition Tooltip Card */}
          <div className="mt-4 p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#00E5FF] font-semibold">
                  {activeNode.tag}
                </span>
                <span className="text-sm font-bold text-white">
                  {activeNode.name}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#A3A9B5] max-w-2xl leading-relaxed">
                {activeNode.definition}
              </p>
            </div>

            <div className="font-mono text-xs text-[#6B7280] shrink-0">
              Hover nodes to inspect rules
            </div>
          </div>
        </Glass>
      </FadeUp>
    </section>
  );
};
