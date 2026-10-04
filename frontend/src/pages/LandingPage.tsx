import React from "react";
import {
  ArrowRight,
  AlertTriangle,
  Layers,
  Terminal,
  Cpu,
  GitBranch,
} from "lucide-react";

interface LandingPageProps {
  onStartLearning: () => void;
  onExploreDemo: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onExploreDemo,
  onLogin,
}) => {
  return (
    <div className="min-h-screen bg-[#090d13] text-[#e6edf3] flex flex-col font-sans select-none">
      {/* Navigation */}
      <nav className="border-b border-[#212734] bg-[#0c1017] sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#1b2230] border border-[#2f3a4e] flex items-center justify-center text-[#f0f6fc] font-mono font-bold text-xs tracking-tight">
            RE
          </div>
          <span className="font-bold font-mono tracking-wider text-sm text-[#f0f6fc]">
            RE:LEARN
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-mono">
          <button
            onClick={onLogin}
            className="px-3 py-1.5 rounded text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#161c26] font-medium transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onStartLearning}
            className="px-3.5 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] font-semibold text-white border border-[#2ea043] transition-colors"
          >
            Launch Platform
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141922] border border-[#262e3d] text-[#8b949e] text-xs font-mono">
          <Cpu className="w-3.5 h-3.5 text-[#58a6ff]" />
          <span>Cognitive Diagnosis Engine for Python</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f0f6fc] leading-tight font-mono">
          Understand why your code failed.
        </h1>

        <p className="text-sm sm:text-base text-[#8b949e] max-w-2xl mx-auto leading-relaxed">
          Traditional platforms treat errors as simple test mismatches. Re:Learn pinpoints the exact line, exposes the underlying misconception, teaches the mental model, and confirms retention through transfer challenges.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 font-mono text-xs">
          <button
            onClick={onStartLearning}
            className="w-full sm:w-auto px-5 py-2.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-semibold flex items-center justify-center gap-2 border border-[#2ea043] transition-colors"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-5 py-2.5 rounded bg-[#141922] hover:bg-[#1c2330] text-[#c9d1d9] border border-[#262e3d] font-semibold transition-colors"
          >
            Interactive Demo Tour (3 Min)
          </button>
        </div>

        {/* Cognitive Pipeline Ribbon */}
        <div className="pt-6">
          <div className="p-3 rounded bg-[#0c1017] border border-[#212734] flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] font-mono text-[#8b949e]">
            <span className="text-[#f0f6fc] font-semibold">Code Submission</span>
            <span className="text-[#484f58]">→</span>
            <span className="text-[#d29922] font-semibold">Line-Level AST Fault</span>
            <span className="text-[#484f58]">→</span>
            <span className="text-[#58a6ff] font-semibold">Diagnostic Probe</span>
            <span className="text-[#484f58]">→</span>
            <span className="text-[#c9d1d9] font-semibold">Targeted Practice</span>
            <span className="text-[#484f58]">→</span>
            <span className="text-[#3fb950] font-bold">Transfer Mastery</span>
          </div>
        </div>
      </section>

      {/* Comparison Section: 3-Way Architectural Comparison */}
      <section className="py-12 px-6 max-w-5xl mx-auto w-full">
        <div className="space-y-1.5 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#f0f6fc] font-mono tracking-tight">
            Comparison: Beyond "Wrong Answer"
          </h2>
          <p className="text-[#8b949e] text-xs">
            How Re:Learn differs fundamentally from traditional judges and generic AI wrappers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Traditional Judges */}
          <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#6e7681] font-bold">
              Traditional Platforms
            </div>
            <div className="p-3 rounded bg-[#180e11] border border-[#381a1e] font-mono text-xs text-[#f85149] space-y-1">
              <div className="font-bold">❌ Wrong Answer</div>
              <div className="text-[#8b949e] text-[11px]">Test failed on input (5, 3). Output mismatch.</div>
            </div>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Provides zero structural insight into logic failures. Encourages blind trial-and-error guessing.
            </p>
          </div>

          {/* Generic AI Wrappers */}
          <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#6e7681] font-bold">
              Generic AI Wrapper
            </div>
            <div className="p-3 rounded bg-[#121620] border border-[#1f2838] font-mono text-xs text-[#58a6ff] space-y-1">
              <div className="font-bold">❌ Code Correction</div>
              <div className="text-[#8b949e] text-[11px]">Here is the corrected solution code to copy...</div>
            </div>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Dumps the final answer without cognitive struggle, bypassing genuine mental model formation.
            </p>
          </div>

          {/* Re:Learn Cognitive Engine */}
          <div className="p-4 rounded bg-[#121722] border border-[#388bfd]/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#58a6ff] font-bold">
                Re:Learn Cognitive Model
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#162132] text-[#58a6ff] border border-[#233550] font-mono">
                Line 2 AST Fault
              </span>
            </div>

            <div className="p-3 rounded bg-[#1f1608] border border-[#4d360f] font-mono text-xs text-[#d29922] space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Conceptual Misconception
              </div>
              <div className="text-[#c9d1d9] text-[11px] font-sans">
                Treating <code className="bg-[#291e0a] px-1 py-0.2 rounded font-mono text-[#d29922]">print()</code> as if it delivers a return value to caller variable.
              </div>
            </div>

            <p className="text-xs text-[#c9d1d9] leading-relaxed">
              Isolates the root belief, validates with diagnostic probes, and checks retention in transfer problems.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Step Technical Loop */}
      <section className="py-12 px-6 max-w-5xl mx-auto w-full border-t border-[#212734]">
        <div className="space-y-1.5 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#f0f6fc] font-mono tracking-tight">
            The 4-Step Cognitive Loop
          </h2>
          <p className="text-[#8b949e] text-xs font-mono">
            Diagnose → Disambiguate → Reassess → Retain
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded bg-[#0e1218] border border-[#212734] space-y-2">
            <div className="text-xs font-mono font-bold text-[#8b949e]">
              01 // AST Diagnosis
            </div>
            <h3 className="font-bold text-[#f0f6fc] text-xs font-mono">Line-Level Fault</h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Pinpoints exact lines and classifies errors into syntax, runtime, careless slips, or mental misconceptions.
            </p>
          </div>

          <div className="p-3.5 rounded bg-[#0e1218] border border-[#212734] space-y-2">
            <div className="text-xs font-mono font-bold text-[#8b949e]">
              02 // Cognitive Probe
            </div>
            <h3 className="font-bold text-[#f0f6fc] text-xs font-mono">Look-Alike Disambiguation</h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Discriminates between look-alike bugs using targeted micro-probes, preventing false-positive reteaching.
            </p>
          </div>

          <div className="p-3.5 rounded bg-[#0e1218] border border-[#212734] space-y-2">
            <div className="text-xs font-mono font-bold text-[#8b949e]">
              03 // Transfer Test
            </div>
            <h3 className="font-bold text-[#f0f6fc] text-xs font-mono">Targeted Reassessment</h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Validates whether concepts generalize into fresh problem contexts rather than just memorized solutions.
            </p>
          </div>

          <div className="p-3.5 rounded bg-[#0e1218] border border-[#212734] space-y-2">
            <div className="text-xs font-mono font-bold text-[#8b949e]">
              04 // Memory Trace
            </div>
            <h3 className="font-bold text-[#f0f6fc] text-xs font-mono">Spaced Re-Check</h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Periodically verifies consolidated memory retention before graduating misconceptions to resolved.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="mt-auto border-t border-[#212734] bg-[#0c1017] p-6 text-center text-xs text-[#6e7681] font-mono">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Re:Learn Cognitive Engine v1.0</span>
          <button
            onClick={onStartLearning}
            className="text-[#f0f6fc] hover:text-[#58a6ff] transition-colors font-semibold"
          >
            Launch Interactive Environment →
          </button>
        </div>
      </footer>
    </div>
  );
};
