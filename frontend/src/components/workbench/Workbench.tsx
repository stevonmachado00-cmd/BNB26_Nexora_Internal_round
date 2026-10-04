import React, { useEffect, useMemo } from "react";
import { LearnerProfile } from "../../types";
import { useWorkbenchMachine } from "./state/workbenchMachine";
import { TitleBar } from "./TitleBar";
import { LessonStrip } from "./LessonStrip";
import { TabsBar } from "./EditorArea/TabsBar";
import { SplitView } from "./EditorArea/SplitView";
import { ConceptDock } from "./ConceptDock";
import { Drawer } from "./Drawer/Drawer";
import { StrengthenBanner } from "./StrengthenBanner";
import { StatusBar } from "./StatusBar";
import { CommandPalette, CommandItem } from "./CommandPalette";

interface WorkbenchProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  learner?: LearnerProfile;
  conceptId?: string;
  onAdvanceLesson?: () => void;
  initialProblem?: import("../../types").Problem;
  onChooseAnotherQuestion?: () => void;
}

export const Workbench: React.FC<WorkbenchProps> = ({
  currentPath,
  onNavigate,
  learner,
  conceptId = "functions",
  onAdvanceLesson,
  initialProblem,
  onChooseAnotherQuestion,
}) => {
  const machine = useWorkbenchMachine({
    conceptId,
    onAdvanceLesson,
    initialProblem,
    onChooseAnotherQuestion,
  });

  const {
    currentProblem,
    code,
    isDirty,
    status,
    runResult,
    runExecution,
    autoCompile,
    setAutoCompile,
    hasRunAtLeastOnce,
    loopNode,
    completedLoopNodes,
    isStripCollapsed,
    setIsStripCollapsed,
    activeDiagnosticIndex,
    setActiveDiagnosticIndex,
    dismissedLines,
    setDismissedLines,
    breakdownMode,
    setBreakdownMode,
    applyTier4Fix,
    concepts,
    isDrawerOpen,
    setIsDrawerOpen,
    activeDrawerTab,
    setActiveDrawerTab,
    gutterSweepActive,
    floatingXpToast,
    showStrengthenBar,
    setShowStrengthenBar,
    handleStartPractice,
    handleCompletePractice,
    handleNextLesson,
    activeEditorTab,
    setActiveEditorTab,
    openTabs,
    setOpenTabs,
    cursorPosition,
    setCursorPosition,
    chatMessages,
    contextChips,
    tutoringTier,
    setTutoringTier,
    isAnsweringChat,
    handleAskAboutLine,
    handleRemoveContextChip,
    handleSendChatMessage,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    handleCodeChange,
    handleResetCode,
    handleGenerateNewQuestion,
  } = machine;

  // Example case chips from runResult or problem
  const testCasesForStrip = useMemo(() => {
    if (runResult && runResult.tests.length > 0) {
      return runResult.tests.map((t) => ({
        input: t.name,
        expected: t.expected,
        passed: t.passed,
      }));
    }
    return currentProblem.examples.map((ex) => ({
      input: ex.input,
      expected: ex.output,
      passed: undefined,
    }));
  }, [runResult, currentProblem]);

  // Command palette items
  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: "run-code",
        title: "Submit Code for Model Diagnosis",
        category: "Model",
        shortcut: "Ctrl+Enter",
        action: () => runExecution(code, true),
      },
      {
        id: "reset-code",
        title: "Reset Starter Code",
        category: "Editor",
        action: handleResetCode,
      },
      {
        id: "generate-question",
        title: "Generate New Verified Question",
        category: "Curriculum",
        shortcut: "F8",
        action: onChooseAnotherQuestion || handleGenerateNewQuestion,
      },
      {
        id: "toggle-breakdown",
        title: "Toggle Line Breakdown Annotations",
        category: "Diagnostics",
        action: () => setBreakdownMode(!breakdownMode),
      },
      {
        id: "toggle-drawer",
        title: "Toggle Drawer (Tests · Doubt Chat · Trace)",
        category: "View",
        shortcut: "Ctrl+J",
        action: () => setIsDrawerOpen((prev) => !prev),
      },
      {
        id: "toggle-strip",
        title: "Toggle Lesson Header Strip",
        category: "View",
        action: () => setIsStripCollapsed((prev) => !prev),
      },
      {
        id: "open-practice",
        title: "Open Transfer Practice Path",
        category: "Practice",
        action: handleStartPractice,
      },
    ],
    [
      code,
      runExecution,
      handleResetCode,
      handleGenerateNewQuestion, onChooseAnotherQuestion,
      breakdownMode,
      setBreakdownMode,
      setIsDrawerOpen,
      setIsStripCollapsed,
      handleStartPractice,
    ]
  );

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K / Ctrl+Shift+P -> Command Palette
      if (
        (e.ctrlKey && e.key === "k") ||
        (e.ctrlKey && e.shiftKey && (e.key === "P" || e.key === "p")) ||
        (e.metaKey && e.key === "k")
      ) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }

      // Ctrl+J -> Toggle Drawer
      if ((e.ctrlKey || e.metaKey) && (e.key === "j" || e.key === "J")) {
        e.preventDefault();
        setIsDrawerOpen((prev) => !prev);
      }

      // F8 -> Next diagnostic / problem
      if (e.key === "F8" && !e.shiftKey) {
        e.preventDefault();
        if (runResult?.diagnoses && runResult.diagnoses.length > 0) {
          setActiveDiagnosticIndex((prev) => (prev + 1) % runResult.diagnoses.length);
        }
      }

      // Shift+F8 -> Prev diagnostic
      if (e.key === "F8" && e.shiftKey) {
        e.preventDefault();
        if (runResult?.diagnoses && runResult.diagnoses.length > 0) {
          setActiveDiagnosticIndex(
            (prev) => (prev - 1 + runResult.diagnoses.length) % runResult.diagnoses.length
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runResult, setActiveDiagnosticIndex, setIsCommandPaletteOpen, setIsDrawerOpen]);

  return (
    <div className="relearn-workbench h-screen w-screen flex flex-col overflow-hidden bg-[#1F1F1F]">
      {/* 1. Title Bar (40px) */}
      <TitleBar
        currentPath={currentPath}
        onNavigate={onNavigate}
        learner={learner}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onGenerateNewQuestion={handleGenerateNewQuestion}
        floatingXpToast={floatingXpToast}
      />

      {/* 2. Lesson Strip (≈112px, collapsible to 44px) */}
      <LessonStrip
        breadcrumb={`Python › ${currentProblem.concept}`}
        difficulty="Easy"
        estTime={currentProblem.estimatedTime || "8 min"}
        questionSentence={currentProblem.description}
        cases={testCasesForStrip}
        requirements={currentProblem.constraints || [
          "Define a function named add(a, b)",
          "Take two numeric arguments",
          "Ensure caller receives returned numeric value",
        ]}
        loopNode={loopNode}
        completedLoopNodes={completedLoopNodes}
        onGenerateQuestion={onChooseAnotherQuestion || handleGenerateNewQuestion}
        isCollapsed={isStripCollapsed}
        onToggleCollapse={() => setIsStripCollapsed(!isStripCollapsed)}
      />

      {/* 3. Hero Monaco Editor Area (fills all remaining height, full width) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {/* Slim tab strip */}
        <TabsBar
          openTabs={openTabs}
          activeTab={activeEditorTab}
          onSelectTab={setActiveEditorTab}
          onCloseTab={(tab) => {
            const nextTabs = openTabs.filter((t) => t !== tab);
            setOpenTabs(nextTabs);
            if (activeEditorTab === tab) {
              setActiveEditorTab(nextTabs[nextTabs.length - 1] || "solution.py");
            }
          }}
          isDirty={isDirty}
        />

        {/* Editor Area Host */}
        <div className="flex-1 min-h-0 relative overflow-hidden">
          <SplitView
            activeTab={activeEditorTab}
            code={code}
            onChangeCode={handleCodeChange}
            onRun={() => runExecution(code, true)}
            onReset={handleResetCode}
            isRunning={status === "running"}
            autoCompile={autoCompile}
            diagnoses={runResult?.diagnoses || []}
            activeDiagnosticIndex={activeDiagnosticIndex}
            setActiveDiagnosticIndex={setActiveDiagnosticIndex}
            dismissedLines={dismissedLines}
            onDismissDiagnostic={(line) =>
              setDismissedLines((prev) => new Set([...prev, line]))
            }
            breakdownMode={breakdownMode}
            onToggleBreakdown={() => setBreakdownMode(!breakdownMode)}
            onApplyFix={applyTier4Fix}
            onAskAboutLine={handleAskAboutLine}
            onCursorChange={setCursorPosition}
            hasRunAtLeastOnce={hasRunAtLeastOnce}
            gutterSweepActive={gutterSweepActive}
            onCompletePractice={handleCompletePractice}
            onNextLesson={handleNextLesson}
          />
        </div>

        {/* Next: Strengthen It Bar (slides up on pass above dock) */}
        {showStrengthenBar && (
          <StrengthenBanner
            conceptName="return vs print"
            onStartPractice={handleStartPractice}
            onDismiss={() => setShowStrengthenBar(false)}
          />
        )}

        {/* 4. Concept Dock (56px, always visible, expandable) */}
        <ConceptDock
          concepts={concepts}
          isDrawerOpen={isDrawerOpen}
          onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
          onPracticeConcept={() => handleStartPractice()}
        />

        {/* 5. Drawer (Tests · Doubt Chat · Trace, collapsed by default, opens upward) */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          activeTab={activeDrawerTab}
          onSelectTab={setActiveDrawerTab}
          runResult={runResult}
          chatMessages={chatMessages}
          contextChips={contextChips}
          tutoringTier={tutoringTier}
          setTutoringTier={setTutoringTier}
          isAnsweringChat={isAnsweringChat}
          onSendMessage={handleSendChatMessage}
          onRemoveChip={handleRemoveContextChip}
          onHighlightLine={(line) => setCursorPosition({ line, col: 1 })}
        />
      </div>

      {/* 6. Status Bar (24px, neutral #181818, 2px top accent line) */}
      <StatusBar
        status={status}
        diagnoses={runResult?.diagnoses || []}
        cursorPos={cursorPosition}
        autoCompile={autoCompile}
        onToggleAutoCompile={() => setAutoCompile(!autoCompile)}
        onOpenDrawer={() => {
          setIsDrawerOpen(true);
          setActiveDrawerTab("tests");
        }}
        onRunExecution={() => runExecution(code, true)}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commands}
      />
    </div>
  );
};
