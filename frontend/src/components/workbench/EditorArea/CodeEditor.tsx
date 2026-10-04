import React, { useRef, useEffect, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { LineDiagnosis } from "../data/mockDiagnoses";
import {
  registerRelearnTheme,
  applyModelMarkers,
  buildEditorDecorations,
} from "../Diagnostics/markers";
import { AnnotationRail } from "../AnnotationRail/AnnotationRail";
import { BreakdownToggle } from "../Diagnostics/BreakdownMode";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onReset: () => void;
  isRunning: boolean;
  autoCompile: boolean;
  diagnoses: LineDiagnosis[];
  activeDiagnosticIndex: number;
  setActiveDiagnosticIndex: (index: number) => void;
  dismissedLines: Set<number>;
  onDismissDiagnostic: (line: number) => void;
  breakdownMode: boolean;
  onToggleBreakdown: () => void;
  onApplyFix: (fixedCode: string) => void;
  onAskAboutLine: (line: number) => void;
  onCursorChange?: (pos: { line: number; col: number }) => void;
  hasRunAtLeastOnce: boolean;
  gutterSweepActive?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
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
  gutterSweepActive = false,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<any>(null);
  const decorationsCollectionRef = useRef<editor.IEditorDecorationsCollection | null>(null);

  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  // Optional predict-first micro-step state
  const [showPredictBar, setShowPredictBar] = useState(false);
  const [userPrediction, setUserPrediction] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleDiagnoses = diagnoses.filter((d) => !dismissedLines.has(d.line));
  const hasErrors = visibleDiagnoses.length > 0;
  const isBelow1100 = windowWidth < 1100;
  const isLargeScreen = windowWidth >= 1440;

  const handleEditorDidMount: OnMount = (editorInstance, monacoInstance) => {
    editorRef.current = editorInstance;
    monacoRef.current = monacoInstance;

    registerRelearnTheme(monacoInstance);
    monacoInstance.editor.setTheme("relearn-dark");

    editorInstance.onDidChangeCursorPosition((e) => {
      onCursorChange?.({
        line: e.position.lineNumber,
        col: e.position.column,
      });
    });

    editorInstance.addCommand(
      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter,
      () => {
        onRun();
      }
    );

    updateMarkersAndDecorations();
  };

  const updateMarkersAndDecorations = () => {
    if (!editorRef.current || !monacoRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    applyModelMarkers(monacoRef.current, model, visibleDiagnoses);

    const lineCount = model.getLineCount();
    const newDecs = buildEditorDecorations(visibleDiagnoses, breakdownMode, lineCount);

    if (!decorationsCollectionRef.current) {
      decorationsCollectionRef.current = editorRef.current.createDecorationsCollection(newDecs);
    } else {
      decorationsCollectionRef.current.set(newDecs);
    }
  };

  useEffect(() => {
    updateMarkersAndDecorations();
  }, [visibleDiagnoses, breakdownMode, code]);

  return (
    <div className="h-full flex flex-col bg-[#1F1F1F] min-w-0 relative overflow-hidden">
      {/* Optional Predict-first Micro-step bar */}
      {showPredictBar && (
        <div className="h-8 bg-[#181818] border-b border-[#2B2B2B] px-4 flex items-center justify-between text-xs text-[#CCCCCC] animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#007ACC] font-mono font-semibold uppercase">
              Predict:
            </span>
            <span>What will result evaluate to?</span>
            <div className="flex items-center gap-1.5 ml-2">
              {["8", "None", "Error"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setUserPrediction(opt)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                    userPrediction === opt
                      ? "bg-[#007ACC] border-[#007ACC] text-white"
                      : "bg-[#222222] border-[#333333] text-[#AAAAAA] hover:text-white"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowPredictBar(false)}
            className="text-[#666666] hover:text-white text-xs"
          >
            <span className="codicon codicon-close" />
          </button>
        </div>
      )}

      {/* Editor Header Strip */}
      <div className="h-[36px] bg-[#1F1F1F] border-b border-[#2B2B2B] px-3 flex items-center justify-between text-xs select-none shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-white font-medium text-[12px]">
            solution.py
          </span>
          {autoCompile && (
            <span className="text-[11px] text-[#666666] font-sans flex items-center gap-1.5 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2EA043]" />
              Auto-compile on
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Predict-first toggle button */}
          <button
            onClick={() => setShowPredictBar(!showPredictBar)}
            className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
              showPredictBar ? "text-[#007ACC] bg-white/5 font-medium" : "text-[#777777] hover:text-white"
            }`}
            title="Toggle Predict-First Micro-step"
          >
            <span className="codicon codicon-lightbulb text-xs mr-1" />
            <span className="hidden sm:inline">Predict</span>
          </button>

          {/* Breakdown Mode Toggle */}
          <BreakdownToggle active={breakdownMode} onToggle={onToggleBreakdown} />

          {/* Reset Starter */}
          <button
            onClick={onReset}
            className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center text-[#888888] hover:text-white transition-colors cursor-pointer"
            title="Reset code"
            aria-label="Reset code"
          >
            <span className="codicon codicon-debug-restart text-xs" />
          </button>

          {/* Primary Compact Run Button */}
          <button
            onClick={onRun}
            disabled={isRunning}
            className="h-7 px-3 rounded-[4px] bg-[#007ACC] hover:bg-[#0098FF] active:bg-[#0062A3] text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
            title="Send code to the Re:Learn model (Ctrl+Enter)"
          >
            {isRunning ? (
              <>
                <span className="codicon codicon-loading codicon-modifier-spin text-xs" />
                <span>Sending…</span>
              </>
            ) : (
              <>
                <span className="codicon codicon-play text-xs" />
                <span>Diagnose</span>
                <kbd className="text-[10px] opacity-75 ml-1 hidden sm:inline font-mono">
                  Ctrl+Enter
                </kbd>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Surface + Side Annotation Rail */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Monaco Editor Container (smoothly narrows when rail opens) */}
        <div className="flex-1 min-w-0 relative h-full">
          <Editor
            height="100%"
            language="python"
            theme="relearn-dark"
            value={code}
            onChange={(val) => onChange(val || "")}
            onMount={handleEditorDidMount}
            options={{
              fontSize: isLargeScreen ? 15 : 14,
              lineHeight: isLargeScreen ? 24 : 22,
              fontFamily: "'JetBrains Mono', 'Geist Mono', 'Fira Code', monospace",
              minimap: { enabled: isLargeScreen, scale: 1, renderCharacters: false },
              lineNumbers: "on",
              glyphMargin: true,
              folding: true,
              bracketPairColorization: { enabled: true },
              renderLineHighlight: "all",
              cursorSmoothCaretAnimation: "on",
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
              automaticLayout: true,
              tabSize: 4,
              insertSpaces: true,
            }}
          />

          {/* Idle faint hint below code (disappears after first run) */}
          {!hasRunAtLeastOnce && !hasErrors && (
            <div className="absolute bottom-4 left-14 text-xs font-mono text-[#555555] pointer-events-none select-none">
              Press <kbd className="px-1 py-0.5 rounded bg-[#161616] border border-[#333333] text-[#777777]">Ctrl+Enter</kbd> to send code for diagnosis
            </div>
          )}

          {/* Gutter green sweep effect on pass */}
          {gutterSweepActive && (
            <div className="absolute top-0 bottom-0 left-0 w-8 bg-[#2EA043]/30 pointer-events-none animate-in fade-in duration-300" />
          )}
        </div>

        {/* 340px Slide-in Annotation Rail (on wide screens) */}
        {hasErrors && !isBelow1100 && (
          <AnnotationRail
            diagnoses={visibleDiagnoses}
            activeDiagnosticIndex={activeDiagnosticIndex}
            setActiveDiagnosticIndex={setActiveDiagnosticIndex}
            dismissedLines={dismissedLines}
            onDismiss={onDismissDiagnostic}
            onApplyFix={onApplyFix}
            onAskAboutLine={onAskAboutLine}
            isInlineBelow={false}
          />
        )}
      </div>

      {/* Inline Below Rail for screens < 1100px */}
      {hasErrors && isBelow1100 && (
        <AnnotationRail
          diagnoses={visibleDiagnoses}
          activeDiagnosticIndex={activeDiagnosticIndex}
          setActiveDiagnosticIndex={setActiveDiagnosticIndex}
          dismissedLines={dismissedLines}
          onDismiss={onDismissDiagnostic}
          onApplyFix={onApplyFix}
          onAskAboutLine={onAskAboutLine}
          isInlineBelow={true}
        />
      )}
    </div>
  );
};
