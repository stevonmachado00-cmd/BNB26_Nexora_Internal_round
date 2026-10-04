import { useState, useEffect, useCallback } from "react";
import { Problem } from "../../../types";
import { DEMO_PROBLEM_1 } from "../../../data/mockData";
import { sendCodeToModel } from "../../../services/relearnApi";
import { chatService } from "../../../services/chatService";
import { LineDiagnosis, RunResult, ConceptItem } from "../data/mockDiagnoses";
import { LoopNodeId } from "../LoopTrack";
import { DrawerTabId } from "../Drawer/Drawer";

export type WorkbenchStatus = "idle" | "editing" | "running" | "failed" | "passed" | "reassessing";
export type EditorTabId = "solution.py" | "reassessment";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  codeSnippet?: string;
  tier?: number;
  timestamp: string;
}

export interface UseWorkbenchOptions {
  conceptId?: string;
  initialProblem?: Problem;
  onAdvanceLesson?: () => void;
  onChooseAnotherQuestion?: () => void;
}

export function useWorkbenchMachine(options: UseWorkbenchOptions = {}) {
  const { onAdvanceLesson, onChooseAnotherQuestion } = options;

  // Problem and editor code
  const [currentProblem, setCurrentProblem] = useState<Problem>(
    options.initialProblem || DEMO_PROBLEM_1
  );
  const [code, setCode] = useState<string>(options.initialProblem?.starterCode || "");
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // State machine status & run tracking
  const [status, setStatus] = useState<WorkbenchStatus>("idle");
  const [hasRunAtLeastOnce, setHasRunAtLeastOnce] = useState<boolean>(false);

  // Tabs & Views
  const [activeEditorTab, setActiveEditorTab] = useState<EditorTabId>("solution.py");
  const [openTabs, setOpenTabs] = useState<EditorTabId[]>(["solution.py"]);

  // Drawer (Tests, Doubt Chat, Trace) - collapsed by default!
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState<DrawerTabId>("tests");
  const [drawerDismissCount, setDrawerDismissCount] = useState<number>(0);

  // Lesson Strip
  const [isStripCollapsed, setIsStripCollapsed] = useState<boolean>(false);

  // Learning Loop Track
  const [loopNode, setLoopNode] = useState<LoopNodeId>("diagnose");
  const [completedLoopNodes, setCompletedLoopNodes] = useState<LoopNodeId[]>(["attempt"]);

  // Concepts Dock
  const [concepts, setConcepts] = useState<ConceptItem[]>([]);

  // Diagnostics & Breakdown
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [activeDiagnosticIndex, setActiveDiagnosticIndex] = useState<number>(0);
  const [dismissedLines, setDismissedLines] = useState<Set<number>>(new Set());
  const [breakdownMode, setBreakdownMode] = useState<boolean>(false);
  const [autoCompile, setAutoCompile] = useState<boolean>(false);

  // Success Moment & Strengthen Bar
  const [gutterSweepActive, setGutterSweepActive] = useState<boolean>(false);
  const [floatingXpToast, setFloatingXpToast] = useState<boolean>(false);
  const [showStrengthenBar, setShowStrengthenBar] = useState<boolean>(false);

  // Doubt Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "initial-assistant",
      role: "assistant",
      text: "Submit your code when you are ready. Re:Learn will send it to the model for a misconception diagnosis.",
      tier: 1,
      timestamp: "Just now",
    },
  ]);
  const [contextChips, setContextChips] = useState<string[]>([]);
  const [tutoringTier, setTutoringTier] = useState<number>(1);
  const [isAnsweringChat, setIsAnsweringChat] = useState<boolean>(false);

  // Command Palette
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Cursor position
  const [cursorPosition, setCursorPosition] = useState<{ line: number; col: number }>({
    line: 2,
    col: 5,
  });

  // Send the learner's exact code to the backend model. Execution is deliberately
  // disabled here, so no made-up output, test result, or trace is ever displayed.
  const runExecution = useCallback(async (codeToRun: string, manual = true) => {
    setStatus("running");
    setHasRunAtLeastOnce(true);
    if (!isStripCollapsed) setIsStripCollapsed(true);
    try {
      const attempt = await sendCodeToModel(currentProblem.id, codeToRun);
      const diagnosis = attempt.diagnosis;
      if (!diagnosis) {
        setRunResult({ scenarioId: "logic", name: "Awaiting model", code: codeToRun, tests: [], diagnoses: [], stdout: "" });
        setStatus("editing");
        setChatMessages((previous) => [...previous, { id: `model-offline-${Date.now()}`, role: "assistant", timestamp: "Just now", tier: 1, text: "Your code was recorded, but the model is offline. Load Gemma in LM Studio and submit again for a diagnosis." }]);
        return;
      }

      if (diagnosis.diagnosis === "correct_understanding") {
        setRunResult({ scenarioId: "passed", name: "Model: understanding demonstrated", code: codeToRun, tests: [], diagnoses: [], stdout: "" });
        setStatus("passed");
        setLoopNode("transfer");
        setCompletedLoopNodes(["attempt", "diagnose", "fix"]);
        setShowStrengthenBar(true);
        return;
      }

      const diagnosisData: LineDiagnosis = {
        line: 1, startCol: 1, endCol: Math.max(2, codeToRun.split("\n")[0]?.length || 2), status: "warning",
        annotation: `← ${diagnosis.diagnosis.replaceAll("_", " ")}`,
        errorType: "conceptual", headline: diagnosis.misconception, caption: diagnosis.evidence,
        hints: [diagnosis.explanation, "Revise the idea, then submit a fresh attempt.", "Use the explanation as a guide rather than copying an answer.", { diff: "Model-guided revision", fixedCode: codeToRun }],
        whyDeep: { misconception: diagnosis.misconception, contrastExample: diagnosis.explanation },
      };
      setRunResult({ scenarioId: "logic", name: "Model diagnosis", code: codeToRun, tests: [], diagnoses: [diagnosisData], stdout: "" });
      setStatus("failed");
      setActiveDiagnosticIndex(0);
      setDismissedLines(new Set());
      setShowStrengthenBar(false);
      setLoopNode("diagnose");
      setCompletedLoopNodes(["attempt"]);
      setChatMessages((previous) => [...previous, { id: `model-${Date.now()}`, role: "assistant", timestamp: "Just now", tier: 1, text: diagnosis.explanation }]);
    } catch (err: any) {
      setRunResult({ scenarioId: "logic", name: "Model unavailable", code: codeToRun, tests: [], diagnoses: [], stdout: "", stderr: err.message });
      setStatus("failed");
      setChatMessages((previous) => [...previous, { id: `model-error-${Date.now()}`, role: "assistant", timestamp: "Just now", tier: 1, text: "I could not reach the Re:Learn model. Start the backend and load Gemma in LM Studio, then submit again." }]);
    }
  }, [currentProblem.id, isStripCollapsed]);

  // Code is only sent when the learner explicitly clicks Run.
  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      setIsDirty(true);
      setStatus("editing");

    },
    []
  );

  // Reset to starter code
  const handleResetCode = useCallback(() => {
    const starter = currentProblem.starterCode || "# Write your solution here\n";
    setCode(starter);
    setIsDirty(false);
    setStatus("idle");
    setRunResult(null);
    setShowStrengthenBar(false);
  }, [currentProblem]);

  // Generate new question
  const handleGenerateNewQuestion = useCallback(() => {
    onChooseAnotherQuestion?.();
  }, [onChooseAnotherQuestion]);

  // Apply Tier 4 fix
  const applyTier4Fix = useCallback(
    (fixedCode: string) => {
      setCode(fixedCode);
      setLoopNode("fix");
      runExecution(fixedCode, true);
    },
    [runExecution]
  );

  // Add context chip & focus doubt chat
  const handleAskAboutLine = useCallback((lineNum: number) => {
    const chip = `solution.py:${lineNum}`;
    setContextChips((prev) => (prev.includes(chip) ? prev : [...prev, chip]));
    setActiveDrawerTab("doubt-chat");
    setIsDrawerOpen(true);
  }, []);

  const handleRemoveContextChip = useCallback((chipToRemove: string) => {
    setContextChips((prev) => prev.filter((c) => c !== chipToRemove));
  }, []);

  // Send Doubt Chat message
  const handleSendChatMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isAnsweringChat) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text,
        timestamp: "Just now",
      };

      setChatMessages((prev) => [...prev, userMsg]);
      setIsAnsweringChat(true);

      try {
        const lower = text.toLowerCase();
        let replyText = "";
        let tierUsed = tutoringTier;

        if (lower.includes("give me the answer") || lower.includes("write the code")) {
          replyText =
            "I want to help you grasp this! Consider this: print() sends characters to screen, while return passes data to caller variables.";
        } else if (lower.includes("why does print") || lower.includes("none")) {
          replyText =
            "print() is an I/O procedure that writes text to stdout. Its formal return value in Python is None. To give values back to caller expressions, write return a + b.";
        } else if (lower.includes("example")) {
          replyText =
            "Here is a contrast:\n```python\ndef square(n):\n    return n * n\n\nans = square(5)  # ans is 25\n```\nIf square used print(), ans would be None.";
        } else {
          const resp = await chatService.askQuestion(text, tutoringTier);
          replyText = resp.responseMessage.text;
        }

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: replyText,
          tier: tierUsed,
          timestamp: "Just now",
        };

        setChatMessages((prev) => [...prev, assistantMsg]);
      } catch (e) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `assistant-err-${Date.now()}`,
            role: "assistant",
            text: "Remember: in Python, a function hands back None unless you explicitly write return.",
            tier: tutoringTier,
            timestamp: "Just now",
          },
        ]);
      } finally {
        setIsAnsweringChat(false);
      }
    },
    [isAnsweringChat, tutoringTier]
  );

  // Start Practice Path
  const handleStartPractice = useCallback(() => {
    setOpenTabs((prev) => (prev.includes("reassessment") ? prev : [...prev, "reassessment"]));
    setActiveEditorTab("reassessment");
    setShowStrengthenBar(false);
  }, []);

  // Complete Practice Path
  const handleCompletePractice = useCallback(() => {
    setLoopNode("verified");
    setCompletedLoopNodes(["attempt", "diagnose", "fix", "transfer", "verified"]);
    setConcepts((prev) =>
      prev.map((c) =>
        c.id === "return-vs-print"
          ? {
              ...c,
              state: "resolved",
              description: "Mastered. Distinguishes print() from return across all call contexts.",
              history: [...c.history, "pass"],
            }
          : c
      )
    );
  }, []);

  // Advance to next lesson
  const handleNextLesson = useCallback(() => {
    if (onAdvanceLesson) {
      onAdvanceLesson();
    } else {
      handleGenerateNewQuestion();
    }
  }, [onAdvanceLesson, handleGenerateNewQuestion]);

  // URL query parameters support display preferences only; they cannot inject mock data.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("drawer") === "open" || params.get("drawer") === "true") {
      setIsDrawerOpen(true);
    }
    const dTab = params.get("drawerTab");
    if (dTab === "tests" || dTab === "doubt-chat" || dTab === "trace") {
      setActiveDrawerTab(dTab as DrawerTabId);
    }
    if (params.get("tab") === "practice") {
      handleStartPractice();
    }
    if (params.get("collapsed") === "true") {
      setIsStripCollapsed(true);
    }
  }, [handleStartPractice]);

  return {
    // Problem & Code
    currentProblem,
    code,
    setCode,
    isDirty,
    handleCodeChange,
    handleResetCode,
    handleGenerateNewQuestion,

    // Status & Loop Track
    status,
    runResult,
    runExecution,
    autoCompile,
    setAutoCompile,
    hasRunAtLeastOnce,
    loopNode,
    completedLoopNodes,

    // Lesson Strip
    isStripCollapsed,
    setIsStripCollapsed,

    // Diagnostics & Markers
    activeDiagnosticIndex,
    setActiveDiagnosticIndex,
    dismissedLines,
    setDismissedLines,
    breakdownMode,
    setBreakdownMode,
    applyTier4Fix,

    // Concepts & Dock
    concepts,
    setConcepts,

    // Drawer
    isDrawerOpen,
    setIsDrawerOpen,
    activeDrawerTab,
    setActiveDrawerTab,
    setDrawerDismissCount,

    // Success & Strengthen Bar
    gutterSweepActive,
    floatingXpToast,
    showStrengthenBar,
    setShowStrengthenBar,
    handleStartPractice,
    handleCompletePractice,
    handleNextLesson,

    // Tabs & Layout
    activeEditorTab,
    setActiveEditorTab,
    openTabs,
    setOpenTabs,

    // Cursor
    cursorPosition,
    setCursorPosition,

    // Doubt Chat
    chatMessages,
    contextChips,
    tutoringTier,
    setTutoringTier,
    isAnsweringChat,
    handleAskAboutLine,
    handleRemoveContextChip,
    handleSendChatMessage,

    // Command Palette
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
  };
}
