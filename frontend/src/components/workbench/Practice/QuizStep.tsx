import React, { useState } from "react";

interface QuizQuestion {
  id: string;
  type: string;
  prompt: string;
  codeSnippet: string;
  options: { id: string; code: string; label: string; correct: boolean; reason: string }[];
}

interface QuizStepProps {
  onSuccess: () => void;
}

export const QuizStep: React.FC<QuizStepProps> = ({ onSuccess }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const questions: QuizQuestion[] = [
    {
      id: "q1",
      type: "Predict the output",
      prompt: "What will print to the monitor when this runs?",
      codeSnippet: `def multiply(a, b):\n    print(a * b)\n\nval = multiply(3, 4)\nprint(val)`,
      options: [
        {
          id: "A",
          code: "12\n12",
          label: "12 and then 12",
          correct: false,
          reason: "print() doesn't pass the value to val.",
        },
        {
          id: "B",
          code: "12\nNone",
          label: "12 and then None",
          correct: true,
          reason: "Correct! The first print outputs 12. Since multiply() has no return, val receives None.",
        },
        {
          id: "C",
          code: "12",
          label: "Only 12",
          correct: false,
          reason: "print(val) still outputs None.",
        },
      ],
    },
    {
      id: "q2",
      type: "What is stored in res?",
      prompt: "What does the variable 'res' hold after this function call?",
      codeSnippet: `def get_discount(price, pct):\n    disc = price * pct\n    return disc\n\nres = get_discount(100, 0.2)`,
      options: [
        {
          id: "A",
          code: "20.0",
          label: "20.0",
          correct: true,
          reason: "Spot on! The return statement sends 20.0 directly into res.",
        },
        {
          id: "B",
          code: "None",
          label: "None",
          correct: false,
          reason: "A return statement was used, so it does not evaluate to None.",
        },
        {
          id: "C",
          code: "100",
          label: "100",
          correct: false,
          reason: "price wasn't returned, disc was.",
        },
      ],
    },
  ];

  const q = questions[currentQIndex];

  const handleSelect = (id: string) => {
    if (submitted) return;
    setSelectedOptionId(id);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setSubmitted(false);
    } else {
      onSuccess();
    }
  };

  const selectedOpt = q.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="max-w-2xl mx-auto space-y-4 py-4 select-text">
      {/* Header with dots progress */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#007ACC] font-mono uppercase font-semibold">
          {q.type}
        </span>
        <div className="flex items-center gap-1.5">
          {questions.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentQIndex
                  ? "bg-[#007ACC]"
                  : i < currentQIndex
                  ? "bg-[#2EA043]"
                  : "bg-[#444444]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Large Type Prompt */}
      <h2 className="text-lg font-medium text-white">{q.prompt}</h2>

      {/* Code Snippet Tile */}
      <pre className="p-3.5 rounded bg-[#141414] border border-[#2B2B2B] font-mono text-[13px] text-[#CE9178] overflow-x-auto">
        {q.codeSnippet}
      </pre>

      {/* 3 to 4 Option Tiles with Code inside */}
      <div className="space-y-2 pt-2">
        {q.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isCorrect = opt.correct;

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={submitted}
              className={`w-full p-3 rounded-[6px] border text-left flex items-center justify-between transition-all cursor-pointer ${
                submitted
                  ? isCorrect
                    ? "bg-[#2EA043]/15 border-[#2EA043] text-white"
                    : isSelected
                    ? "bg-[#F14C4C]/15 border-[#F14C4C] text-[#F87171]"
                    : "bg-[#181818] border-[#2B2B2B] text-[#666666]"
                  : "bg-[#181818] border-[#2B2B2B] hover:border-[#444444] text-[#CCCCCC] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full border border-[#444444] text-xs flex items-center justify-center font-mono">
                  {opt.id}
                </span>
                <span className="font-mono text-sm">{opt.code}</span>
                <span className="text-xs text-[#888888] hidden sm:inline font-sans">
                  ({opt.label})
                </span>
              </div>

              {submitted && (
                <span
                  className={`codicon ${
                    isCorrect
                      ? "codicon-check text-[#2EA043]"
                      : isSelected
                      ? "codicon-close text-[#F14C4C]"
                      : ""
                  } text-sm`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Instant Feedback Reason */}
      {submitted && selectedOpt && (
        <div className="p-3 rounded bg-[#181818] border border-[#333333] flex items-center justify-between animate-in fade-in duration-150">
          <p className="text-xs text-[#DDDDDD]">{selectedOpt.reason}</p>
          <button
            onClick={handleNext}
            className="px-3.5 py-1.5 rounded bg-[#007ACC] hover:bg-[#0098FF] text-white font-medium text-xs shrink-0 ml-4 transition-colors cursor-pointer"
          >
            {currentQIndex < questions.length - 1 ? "Next question →" : "Continue →"}
          </button>
        </div>
      )}
    </div>
  );
};
