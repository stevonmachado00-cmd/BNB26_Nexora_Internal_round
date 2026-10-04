import React, { useState } from "react";
import { Problem, Diagnosis, ExecutionResult } from "../types";
import { executionService } from "../services/executionService";
import { diagnosisService } from "../services/diagnosisService";
import { DEMO_PROBLEM_1, MOCK_TRACE_STEPS } from "../data/mockData";
import { ProblemHeader } from "../components/learn/ProblemHeader";
import { ProblemStatement } from "../components/learn/ProblemStatement";
import { CodeEditorWrapper } from "../components/learn/CodeEditorWrapper";
import { TestResults } from "../components/learn/TestResults";
import { DiagnosisCard } from "../components/learn/DiagnosisCard";
import { ProbeQuestionModal } from "../components/learn/ProbeQuestionModal";
import { ExecutionTraceViewer } from "../components/learn/ExecutionTraceViewer";
import { ChatPanel } from "../components/learn/ChatPanel";
import {
  Terminal,
  Bot,
  BrainCircuit,
} from "lucide-react";

interface LearnPageProps {
  onStartReassessment: (misconceptionId: string) => void;
  onNavigateNextProblem?: () => void;
  initialOpenTrace?: boolean;
  initialOpenProbe?: boolean;
}

export const LearnPage: React.FC<LearnPageProps> = ({
  onStartReassessment,
  onNavigateNextProblem,
  initialOpenTrace = false,
  initialOpenProbe = false,
}) => {
  const [problem] = useState<Problem>(DEMO_PROBLEM_1);
  const [code, setCode] = useState<string>(DEMO_PROBLEM_1.demoCode || "");
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  // Modals & Panels
  const [isProbeOpen, setIsProbeOpen] = useState(initialOpenProbe);
  const [isTraceOpen, setIsTraceOpen] = useState(initialOpenTrace);
  const [hasAnsweredProbe, setHasAnsweredProbe] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<"diagnosis" | "chat">("diagnosis");

  // Execute Code
  const handleRunCode = async () => {
    setIsRunning(true);
    setExecutionResult(null);
    setDiagnosis(null);
    setHighlightedLines([]);

    try {
      const result = await executionService.runCode(code, problem);
      setExecutionResult(result);

      if (!result.success) {
        const diag = await diagnosisService.diagnoseCode(code, problem, result);
        setDiagnosis(diag);
        setHighlightedLines(diag.affectedLines);
        setActiveRightTab("diagnosis");
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    setCode(problem.starterCode);
    setExecutionResult(null);
    setDiagnosis(null);
    setHighlightedLines([]);
    setHasAnsweredProbe(false);
  };

  const handleLoadDemoCode = () => {
    setCode(problem.demoCode || "");
  };

  const handleProbeAnswerSelected = (selectedOptionId: string) => {
    if (!diagnosis) return;
    const refined = diagnosisService.refineDiagnosisWithProbe(diagnosis, selectedOptionId);
    setDiagnosis(refined.updatedDiagnosis);
    setHasAnsweredProbe(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2.75rem)] bg-[#090d13] overflow-hidden select-none">
      {/* Problem Top Header */}
      <ProblemHeader problem={problem} problemIndex={12} totalProblems={40} />

      {/* Main Workspace: 3 Columns on large screens */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Problem Statement (4 cols) */}
        <div className="lg:col-span-4 border-r border-[#212734] bg-[#0c1017] flex flex-col h-full overflow-hidden">
          <ProblemStatement problem={problem} />
        </div>

        {/* Center Column: Monaco Editor + Test Output (4 cols) */}
        <div className="lg:col-span-4 flex flex-col h-full border-r border-[#212734] overflow-hidden bg-[#090d13]">
          {/* Editor Container (Top half) */}
          <div className="flex-1 min-h-[280px] overflow-hidden">
            <CodeEditorWrapper
              code={code}
              onChange={setCode}
              onRun={handleRunCode}
              onReset={handleResetCode}
              onLoadDemoCode={handleLoadDemoCode}
              isRunning={isRunning}
              highlightedLines={highlightedLines}
            />
          </div>

          {/* Test Results / Execution Panel (Bottom half) */}
          <div className="h-52 shrink-0 overflow-hidden">
            <TestResults
              tests={executionResult?.tests || problem.tests}
              testsPassed={executionResult?.testsPassed || 0}
              totalTests={problem.tests.length}
              stdout={executionResult?.stdout}
              isSuccess={Boolean(executionResult?.success)}
              onNextProblem={onNavigateNextProblem}
            />
          </div>
        </div>

        {/* Right Column: AI Insights & Doubt Chat (4 cols) */}
        <div className="lg:col-span-4 bg-[#0c1017] flex flex-col h-full overflow-hidden">
          {/* Tab Switcher */}
          <div className="px-3 py-1.5 bg-[#0c1017] border-b border-[#212734] flex items-center justify-between">
            <div className="flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => setActiveRightTab("diagnosis")}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeRightTab === "diagnosis"
                    ? "bg-[#161c26] text-[#f0f6fc] border border-[#2d384c] font-semibold"
                    : "text-[#8b949e] hover:text-[#f0f6fc]"
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5 text-[#58a6ff]" />
                <span>Diagnostic Report</span>
                {diagnosis && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d29922]" />
                )}
              </button>

              <button
                onClick={() => setActiveRightTab("chat")}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeRightTab === "chat"
                    ? "bg-[#161c26] text-[#f0f6fc] border border-[#2d384c] font-semibold"
                    : "text-[#8b949e] hover:text-[#f0f6fc]"
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-[#8b949e]" />
                <span>Ask Re:Learn</span>
              </button>
            </div>

            <div className="text-[10px] text-[#6e7681] font-mono hidden sm:inline">
              Cognitive Engine
            </div>
          </div>

          {/* Right Panel Content */}
          <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
            {activeRightTab === "diagnosis" ? (
              diagnosis ? (
                <DiagnosisCard
                  diagnosis={diagnosis}
                  onOpenProbe={() => setIsProbeOpen(true)}
                  onOpenTrace={() => setIsTraceOpen(true)}
                  onScrollToChat={() => setActiveRightTab("chat")}
                  onStartReassessment={() =>
                    onStartReassessment(diagnosis.primaryMisconceptionId)
                  }
                  hasAnsweredProbe={hasAnsweredProbe}
                />
              ) : isRunning ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2.5">
                  <div className="w-6 h-6 border-2 border-[#58a6ff] border-t-transparent rounded-full animate-spin" />
                  <div className="text-xs text-[#f0f6fc] font-mono font-semibold">
                    Evaluating AST execution frames...
                  </div>
                  <p className="text-[11px] text-[#6e7681] max-w-xs leading-relaxed font-mono">
                    Matching test trace against candidate misconception hypotheses.
                  </p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#6e7681] space-y-2">
                  <div className="w-9 h-9 rounded bg-[#12161f] border border-[#212734] flex items-center justify-center text-[#8b949e]">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div className="font-semibold text-[#c9d1d9] text-xs font-mono">
                    Awaiting Code Execution
                  </div>
                  <p className="text-[11px] text-[#8b949e] max-w-xs leading-relaxed">
                    Click <strong>Run Code</strong> or press <code className="bg-[#141922] px-1 py-0.2 rounded text-[#c9d1d9] font-mono">Ctrl+Enter</code>. Re:Learn evaluates syntax, slips, and underlying misconceptions.
                  </p>
                </div>
              )
            ) : (
              <ChatPanel onShowTraceModal={() => setIsTraceOpen(true)} />
            )}
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      {diagnosis?.probe && (
        <ProbeQuestionModal
          isOpen={isProbeOpen}
          onClose={() => setIsProbeOpen(false)}
          probe={diagnosis.probe}
          onAnswerSelected={handleProbeAnswerSelected}
        />
      )}

      <ExecutionTraceViewer
        isOpen={isTraceOpen}
        onClose={() => setIsTraceOpen(false)}
        traceSteps={diagnosis?.executionTrace || MOCK_TRACE_STEPS}
      />
    </div>
  );
};
