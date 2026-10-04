import React, { useState } from "react";
import { reassessmentService } from "../../services/reassessmentService";
import { CheckCircle2, AlertTriangle, Brain } from "lucide-react";

interface PredictAndExplainProps {
  onPassed: () => void;
}

export const PredictAndExplain: React.FC<PredictAndExplainProps> = ({ onPassed }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [explanation, setExplanation] = useState("");
  const [result, setResult] = useState<{
    predictionCorrect: boolean;
    explanationQuality: "sound" | "guessing" | "misconception";
    feedback: string;
  } | null>(null);

  const codeSnippet = `def double(n):
    return n * 2

def show_double(n):
    print(n * 2)

a = double(4)
b = show_double(4)
print(a, b)`;

  const options = [
    "8 8",
    "8 None",
    "None 8",
    "8 followed by an Error",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption === null) return;

    const evaluation = reassessmentService.evaluatePredictAndExplain(
      selectedOption,
      1, // correct index is 1 ("8 None")
      explanation
    );
    setResult(evaluation);

    if (evaluation.predictionCorrect && evaluation.explanationQuality === "sound") {
      setTimeout(() => {
        onPassed();
      }, 1500);
    }
  };

  return (
    <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-3.5 text-xs text-[#c9d1d9] select-none">
      <div className="flex items-center justify-between border-b border-[#212734] pb-2.5">
        <div>
          <h4 className="text-xs font-bold text-[#f0f6fc] font-mono flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-[#58a6ff]" />
            Predict & Explain Cognitive Check
          </h4>
          <p className="text-[#8b949e] text-[11px] mt-0.5">
            Demonstrate your mental model by predicting the runtime outcome and explaining why.
          </p>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#141922] border border-[#262e3d] text-[#8b949e] font-mono text-[10px]">
          Concept Transfer
        </span>
      </div>

      {/* Code to predict */}
      <div className="p-3 rounded bg-[#090d13] border border-[#212734] font-mono text-xs text-[#58a6ff] whitespace-pre-wrap select-text">
        {codeSnippet}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Prediction Question */}
        <div className="space-y-1.5">
          <span className="font-semibold text-[#f0f6fc] text-xs block font-mono">
            What will be printed by the final line: print(a, b)?
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`p-2.5 rounded border text-left font-mono text-xs transition-colors flex items-center gap-2 ${
                    isSelected
                      ? "bg-[#161d28] border-[#388bfd] text-[#f0f6fc]"
                      : "bg-[#090d13] border-[#212734] hover:border-[#303848] text-[#c9d1d9]"
                  }`}
                >
                  <span className="w-5 h-5 rounded bg-[#161b24] border border-[#262e3d] flex items-center justify-center font-bold text-[10px] text-[#8b949e]">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explain Your Answer In One Sentence */}
        <div className="space-y-1">
          <label className="font-semibold text-[#f0f6fc] text-xs block font-mono">
            Explain your reasoning in one sentence:
          </label>
          <input
            type="text"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="e.g. double returns 8 to variable a, whereas show_double prints and returns None to b"
            className="w-full bg-[#090d13] border border-[#212734] rounded px-3 py-2 text-xs text-[#c9d1d9] placeholder:text-[#6e7681] focus:outline-none focus:border-[#388bfd] font-sans"
          />
        </div>

        {/* Evaluation Output */}
        {result && (
          <div
            className={`p-3 rounded border space-y-1 ${
              result.predictionCorrect && result.explanationQuality === "sound"
                ? "bg-[#0c2013] border-[#1e4a29] text-[#3fb950]"
                : result.predictionCorrect && result.explanationQuality === "guessing"
                ? "bg-[#231b09] border-[#523f14] text-[#d29922]"
                : "bg-[#261114] border-[#542227] text-[#f85149]"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold font-mono text-xs">
              {result.predictionCorrect && result.explanationQuality === "sound" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#3fb950]" />
                  <span>Mental Model Confirmed Sound</span>
                </>
              ) : result.explanationQuality === "guessing" ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-[#d29922]" />
                  <span>Prediction Correct, but Rationale Incomplete</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-[#f85149]" />
                  <span>Misconception Exposed</span>
                </>
              )}
            </div>
            <p className="text-xs text-[#c9d1d9] leading-relaxed">{result.feedback}</p>
          </div>
        )}

        <div className="flex justify-end font-mono">
          <button
            type="submit"
            disabled={selectedOption === null || !explanation.trim()}
            className="px-3.5 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs text-white border border-[#2ea043] transition-colors"
          >
            Submit Prediction & Explanation
          </button>
        </div>
      </form>
    </div>
  );
};
