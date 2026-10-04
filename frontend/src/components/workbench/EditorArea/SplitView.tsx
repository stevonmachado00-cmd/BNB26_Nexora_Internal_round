import React from "react";
import { CodeEditor } from "./CodeEditor";
import { LineDiagnosis } from "../data/mockDiagnoses";
import { EditorTabId } from "../state/workbenchMachine";
import { PracticePath } from "../Practice/PracticePath";

interface EditorAreaHostProps {
  activeTab: EditorTabId;
  code: string;
  onChangeCode: (code: string) => void;
  onRun: () => void;
  onReset: () => void;
  isRunning: boolean;
  autoCompile: boolean;
  diagnoses: LineDiagnosis[];
  activeDiagnosticIndex: number;
  setActiveDiagnosticIndex: (idx: number) => void;
  dismissedLines: Set<number>;
  onDismissDiagnostic: (line: number) => void;
  breakdownMode: boolean;
  onToggleBreakdown: () => void;
  onApplyFix: (fixedCode: string) => void;
  onAskAboutLine: (line: number) => void;
  onCursorChange?: (pos: { line: number; col: number }) => void;
  hasRunAtLeastOnce: boolean;
  gutterSweepActive?: boolean;
  // Practice callbacks
  onCompletePractice: () => void;
  onNextLesson: () => void;
}

export const SplitView: React.FC<EditorAreaHostProps> = ({
  activeTab,
  code,
  onChangeCode,
  onRun,
  onReset,
  isRunning,
  autoCompile,
  diagnoses,
  activeDiagnosticIndex,
  setActiveDiagnosticIndex,
  dismissedLines,
  onDismissDiagnostic,
  breakdownMode,
  onToggleBreakdown,
  onApplyFix,
  onAskAboutLine,
  onCursorChange,
  hasRunAtLeastOnce,
  gutterSweepActive,
  onCompletePractice,
  onNextLesson,
}) => {
  // If activeTab is reassessment / Practice, render full-height PracticePath
  if (activeTab === "reassessment") {
    return (
      <PracticePath
        conceptName="return vs print"
        onComplete={onCompletePractice}
        onNextLesson={onNextLesson}
      />
    );
  }

  // Full width hero editor
  return (
    <div className="h-full w-full overflow-hidden">
      <CodeEditor
        code={code}
        onChange={onChangeCode}
        onRun={onRun}
        onReset={onReset}
        isRunning={isRunning}
        autoCompile={autoCompile}
        diagnoses={diagnoses}
        activeDiagnosticIndex={activeDiagnosticIndex}
        setActiveDiagnosticIndex={setActiveDiagnosticIndex}
        dismissedLines={dismissedLines}
        onDismissDiagnostic={onDismissDiagnostic}
        breakdownMode={breakdownMode}
        onToggleBreakdown={onToggleBreakdown}
        onApplyFix={onApplyFix}
        onAskAboutLine={onAskAboutLine}
        onCursorChange={onCursorChange}
        hasRunAtLeastOnce={hasRunAtLeastOnce}
        gutterSweepActive={gutterSweepActive}
      />
    </div>
  );
};
