import React from "react";
import { LineDiagnosis } from "../data/mockDiagnoses";
import { RailCard } from "./RailCard";
import { Connector } from "./Connector";

interface AnnotationRailProps {
  diagnoses: LineDiagnosis[];
  activeDiagnosticIndex: number;
  setActiveDiagnosticIndex: (idx: number) => void;
  dismissedLines: Set<number>;
  onDismiss: (line: number) => void;
  onApplyFix: (code: string) => void;
  onAskAboutLine: (line: number) => void;
  isInlineBelow?: boolean; // For < 1100px view
}

export const AnnotationRail: React.FC<AnnotationRailProps> = ({
  diagnoses,
  activeDiagnosticIndex,
  setActiveDiagnosticIndex,
  dismissedLines,
  onDismiss,
  onApplyFix,
  onAskAboutLine,
  isInlineBelow = false,
}) => {
  const visibleDiagnoses = diagnoses.filter((d) => !dismissedLines.has(d.line));

  if (visibleDiagnoses.length === 0) return null;

  const activeDiagnosis =
    visibleDiagnoses[Math.min(activeDiagnosticIndex, visibleDiagnoses.length - 1)];

  if (isInlineBelow) {
    return (
      <div className="w-full p-3 bg-[#181818] border-t border-[#2B2B2B] animate-in fade-in duration-200">
        <RailCard
          diagnosis={activeDiagnosis}
          onApplyFix={onApplyFix}
          onAskAboutLine={onAskAboutLine}
          onDismiss={onDismiss}
          hasMultiple={visibleDiagnoses.length > 1}
          onNext={() =>
            setActiveDiagnosticIndex((activeDiagnosticIndex + 1) % visibleDiagnoses.length)
          }
          onPrev={() =>
            setActiveDiagnosticIndex(
              (activeDiagnosticIndex - 1 + visibleDiagnoses.length) % visibleDiagnoses.length
            )
          }
        />
      </div>
    );
  }

  // Calculate approximate start coordinates for SVG connector:
  // failing line end (e.g. 260px from left) to rail card header (left edge of rail)
  const lineIndex = activeDiagnosis ? activeDiagnosis.line : 2;
  const startY = Math.max(20, (lineIndex - 1) * 24 + 20);

  return (
    <div className="w-[340px] shrink-0 h-full bg-[#181818]/90 border-l border-[#2B2B2B] p-3 flex flex-col gap-2.5 overflow-y-auto select-none transition-all duration-300 relative z-20">
      {/* SVG Connector from editor code to rail card header */}
      <Connector startX={-60} startY={startY} endX={0} endY={30} />

      {/* Stacked cards or rows if multiple */}
      {visibleDiagnoses.map((diag, idx) => {
        const isSelected = diag.line === activeDiagnosis.line;

        if (isSelected) {
          return (
            <RailCard
              key={diag.line}
              diagnosis={diag}
              onApplyFix={onApplyFix}
              onAskAboutLine={onAskAboutLine}
              onDismiss={onDismiss}
              hasMultiple={visibleDiagnoses.length > 1}
              onNext={() =>
                setActiveDiagnosticIndex((activeDiagnosticIndex + 1) % visibleDiagnoses.length)
              }
              onPrev={() =>
                setActiveDiagnosticIndex(
                  (activeDiagnosticIndex - 1 + visibleDiagnoses.length) % visibleDiagnoses.length
                )
              }
            />
          );
        }

        // Collapsed row for secondary errors
        return (
          <div
            key={diag.line}
            onClick={() => setActiveDiagnosticIndex(idx)}
            className="p-2 rounded bg-[#1F1F1F] border border-[#2B2B2B] hover:border-[#444444] cursor-pointer flex items-center justify-between text-xs text-[#AAAAAA] hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#CCA700]" />
              <span className="font-semibold text-white">Line {diag.line}</span>
              <span className="text-[#666666]">·</span>
              <span className="truncate">{diag.headline}</span>
            </div>
            <span className="codicon codicon-chevron-right text-xs text-[#888888]" />
          </div>
        );
      })}
    </div>
  );
};
