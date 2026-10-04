import React, { useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Play, RotateCcw, FileCode, Sparkles } from "lucide-react";

interface CodeEditorWrapperProps {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onReset: () => void;
  onLoadDemoCode?: () => void;
  isRunning: boolean;
  highlightedLines?: number[];
}

export const CodeEditorWrapper: React.FC<CodeEditorWrapperProps> = ({
  code,
  onChange,
  onRun,
  onReset,
  onLoadDemoCode,
  isRunning,
  highlightedLines = [],
}) => {
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Ctrl+Enter or Cmd+Enter to run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });
  };

  // Update line highlights when highlightedLines prop changes
  useEffect(() => {
    if (!editorRef.current) return;
    const editor = editorRef.current;

    if (highlightedLines.length > 0) {
      const newDecorations = highlightedLines.map((line) => ({
        range: {
          startLineNumber: line,
          startColumn: 1,
          endLineNumber: line,
          endColumn: 100,
        },
        options: {
          isWholeLine: true,
          className: "bg-[#332208]/50 border-l-2 border-[#d29922]",
          glyphMarginClassName: "text-[#d29922] font-bold",
          hoverMessage: {
            value: "**Conceptual Misconception on Line " + line + "**\n\nTreating `print()` as if it delivers a return value to caller variable.",
          },
        },
      }));
      decorationsRef.current = editor.deltaDecorations(
        decorationsRef.current,
        newDecorations
      );
    } else {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
    }
  }, [highlightedLines]);

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] border-t lg:border-t-0 lg:border-l border-[#212734] relative select-none">
      {/* Editor Control Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0c1017] border-b border-[#212734] text-xs">
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-[#8b949e]" />
          <span className="font-mono text-[#f0f6fc] font-semibold text-xs">solution.py</span>
          <span className="text-[10px] text-[#6e7681] font-mono hidden sm:inline">
            (Python 3.11 Runtime)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onLoadDemoCode && (
            <button
              onClick={onLoadDemoCode}
              className="px-2 py-0.5 rounded text-[11px] font-mono text-[#d29922] bg-[#231b09] hover:bg-[#34270d] border border-[#523f14] transition-colors flex items-center gap-1"
              title="Pre-seed demo code with Return vs Print mistake"
            >
              <Sparkles className="w-3 h-3 text-[#d29922]" />
              <span>Load Flawed Code</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="p-1 rounded text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#161c26] border border-transparent hover:border-[#212734] transition-colors"
            title="Reset code template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Monaco Surface */}
      <div className="flex-1 min-h-[280px] relative select-text">
        <Editor
          height="100%"
          defaultLanguage="python"
          language="python"
          value={code}
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "all",
            lineDecorationsWidth: 8,
            glyphMargin: true,
            tabSize: 4,
            insertSpaces: true,
            automaticLayout: true,
            padding: { top: 10, bottom: 10 },
            bracketPairColorization: { enabled: true },
            overviewRulerBorder: false,
          }}
        />

        {/* Floating Line 2 Error Marker Tag */}
        {highlightedLines.includes(2) && (
          <div className="absolute top-[34px] right-3 z-10 pointer-events-none">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#231b09] text-[#d29922] border border-[#523f14] font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d29922]" />
              <span>Line 2: Conceptual Misconception</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Run Action Bar */}
      <div className="p-2.5 bg-[#0c1017] border-t border-[#212734] flex items-center justify-between">
        <div className="text-[10px] text-[#6e7681] font-mono hidden sm:flex items-center gap-1.5">
          <span>Run:</span>
          <kbd className="px-1.5 py-0.2 rounded bg-[#161b24] text-[#8b949e] border border-[#262e3d]">
            Ctrl+Enter
          </kbd>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onRun}
            disabled={isRunning}
            className={`px-3.5 py-1.5 rounded font-mono font-semibold text-xs flex items-center gap-1.5 transition-colors ${
              isRunning
                ? "bg-[#18202d] text-[#6e7681] border border-[#212734] cursor-not-allowed"
                : "bg-[#238636] hover:bg-[#2ea043] text-[#ffffff] border border-[#2ea043]"
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-3 h-3 border-2 border-[#8b949e] border-t-transparent rounded-full animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Run Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

