import React, { useState } from "react";
import { Misconception, MisconceptionStatus } from "../types";
import { Badge } from "../components/common/Badge";
import { Modal } from "../components/common/Modal";
import { Search } from "lucide-react";

interface MisconceptionsPageProps {
  misconceptions: Misconception[];
  onReviewMisconception: (misconceptionId: string) => void;
}

export const MisconceptionsPage: React.FC<MisconceptionsPageProps> = ({
  misconceptions,
  onReviewMisconception,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | MisconceptionStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectedMisconception, setInspectedMisconception] = useState<Misconception | null>(null);

  const filtered = misconceptions.filter((m) => {
    const matchesTab = activeTab === "all" || m.status === activeTab;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.faultyBelief.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.relatedConcept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    all: misconceptions.length,
    active: misconceptions.filter((m) => m.status === "active").length,
    resolved: misconceptions.filter((m) => m.status === "resolved").length,
    recurring: misconceptions.filter((m) => m.status === "recurring").length,
  };

  return (
    <div className="p-5 max-w-5xl mx-auto space-y-5 text-[#c9d1d9] select-none">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg sm:text-xl font-bold text-[#f0f6fc] font-mono tracking-tight">
          Misconceptions Catalog
        </h1>
        <p className="text-xs text-[#8b949e]">
          Re:Learn isolates flawed underlying mental representations across your problem-solving history.
        </p>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#212734] pb-2.5">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
          {[
            { id: "all", label: "All", count: counts.all },
            { id: "active", label: "Active", count: counts.active },
            { id: "recurring", label: "Recurring", count: counts.recurring },
            { id: "resolved", label: "Resolved", count: counts.resolved },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  isSelected
                    ? "bg-[#18202d] text-[#f0f6fc] border border-[#2d384c] font-semibold"
                    : "text-[#8b949e] hover:text-[#f0f6fc] bg-[#0e1218] border border-transparent"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded ${
                    isSelected ? "bg-[#25334a] text-[#f0f6fc]" : "bg-[#161b24] text-[#8b949e]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-[#6e7681] absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search misconceptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0e1218] border border-[#212734] rounded pl-7 pr-2.5 py-1 text-xs text-[#c9d1d9] placeholder:text-[#6e7681] focus:outline-none focus:border-[#388bfd] font-sans"
          />
        </div>
      </div>

      {/* Misconception Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="p-3.5 rounded bg-[#0e1218] border border-[#212734] hover:border-[#303848] transition-colors flex flex-col justify-between gap-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap font-mono">
                  <Badge type={m.status} label={m.status.toUpperCase()} size="sm" />
                  <span className="text-[10px] text-[#6e7681]">
                    {m.relatedConcept}
                  </span>
                </div>

                <span className="text-[10px] font-mono font-bold text-[#8b949e]">
                  {m.confidence}% Conf.
                </span>
              </div>

              <h3 className="font-bold text-xs font-mono text-[#f0f6fc]">
                {m.name}
              </h3>

              <p className="text-[11px] text-[#8b949e] leading-relaxed line-clamp-3">
                {m.faultyBelief}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#1e2533]">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#6e7681]">
                <span>Observed: {m.occurrenceCount}x</span>
                {m.resolvedCount > 0 && (
                  <span className="text-[#3fb950]">Resolved: {m.resolvedCount}x</span>
                )}
                {m.returnedCount > 0 && (
                  <span className="text-[#f85149]">Recurred: {m.returnedCount}x</span>
                )}
              </div>

              <div className="flex items-center gap-1.5 font-mono text-xs">
                <button
                  onClick={() => setInspectedMisconception(m)}
                  className="flex-1 py-1 rounded bg-[#141922] hover:bg-[#1c2330] text-[#c9d1d9] font-medium text-[11px] text-center border border-[#262e3d] transition-colors"
                >
                  Inspect
                </button>
                <button
                  onClick={() => onReviewMisconception(m.id)}
                  className="px-2.5 py-1 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-[11px] border border-[#2ea043] transition-colors"
                >
                  Practice
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Misconception Detail Inspection Modal */}
      {inspectedMisconception && (
        <Modal
          isOpen={true}
          onClose={() => setInspectedMisconception(null)}
          title={`Misconception Audit: ${inspectedMisconception.name}`}
          subtitle={`Concept domain: ${inspectedMisconception.relatedConcept}`}
          maxWidth="2xl"
        >
          <div className="space-y-3.5 text-xs text-[#c9d1d9]">
            <div className="flex items-center justify-between pb-2 border-b border-[#212734] font-mono">
              <div className="flex items-center gap-2">
                <Badge type={inspectedMisconception.status} label={inspectedMisconception.status.toUpperCase()} />
                <span className="text-[11px] text-[#8b949e]">
                  Confidence: {inspectedMisconception.confidence}%
                </span>
              </div>
              <span className="text-[11px] text-[#6e7681]">
                Observed {inspectedMisconception.occurrenceCount} times
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#8b949e] block font-semibold">
                Underlying Faulty Belief:
              </span>
              <div className="p-2.5 rounded bg-[#181308] border border-[#3e2e0e] text-[#d29922] text-xs leading-relaxed">
                {inspectedMisconception.faultyBelief}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#8b949e] block font-semibold">
                Correct Mental Model:
              </span>
              <div className="p-2.5 rounded bg-[#0c2013] border border-[#1e4a29] text-[#3fb950] text-xs leading-relaxed">
                {inspectedMisconception.explanation}
              </div>
            </div>

            {inspectedMisconception.contrastExample && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#8b949e] block font-semibold">
                  Code Comparison:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-[#180e11] border border-[#381a1e] space-y-1">
                    <span className="text-[#f85149] font-bold block">Flawed Example</span>
                    <pre className="text-[#c9d1d9] bg-[#090d13] p-1.5 rounded border border-[#2b161a] whitespace-pre-wrap">
                      {inspectedMisconception.contrastExample.flawed}
                    </pre>
                  </div>
                  <div className="p-2 rounded bg-[#0c1610] border border-[#1e3825] space-y-1">
                    <span className="text-[#3fb950] font-bold block">Correct Example</span>
                    <pre className="text-[#c9d1d9] bg-[#090d13] p-1.5 rounded border border-[#14281b] whitespace-pre-wrap">
                      {inspectedMisconception.contrastExample.sound}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#212734] font-mono">
              <button
                onClick={() => setInspectedMisconception(null)}
                className="px-3 py-1.5 rounded bg-[#141922] hover:bg-[#1c2330] text-[#c9d1d9] text-xs border border-[#262e3d] transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = inspectedMisconception.id;
                  setInspectedMisconception(null);
                  onReviewMisconception(id);
                }}
                className="px-3.5 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-xs border border-[#2ea043] transition-colors"
              >
                Launch Transfer Reassessment →
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
