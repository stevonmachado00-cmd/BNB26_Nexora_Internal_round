import React, { useState } from "react";
import { TeachingStyle } from "../types";
import { learnerService } from "../services/learnerService";
import { TeachingStyleSelector } from "../components/reassessment/TeachingStyleSelector";
import { PredictAndExplain } from "../components/reassessment/PredictAndExplain";
import { DelayedRecheckModal } from "../components/reassessment/DelayedRecheckModal";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Play,
  Layers,
} from "lucide-react";

interface ReassessmentPageProps {
  misconceptionId?: string;
  onComplete: () => void;
  initialView?: "transfer" | "style" | "predict";
}

export const ReassessmentPage: React.FC<ReassessmentPageProps> = ({
  misconceptionId = "return-vs-print",
  onComplete,
  initialView = "transfer",
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(
    initialView === "style" ? 1 : initialView === "predict" ? 2 : 0
  );
  const [selectedStyle, setSelectedStyle] = useState<TeachingStyle>("contrast-examples");
  const [transfer1Code, setTransfer1Code] = useState(
    "def calculate_tax(subtotal, rate):\n    # Returning price + tax\n    return subtotal + (subtotal * rate)"
  );
  const [transfer1Result, setTransfer1Result] = useState<"idle" | "passed" | "failed">("idle");
  const [isDelayedModalOpen, setIsDelayedModalOpen] = useState(false);
  const [isProvisionalMastery, setIsProvisionalMastery] = useState(false);

  const handleRunTransfer1 = () => {
    if (transfer1Code.includes("return")) {
      setTransfer1Result("passed");
    } else {
      setTransfer1Result("failed");
    }
  };

  const handleTeachingStyleSelected = (style: TeachingStyle) => {
    setSelectedStyle(style);
    learnerService.setPreferredTeachingStyle(style);
  };

  const handlePredictPassed = () => {
    setIsProvisionalMastery(true);
  };

  const handleDelayedSuccess = () => {
    learnerService.resolveMisconception(misconceptionId);
    onComplete();
  };

  return (
    <div className="p-5 max-w-4xl mx-auto space-y-5 text-[#c9d1d9] select-none">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="font-semibold px-2 py-0.5 rounded bg-[#141922] text-[#c9d1d9] border border-[#262e3d]">
            Reassessment Phase {currentStepIndex + 1} / 3
          </span>
          <span className="text-[#8b949e]">Target: Return vs Print</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#f0f6fc] font-mono tracking-tight">
          Concept Transfer Verification
        </h1>
        <p className="text-xs text-[#8b949e]">
          Solving the original problem is not enough. Re:Learn checks if the mental model generalizes into fresh problems.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-1.5 border-b border-[#212734] pb-2.5 text-xs font-mono">
        <button
          onClick={() => setCurrentStepIndex(0)}
          className={`px-3 py-1 rounded transition-colors ${
            currentStepIndex === 0
              ? "bg-[#18202d] text-[#f0f6fc] border border-[#2d384c] font-semibold"
              : "text-[#8b949e] hover:text-[#f0f6fc] bg-[#0e1218] border border-transparent"
          }`}
        >
          1. Transfer: Tax Calculation
        </button>
        <button
          onClick={() => setCurrentStepIndex(1)}
          className={`px-3 py-1 rounded transition-colors ${
            currentStepIndex === 1
              ? "bg-[#18202d] text-[#f0f6fc] border border-[#2d384c] font-semibold"
              : "text-[#8b949e] hover:text-[#f0f6fc] bg-[#0e1218] border border-transparent"
          }`}
        >
          2. Teaching Representation Switch
        </button>
        <button
          onClick={() => setCurrentStepIndex(2)}
          className={`px-3 py-1 rounded transition-colors ${
            currentStepIndex === 2
              ? "bg-[#18202d] text-[#f0f6fc] border border-[#2d384c] font-semibold"
              : "text-[#8b949e] hover:text-[#f0f6fc] bg-[#0e1218] border border-transparent"
          }`}
        >
          3. Predict & Explain
        </button>
      </div>

      {/* STEP 1: TRANSFER PROBLEM 1 */}
      {currentStepIndex === 0 && (
        <div className="space-y-3.5">
          <div className="p-4 rounded bg-[#0e1218] border border-[#212734] space-y-3">
            <div className="flex items-center justify-between font-mono">
              <h3 className="font-bold text-sm text-[#f0f6fc]">
                Transfer Problem 1: Calculate Sales Tax
              </h3>
              <span className="text-[10px] text-[#8b949e]">
                Surface context: Finance
              </span>
            </div>

            <p className="text-xs text-[#8b949e] leading-relaxed">
              Write a function <code>calculate_tax(subtotal, rate)</code> that returns the total
              final price after adding tax (<code>subtotal + subtotal * rate</code>). The returned value must be stored in caller memory for further operations.
            </p>

            {/* Code Box */}
            <div className="space-y-1 font-mono text-xs">
              <div className="text-[10px] text-[#8b949e] uppercase">Your Transfer Solution:</div>
              <textarea
                rows={4}
                value={transfer1Code}
                onChange={(e) => setTransfer1Code(e.target.value)}
                className="w-full p-3 rounded bg-[#090d13] border border-[#212734] font-mono text-xs text-[#58a6ff] focus:outline-none focus:border-[#388bfd]"
              />
            </div>

            <div className="flex items-center justify-between pt-1 font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunTransfer1}
                  className="px-3.5 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-xs flex items-center gap-1.5 border border-[#2ea043] transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Transfer Tests</span>
                </button>
              </div>

              {transfer1Result === "passed" && (
                <div className="flex items-center gap-1.5 text-[#3fb950] font-semibold text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Transfer problem verified</span>
                </div>
              )}
            </div>

            {transfer1Result === "passed" && (
              <div className="p-3 rounded bg-[#0c2013] border border-[#1e4a29] text-xs text-[#c9d1d9] space-y-2">
                <div className="font-bold text-[#3fb950] flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Transfer Passed</span>
                </div>
                <p className="text-xs text-[#8b949e]">
                  You applied the return value concept in a brand new problem context.
                  Now let's examine what happens when representation is switched.
                </p>
                <div className="flex justify-end pt-1 font-mono">
                  <button
                    onClick={() => setCurrentStepIndex(1)}
                    className="px-3.5 py-1.5 rounded bg-[#1e2736] hover:bg-[#273347] text-[#f0f6fc] font-semibold text-xs border border-[#37465f] flex items-center gap-1"
                  >
                    <span>Proceed to Representation Switch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: TEACHING STYLE SWITCH */}
      {currentStepIndex === 1 && (
        <div className="space-y-3.5">
          {/* Simulated Transfer Residue Alert */}
          <div className="p-3 rounded bg-[#1f1608] border border-[#4d360f] text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#d29922] font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Transfer Challenge 2 Exposed Misconception Residue</span>
            </div>
            <p className="text-[#8b949e] leading-relaxed">
              "You solved the previous challenge correctly, but this new problem structure revealed partial misconception residue.
              Let's switch the explanatory representation to lock in the mental model."
            </p>
          </div>

          {/* Teaching Style Selector Component */}
          <TeachingStyleSelector
            selectedStyle={selectedStyle}
            onSelectStyle={handleTeachingStyleSelected}
            preferredStyle="Contrast examples"
          />

          <div className="flex justify-end pt-1 font-mono">
            <button
              onClick={() => setCurrentStepIndex(2)}
              className="px-4 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs border border-[#2ea043] flex items-center gap-1.5 transition-colors"
            >
              <span>Test Knowledge with Predict & Explain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PREDICT AND EXPLAIN & PROVISIONAL MASTERY */}
      {currentStepIndex === 2 && (
        <div className="space-y-4">
          <PredictAndExplain onPassed={handlePredictPassed} />

          {/* Provisional Mastery Banner */}
          {isProvisionalMastery && (
            <div className="p-4 rounded bg-[#0c2013] border border-[#1e4a29] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#3fb950] font-bold text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Provisional Concept Mastery Achieved</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0e1b2e] text-[#58a6ff] border border-[#1f3b60] font-mono">
                  Generalization Confirmed
                </span>
              </div>

              <p className="text-xs text-[#8b949e] leading-relaxed">
                In a live session, spaced delayed re-checks occur automatically over intervals. For this interactive demo, you can trigger the delayed re-check now to graduate this misconception.
              </p>

              <div className="flex justify-end pt-1 font-mono">
                <button
                  onClick={() => setIsDelayedModalOpen(true)}
                  className="px-4 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs border border-[#2ea043] flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Trigger Delayed Re-Check</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delayed Memory Re-Check Modal */}
      <DelayedRecheckModal
        isOpen={isDelayedModalOpen}
        onClose={() => setIsDelayedModalOpen(false)}
        onSuccess={handleDelayedSuccess}
        misconceptionName="Return vs Print"
      />
    </div>
  );
};
