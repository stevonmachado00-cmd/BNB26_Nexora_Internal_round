import React from "react";
import { TeachingStyle } from "../../types";
import { Eye, GitCompare, ListOrdered, Sparkles } from "lucide-react";
import { reassessmentService } from "../../services/reassessmentService";

interface TeachingStyleSelectorProps {
  selectedStyle: TeachingStyle;
  onSelectStyle: (style: TeachingStyle) => void;
  preferredStyle?: string;
}

export const TeachingStyleSelector: React.FC<TeachingStyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  preferredStyle = "Contrast examples",
}) => {
  const styles: { id: TeachingStyle; label: string; desc: string; icon: any; isStrongest?: boolean }[] = [
    {
      id: "contrast-examples",
      label: "Compare Two Examples",
      desc: "Side-by-side contrast between flawed and sound Python code patterns.",
      icon: GitCompare,
      isStrongest: true,
    },
    {
      id: "visual-trace",
      label: "Visual Memory Trace",
      desc: "Step-by-step memory frame diagram showing where return values travel.",
      icon: Eye,
    },
    {
      id: "step-by-step",
      label: "Step-by-Step Walkthrough",
      desc: "Systematic conceptual rules and mental checklists for writing functions.",
      icon: ListOrdered,
    },
  ];

  const content = reassessmentService.getTeachingStyleContent(selectedStyle);

  return (
    <div className="space-y-3.5 p-4 rounded bg-[#0e1218] border border-[#212734] text-xs select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#212734] pb-2.5">
        <div>
          <h4 className="text-xs font-bold text-[#f0f6fc] font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#58a6ff]" />
            Adaptive Representation Switch
          </h4>
          <p className="text-[#8b949e] text-[11px] mt-0.5">
            Switch explanatory representations to solidify the mental model.
          </p>
        </div>

        <div className="px-2 py-0.5 rounded bg-[#12161f] border border-[#212734] text-[#8b949e] font-mono text-[10px] self-start sm:self-auto">
          Learner Model: <span className="font-bold text-[#f0f6fc]">{preferredStyle}</span>
        </div>
      </div>

      {/* Style Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {styles.map((s) => {
          const Icon = s.icon;
          const isSelected = selectedStyle === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectStyle(s.id)}
              className={`p-2.5 rounded border text-left flex flex-col justify-between gap-1.5 transition-colors ${
                isSelected
                  ? "bg-[#161d28] border-[#388bfd]"
                  : "bg-[#090d13] border-[#212734] hover:border-[#303848]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono">
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isSelected ? "text-[#58a6ff]" : "text-[#6e7681]"
                    }`}
                  />
                  <span
                    className={`font-semibold text-xs ${
                      isSelected ? "text-[#f0f6fc]" : "text-[#c9d1d9]"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {s.isStrongest && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#0c2013] text-[#3fb950] border border-[#1e4a29] font-mono">
                    Optimal
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8b949e] leading-relaxed">{s.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Render Selected Teaching Content */}
      <div className="p-3.5 rounded bg-[#090d13] border border-[#212734] space-y-2.5 select-text">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#f0f6fc] text-xs font-mono">
            {content.title}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#12161f] text-[#8b949e] border border-[#212734] font-mono">
            {content.badge}
          </span>
        </div>
        <p className="text-[#8b949e] text-xs">{content.description}</p>

        {selectedStyle === "contrast-examples" && content.exampleA && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            <div className="p-2.5 rounded bg-[#180e11] border border-[#381a1e] space-y-1.5">
              <span className="text-[#f85149] font-bold font-mono text-[11px] block">
                {content.exampleA.title}
              </span>
              <pre className="font-mono text-[11px] text-[#c9d1d9] whitespace-pre-wrap bg-[#090d13] p-2 rounded border border-[#2b161a]">
                {content.exampleA.code}
              </pre>
              <p className="text-[11px] text-[#f85149]">{content.exampleA.note}</p>
            </div>

            <div className="p-2.5 rounded bg-[#0c1610] border border-[#1e3825] space-y-1.5">
              <span className="text-[#3fb950] font-bold font-mono text-[11px] block">
                {content.exampleB.title}
              </span>
              <pre className="font-mono text-[11px] text-[#c9d1d9] whitespace-pre-wrap bg-[#090d13] p-2 rounded border border-[#14281b]">
                {content.exampleB.code}
              </pre>
              <p className="text-[11px] text-[#3fb950]">{content.exampleB.note}</p>
            </div>
          </div>
        )}

        {(selectedStyle === "visual-trace" || selectedStyle === "step-by-step") && content.steps && (
          <div className="space-y-1.5 pt-1 font-mono text-xs">
            {content.steps.map((st, i) => (
              <div
                key={i}
                className="p-2 rounded bg-[#0e1218] border border-[#212734] text-[#c9d1d9] flex items-start gap-2"
              >
                <span className="text-[#58a6ff] font-bold">#{i + 1}</span>
                <span className="font-sans text-xs">{st}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
