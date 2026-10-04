import React from "react";
import { Modal } from "../common/Modal";
import { CheckCircle2, AlertTriangle, Cpu } from "lucide-react";
import { Badge } from "../common/Badge";

interface LearnerComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LearnerComparisonModal: React.FC<LearnerComparisonModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cognitive Discrimination: Look-Alike Mistake Analysis"
      subtitle="Comparing how AST diagnostics & probes classify true conceptual faults vs careless slips."
      maxWidth="3xl"
    >
      <div className="space-y-4 text-xs text-[#c9d1d9]">
        <div className="p-3 rounded bg-[#12161f] border border-[#212734] flex items-start gap-2.5">
          <Cpu className="w-4 h-4 text-[#58a6ff] shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[#8b949e]">
            Two learners can submit code that fails identical test cases with output <code className="text-[#f0f6fc] font-mono bg-[#161b24] px-1 py-0.5 rounded border border-[#262e3d]">None</code>. Traditional platforms mark both as generic "Wrong Answer". Re:Learn evaluates whether the mental model itself is broken.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Learner A Card */}
          <div className="p-4 rounded bg-[#0e1218] border border-[#523f14] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#f0f6fc] font-mono text-xs">Learner A</span>
              <Badge type="conceptual" label="Conceptual Misconception" />
            </div>

            <div>
              <div className="text-[10px] text-[#8b949e] font-mono mb-1">Submitted Code:</div>
              <pre className="p-2.5 rounded bg-[#090d13] border border-[#212734] font-mono text-[11px] text-[#d29922]">
{`def add(a, b):
    print(a + b) # Believes print() returns 8`}
              </pre>
            </div>

            <div className="p-2.5 rounded bg-[#12161f] border border-[#212734] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] block">
                Probe Result (x = print(5)):
              </span>
              <div className="text-[11px] text-[#f85149] font-mono">
                Selected: "5" (believed print yields value)
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#231b09] border border-[#523f14] space-y-1">
              <div className="font-semibold text-[#d29922] flex items-center gap-1.5 text-xs font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                Root Diagnosis: Return vs Print
              </div>
              <p className="text-[11px] text-[#c9d1d9] leading-relaxed">
                True conceptual fault. Learner routed into transfer reassessment & contrast examples.
              </p>
            </div>
          </div>

          {/* Learner B Card */}
          <div className="p-4 rounded bg-[#0e1218] border border-[#1f3b60] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#f0f6fc] font-mono text-xs">Learner B</span>
              <Badge type="careless-slip" label="Careless Slip" />
            </div>

            <div>
              <div className="text-[10px] text-[#8b949e] font-mono mb-1">Submitted Code:</div>
              <pre className="p-2.5 rounded bg-[#090d13] border border-[#212734] font-mono text-[11px] text-[#58a6ff]">
{`def add(a, b):
    total = a + b # Computed, but forgot 'return'`}
              </pre>
            </div>

            <div className="p-2.5 rounded bg-[#12161f] border border-[#212734] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] block">
                Probe Result (x = print(5)):
              </span>
              <div className="text-[11px] text-[#3fb950] font-mono">
                Selected: "None" (knows print yields None)
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#0e1b2e] border border-[#1f3b60] space-y-1">
              <div className="font-semibold text-[#58a6ff] flex items-center gap-1.5 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Root Diagnosis: Careless Return Omission
              </div>
              <p className="text-[11px] text-[#c9d1d9] leading-relaxed">
                Mental model is intact. Learner is gently reminded with a quick hint rather than repetitive reteaching.
              </p>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded bg-[#090d13] border border-[#212734] text-[10px] text-[#8b949e] font-mono text-center">
          Adaptive cognitive models prevent student frustration and false-positive reteaching.
        </div>
      </div>
    </Modal>
  );
};

