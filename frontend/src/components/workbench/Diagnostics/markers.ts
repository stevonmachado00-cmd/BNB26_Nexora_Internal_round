import type { editor } from "monaco-editor";
import { LineDiagnosis } from "../data/mockDiagnoses";

export const RELEARN_DARK_THEME: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "keyword", foreground: "569CD6" },
    { token: "keyword.control", foreground: "C586C0" },
    { token: "type", foreground: "4EC9B0" },
    { token: "function", foreground: "DCDCAA" },
    { token: "string", foreground: "CE9178" },
    { token: "number", foreground: "B5CEA8" },
    { token: "comment", foreground: "6A9955", fontStyle: "italic" },
    { token: "variable", foreground: "9CDCFE" },
    { token: "delimiter", foreground: "D4D4D4" },
  ],
  colors: {
    "editor.background": "#1F1F1F",
    "editor.foreground": "#D4D4D4",
    "editor.lineHighlightBackground": "#FFFFFF0A",
    "editorCursor.foreground": "#AEAFAD",
    "editorWhitespace.foreground": "#404040",
    "editorIndentGuide.background": "#404040",
    "editorIndentGuide.activeBackground": "#707070",
    "editor.selectionBackground": "#264F78",
    "editorLineNumber.foreground": "#6E7681",
    "editorLineNumber.activeForeground": "#CCCCCC",
  },
};

export function registerRelearnTheme(monaco: any) {
  if (monaco?.editor) {
    monaco.editor.defineTheme("relearn-dark", RELEARN_DARK_THEME);
  }
}

export function applyModelMarkers(
  monaco: any,
  model: editor.ITextModel | null,
  diagnoses: LineDiagnosis[]
) {
  if (!monaco || !model) return;

  const markers: editor.IMarkerData[] = diagnoses.map((d) => ({
    severity:
      d.status === "error"
        ? monaco.MarkerSeverity.Error
        : d.status === "warning"
        ? monaco.MarkerSeverity.Warning
        : monaco.MarkerSeverity.Info,
    startLineNumber: d.line,
    startColumn: d.startCol || 1,
    endLineNumber: d.line,
    endColumn: d.endCol || (model.getLineMaxColumn ? model.getLineMaxColumn(d.line) : 40),
    message: d.headline || d.annotation,
    source: "Re:Learn Cognitive Lab",
  }));

  monaco.editor.setModelMarkers(model, "relearn", markers);
}

export function buildEditorDecorations(
  diagnoses: LineDiagnosis[],
  breakdownMode: boolean,
  codeLineCount: number
): editor.IModelDeltaDecoration[] {
  const decorations: editor.IModelDeltaDecoration[] = [];

  // 1. Diagnostics decorations
  diagnoses.forEach((d) => {
    if (d.status === "error" || d.status === "warning") {
      decorations.push({
        range: {
          startLineNumber: d.line,
          startColumn: 1,
          endLineNumber: d.line,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: "monaco-failing-line",
          glyphMarginClassName: "monaco-glyph-error",
          glyphMarginHoverMessage: { value: `**${d.errorType || "Error"}**: ${d.headline || d.annotation}` },
          after: {
            content: `   ${d.annotation}`,
            inlineClassName: "monaco-inline-annotation error",
          },
        },
      });
    }
  });

  // 2. Breakdown mode line-by-line annotations
  if (breakdownMode) {
    const diagnosedLines = new Set(diagnoses.map((d) => d.line));
    for (let line = 1; line <= codeLineCount; line++) {
      if (diagnosedLines.has(line)) continue;

      const annotationText = "← submitted for model review";

      decorations.push({
        range: {
          startLineNumber: line,
          startColumn: 1,
          endLineNumber: line,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          glyphMarginClassName: "monaco-glyph-ok",
          after: {
            content: `   ${annotationText}`,
            inlineClassName: "monaco-inline-annotation breakdown-ok",
          },
        },
      });
    }
  }

  return decorations;
}
