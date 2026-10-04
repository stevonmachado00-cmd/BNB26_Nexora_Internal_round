import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Brain,
  Target,
  Terminal,
} from "lucide-react";
import { learnerService } from "../services/learnerService";

interface OnboardingProps {
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedGoal, setSelectedGoal] = useState("Placements & Interviews");
  const [selectedExperience, setSelectedExperience] = useState("Intermediate");
  const [quizIndex, setQuizIndex] = useState(0);

  const goals = [
    {
      title: "Python Basics",
      desc: "I want to understand programming fundamentals from scratch.",
    },
    {
      title: "Placements & Interviews",
      desc: "I want programming skills and deep conceptual clarity for placement preparation.",
    },
    {
      title: "Data Analysis",
      desc: "I want Python for data, statistics, and analytics workflows.",
    },
    {
      title: "College",
      desc: "I want to strengthen my academic CS grades and lab performance.",
    },
    {
      title: "Build Projects",
      desc: "I want to learn Python by building real tools and backend systems.",
    },
  ];

  const experiences = [
    {
      title: "Complete beginner",
      desc: "I've never programmed in any language before.",
    },
    {
      title: "Beginner",
      desc: "I know basic concepts like variables and print statements.",
    },
    {
      title: "Intermediate",
      desc: "I can write simple programs with loops and functions.",
    },
    {
      title: "Advanced beginner",
      desc: "I can solve basic algorithm problems independently.",
    },
  ];

  const diagnosticQuestions = [
    {
      concept: "Variables",
      q: "What is the value of y after: x = 10; y = x; x = 20?",
      options: ["10", "20", "None", "Error"],
      correct: 0,
    },
    {
      concept: "Conditions",
      q: "Which expression checks whether n is between 1 and 10 (inclusive)?",
      options: ["1 <= n <= 10", "1 < n < 10", "n == 1 or 10", "between(n, 1, 10)"],
      correct: 0,
    },
    {
      concept: "Loops",
      q: "What does list(range(2, 5)) evaluate to in Python?",
      options: ["[2, 3, 4]", "[2, 3, 4, 5]", "[3, 4, 5]", "[2, 5]"],
      correct: 0,
    },
    {
      concept: "Functions",
      q: "What is the return value of a Python function that has no 'return' statement?",
      options: ["None", "0", "False", "Empty string"],
      correct: 0,
    },
    {
      concept: "Lists",
      q: "If nums = [10, 20, 30], what does nums[-1] access?",
      options: ["30", "10", "20", "IndexError"],
      correct: 0,
    },
    {
      concept: "Dictionaries",
      q: "How do you safely retrieve a key 'age' with a fallback of 0 if absent?",
      options: ["d.get('age', 0)", "d['age'] or 0", "d.fetch('age', 0)", "d.age"],
      correct: 0,
    },
    {
      concept: "Return Values",
      q: "What does this output? x = print('Hi'); print(x)",
      options: ["Hi then None", "Hi then Hi", "None only", "SyntaxError"],
      correct: 0,
    },
    {
      concept: "List Mutation",
      q: "What does items = [3, 1].sort() leave in variable items?",
      options: ["None", "[1, 3]", "[3, 1]", "Error"],
      correct: 0,
    },
    {
      concept: "Strings",
      q: "Can you change s[0] = 'H' in s = 'hello' directly?",
      options: [
        "No, strings are immutable in Python",
        "Yes, strings support item assignment",
        "Only if lowercase",
        "Only in Python 3",
      ],
      correct: 0,
    },
    {
      concept: "Problem Solving",
      q: "To accumulate a running total across a list, where should total = 0 be placed?",
      options: [
        "Before the loop begins",
        "Inside the loop on each pass",
        "After the loop finishes",
        "At the module top only",
      ],
      correct: 0,
    },
  ];

  const handleQuizAnswer = (_optIdx: number) => {
    if (quizIndex < diagnosticQuestions.length - 1) {
      setQuizIndex((p) => p + 1);
    } else {
      setStep(4);
    }
  };

  const handleFinishOnboarding = () => {
    learnerService.updateLearner({ goal: selectedGoal });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#090d13] text-[#e6edf3] flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-2xl p-6 rounded bg-[#0e1218] border border-[#212734] space-y-5">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-[#212734] pb-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#f0f6fc] font-bold">Calibration Step {step} / 4</span>
            <span className="text-[#484f58]">|</span>
            <span className="text-[#8b949e]">
              {step === 1 && "Target Objective"}
              {step === 2 && "Prior Background"}
              {step === 3 && "Diagnostic Probe"}
              {step === 4 && "Initial Skill Map"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-5 h-1 rounded-sm ${
                  s <= step ? "bg-[#388bfd]" : "bg-[#161b24]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: GOAL SELECTION */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#f0f6fc] font-mono">
                Select your primary Python target
              </h2>
              <p className="text-xs text-[#8b949e] mt-0.5">
                The cognitive engine will prioritize problem sets and misconceptions aligned with your goals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {goals.map((g) => {
                const isSelected = selectedGoal === g.title;
                return (
                  <button
                    key={g.title}
                    onClick={() => setSelectedGoal(g.title)}
                    className={`p-3 rounded border text-left flex flex-col justify-between gap-1 transition-colors ${
                      isSelected
                        ? "bg-[#161d28] border-[#388bfd]"
                        : "bg-[#090d13] border-[#212734] hover:border-[#303848]"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span
                        className={`font-semibold text-xs ${
                          isSelected ? "text-[#f0f6fc]" : "text-[#c9d1d9]"
                        }`}
                      >
                        {g.title}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#58a6ff]" />}
                    </div>
                    <p className="text-[11px] text-[#8b949e] leading-snug">{g.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#212734] font-mono">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-xs border border-[#2ea043] flex items-center gap-1.5 transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: EXPERIENCE LEVEL */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#f0f6fc] font-mono">
                What is your current programming background?
              </h2>
              <p className="text-xs text-[#8b949e] mt-0.5">
                Sets the baseline difficulty and AST fault classification sensitivity.
              </p>
            </div>

            <div className="space-y-2">
              {experiences.map((exp) => {
                const isSelected = selectedExperience === exp.title;
                return (
                  <button
                    key={exp.title}
                    onClick={() => setSelectedExperience(exp.title)}
                    className={`w-full p-3 rounded border text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-[#161d28] border-[#388bfd]"
                        : "bg-[#090d13] border-[#212734] hover:border-[#303848]"
                    }`}
                  >
                    <div>
                      <div
                        className={`font-semibold text-xs font-mono ${
                          isSelected ? "text-[#f0f6fc]" : "text-[#c9d1d9]"
                        }`}
                      >
                        {exp.title}
                      </div>
                      <div className="text-[11px] text-[#8b949e] mt-0.5">{exp.desc}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#58a6ff] shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-2 border-t border-[#212734] font-mono">
              <button
                onClick={() => setStep(1)}
                className="px-3 py-1.5 rounded bg-[#141922] hover:bg-[#1a202c] text-[#c9d1d9] text-xs border border-[#262e3d] transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-4 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-xs border border-[#2ea043] flex items-center gap-1.5 transition-colors"
              >
                <span>Start Diagnostic Check (10 Qs)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: 10-QUESTION DIAGNOSTIC */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#58a6ff] font-bold">
                  Question {quizIndex + 1} of {diagnosticQuestions.length} // {diagnosticQuestions[quizIndex].concept}
                </span>
                <h3 className="text-sm font-bold text-[#f0f6fc] font-mono mt-0.5">
                  {diagnosticQuestions[quizIndex].q}
                </h3>
              </div>
            </div>

            <div className="space-y-1.5 font-mono">
              {diagnosticQuestions[quizIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(idx)}
                  className="w-full p-2.5 rounded bg-[#090d13] hover:bg-[#12161f] border border-[#212734] hover:border-[#303848] text-left text-xs flex items-center gap-2.5 text-[#c9d1d9] transition-colors"
                >
                  <span className="w-5 h-5 rounded bg-[#161b24] border border-[#262e3d] flex items-center justify-center font-bold text-[10px] text-[#8b949e]">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#212734] text-[10px] font-mono text-[#6e7681]">
              <span>Clicking an option advances immediately.</span>
              <button
                onClick={() => handleQuizAnswer(0)}
                className="text-[#8b949e] hover:text-[#c9d1d9] underline"
              >
                Skip Question
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: INITIAL SKILL MAP GENERATED */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center space-y-1 py-1">
              <div className="w-8 h-8 rounded bg-[#0c2013] border border-[#1e4a29] flex items-center justify-center text-[#3fb950] mx-auto">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#f0f6fc] font-mono">
                Cognitive Learner Model Initialized
              </h2>
              <p className="text-xs text-[#8b949e]">
                Baseline set: Level 8 • 67% Initial Python Mastery • 2 Active Misconceptions Identified
              </p>
            </div>

            <div className="p-3 rounded bg-[#090d13] border border-[#212734] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-[#8b949e] text-[11px]">
                <span>Target Track: {selectedGoal}</span>
                <span className="text-[#3fb950]">Calibrated</span>
              </div>
              <div className="p-2 rounded bg-[#12161f] border border-[#212734] text-[11px] text-[#c9d1d9]">
                Recommended First Problem: <strong>Functions & Return Values (Problem 12)</strong>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#212734] font-mono">
              <button
                onClick={handleFinishOnboarding}
                className="px-4 py-2 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-xs border border-[#2ea043] flex items-center gap-1.5 transition-colors"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
