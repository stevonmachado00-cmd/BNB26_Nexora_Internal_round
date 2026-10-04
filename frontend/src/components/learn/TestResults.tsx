import React from "react";
import { TestCase } from "../../types";
import { CheckCircle2, XCircle, Terminal } from "lucide-react";

interface TestResultsProps {
  tests: TestCase[];
  testsPassed: number;
  totalTests: number;
  stdout?: string;
  isSuccess: boolean;
  onNextProblem?: () => void;
}

export const TestResults: React.FC<TestResultsProps> = ({
  tests,
  testsPassed,
  totalTests,
  stdout,
  isSuccess,
  onNextProblem,
}) => {
  const [activeTab, setActiveTab] = React.useState<"tests" | "output">("tests");

  return (
    <div className="flex flex-col h-full bg-[#090d13] border-t border-[#212734] text-xs select-none">
      {/* Tabs */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0c1017] border-b border-[#212734]">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <button
            onClick={() => setActiveTab("tests")}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              activeTab === "tests"
                ? "bg-[#161c26] text-[#f0f6fc] border border-[#2d384c]"
                : "text-[#8b949e] hover:text-[#c9d1d9]"
            }`}
          >
            Test Cases ({testsPassed}/{totalTests})
          </button>
          <button
            onClick={() => setActiveTab("output")}
            className={`px-2 py-0.5 rounded font-medium transition-colors flex items-center gap-1 ${
              activeTab === "output"
                ? "bg-[#161c26] text-[#f0f6fc] border border-[#2d384c]"
                : "text-[#8b949e] hover:text-[#c9d1d9]"
            }`}
          >
            <Terminal className="w-3 h-3" />
            Standard Output
          </button>
        </div>

        <div>
          {isSuccess ? (
            <span className="text-[#3fb950] font-mono text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Tests Passed
            </span>
          ) : (
            <span className="text-[#f85149] font-mono text-[11px] font-semibold flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> {testsPassed}/{totalTests} Passed
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex-1 overflow-y-auto custom-scrollbar select-text">
        {isSuccess ? (
          /* Compact Success Panel */
          <div className="p-3.5 rounded bg-[#0c2013] border border-[#1e4a29] text-[#c9d1d9] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#3fb950] font-bold text-xs font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verification Passed</span>
              </div>
              {onNextProblem && (
                <button
                  onClick={onNextProblem}
                  className="px-3 py-1 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-mono font-semibold text-xs transition-colors"
                >
                  Next Problem →
                </button>
              )}
            </div>

            <div className="text-xs text-[#8b949e]">
              Constructs validated:
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[#c9d1d9] font-mono text-[11px]">
                <li>Function signature & parameters</li>
                <li>Arithmetic execution frame</li>
                <li>Explicit caller return value</li>
              </ul>
            </div>

            <div className="p-2 rounded bg-[#090d13] border border-[#1e2533] text-[11px] text-[#8b949e] font-mono">
              <span className="font-semibold text-[#f0f6fc] block mb-0.5">Cognitive Confirmation:</span>
              A function's return value passes evaluated memory back to the caller scope.
            </div>
          </div>
        ) : activeTab === "tests" ? (
          /* Test List */
          <div className="space-y-1.5 font-mono">
            {tests.map((test, idx) => (
              <div
                key={test.id || idx}
                className={`p-2 rounded border text-xs flex flex-col gap-1 ${
                  test.passed
                    ? "bg-[#0c1610] border-[#1e3825] text-[#3fb950]"
                    : "bg-[#180e11] border-[#381a1e] text-[#f85149]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {test.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-[#f85149] shrink-0" />
                    )}
                    <span className="font-semibold text-[#c9d1d9] text-[11px]">
                      Test {idx + 1}: {test.inputDescription}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                      test.passed
                        ? "bg-[#0c2013] text-[#3fb950] border border-[#1e4a29]"
                        : "bg-[#261114] text-[#f85149] border border-[#542227]"
                    }`}
                  >
                    {test.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>

                {!test.passed && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#26171b] mt-0.5">
                    <div>
                      <span className="text-[#8b949e]">Expected: </span>
                      <span className="text-[#3fb950] font-bold">{test.expectedOutput}</span>
                    </div>
                    <div>
                      <span className="text-[#8b949e]">Received: </span>
                      <span className="text-[#f85149] font-bold">
                        {test.actualOutput || "None"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Stdout Tab */
          <div className="p-2.5 rounded bg-[#07090e] border border-[#212734] font-mono text-xs text-[#c9d1d9] whitespace-pre-wrap">
            {stdout ? (
              <div>
                <span className="text-[#6e7681] block mb-1"># Terminal Stdout:</span>
                {stdout}
              </div>
            ) : (
              <span className="text-[#6e7681]">No output written to stdout.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

