import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { registerRelearnTheme } from "../Diagnostics/markers";

interface SimilarStepProps {
  onSuccess: () => void;
}

export const SimilarStep: React.FC<SimilarStepProps> = ({ onSuccess }) => {
  const [code, setCode] = useState(
    "def multiply(a, b):\n    # Return the product of a and b\n    print(a * b)\n\nval = multiply(4, 5)"
  );
  const [hasRun, setHasRun] = useState(false);
  const [passed, setPassed] = useState(false);

  const handleTest = () => {
    setHasRun(true);
    if (code.includes("return") && !code.includes("print(a * b)")) {
      setPassed(true);
      setTimeout(() => {
        onSuccess();
      }, 900);
    } else {
      setPassed(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3 py-3 select-none font-sans">
      <div className="flex items-center justify-between pb-1 border-b border-[#2B2B2B]">
        <div className="text-xs">
          <span className="text-[#007ACC] font-mono uppercase font-semibold mr-2">
            Transfer Problem
          </span>
          <span className="text-white font-medium">
            Write <code className="text-[#4EC9B0] font-mono">multiply(a, b)</code> to return product
          </span>
        </div>

        <button
          onClick={handleTest}
          className="px-3.5 py-1 rounded bg-[#007ACC] hover:bg-[#0098FF] text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="codicon codicon-play text-xs" />
          <span>Run Check</span>
        </button>
      </div>

      {/* Compact Monaco Surface */}
      <div className="h-56 rounded border border-[#2B2B2B] overflow-hidden bg-[#1F1F1F]">
        <Editor
          height="100%"
          language="python"
          theme="relearn-dark"
          beforeMount={(monaco) => registerRelearnTheme(monaco)}
          value={code}
          onChange={(v) => setCode(v || "")}
          options={{
            fontSize: 14,
            lineHeight: 22,
            fontFamily: "'JetBrains Mono', 'Geist Mono', monospace",
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            padding: { top: 8, bottom: 8 },
          }}
        />
      </div>

      {/* Result banner */}
      {hasRun && (
        <div
          className={`p-3 rounded text-xs flex items-center justify-between animate-in fade-in ${
            passed
              ? "bg-[#2EA043]/15 border border-[#2EA043] text-white"
              : "bg-[#F14C4C]/15 border border-[#F14C4C] text-[#F87171]"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`codicon ${
                passed ? "codicon-check text-[#2EA043]" : "codicon-warning text-[#F14C4C]"
              } text-sm`}
            />
            <span>
              {passed
                ? "Transfer verified! The caller received 20."
                : "The function still printed instead of returning a * b."}
            </span>
          </div>

          {passed && (
            <span className="text-[#4ADE80] font-mono font-medium">Proceeding…</span>
          )}
        </div>
      )}
    </div>
  );
};
