import React, { useState } from "react";
import { RunResult } from "../data/mockDiagnoses";
import { ChatMessage } from "../state/workbenchMachine";
import { TestsDrawerTab } from "./TestsDrawerTab";
import { DoubtChatDrawerTab } from "./DoubtChatDrawerTab";
import { TraceDrawerTab } from "./TraceDrawerTab";

export type DrawerTabId = "tests" | "doubt-chat" | "trace";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: DrawerTabId;
  onSelectTab: (tab: DrawerTabId) => void;
  runResult: RunResult | null;
  chatMessages: ChatMessage[];
  contextChips: string[];
  tutoringTier: number;
  setTutoringTier: (tier: number) => void;
  isAnsweringChat: boolean;
  onSendMessage: (text: string) => void;
  onRemoveChip: (chip: string) => void;
  onHighlightLine?: (line: number) => void;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  runResult,
  chatMessages,
  contextChips,
  tutoringTier,
  setTutoringTier,
  isAnsweringChat,
  onSendMessage,
  onRemoveChip,
  onHighlightLine,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) return null;

  const tabs: { id: DrawerTabId; label: string; badge?: string | number }[] = [
    {
      id: "tests",
      label: "Tests",
      badge: runResult
        ? runResult.tests.every((t) => t.passed)
          ? "Pass"
          : "Fail"
        : undefined,
    },
    {
      id: "doubt-chat",
      label: "Doubt Chat",
      badge: contextChips.length > 0 ? contextChips.length : undefined,
    },
    {
      id: "trace",
      label: "Model review",
    },
  ];

  return (
    <div
      className={`border-t border-[#2B2B2B] bg-[#1F1F1F] flex flex-col z-30 transition-all duration-200 select-none overflow-hidden ${
        isMaximized ? "h-[65vh]" : "h-[32vh] min-h-[220px]"
      }`}
    >
      {/* Header bar */}
      <div className="h-[34px] bg-[#181818] border-b border-[#2B2B2B] px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#252526] text-white"
                    : "text-[#888888] hover:text-[#CCCCCC] hover:bg-white/5"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[9px] px-1 py-[0.5px] rounded-full font-mono font-bold ${
                      tab.badge === "Pass"
                        ? "bg-[#2EA043] text-white"
                        : tab.badge === "Fail"
                        ? "bg-[#F14C4C] text-white"
                        : "bg-[#007ACC] text-white"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 text-[#888888]">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center hover:text-white transition-colors cursor-pointer"
            title={isMaximized ? "Restore size" : "Maximize drawer"}
          >
            <span
              className={`codicon ${
                isMaximized ? "codicon-chevron-down" : "codicon-chevron-up"
              } text-xs`}
            />
          </button>
          <button
            onClick={onClose}
            className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center hover:text-white transition-colors cursor-pointer"
            title="Close Drawer (Ctrl+J)"
          >
            <span className="codicon codicon-close text-xs" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden min-h-0">
        {activeTab === "tests" && <TestsDrawerTab runResult={runResult} />}
        {activeTab === "doubt-chat" && (
          <DoubtChatDrawerTab
            messages={chatMessages}
            contextChips={contextChips}
            tutoringTier={tutoringTier}
            setTutoringTier={setTutoringTier}
            isAnswering={isAnsweringChat}
            onSendMessage={onSendMessage}
            onRemoveChip={onRemoveChip}
          />
        )}
        {activeTab === "trace" && (
          <TraceDrawerTab runResult={runResult} onStepChange={onHighlightLine} />
        )}
      </div>
    </div>
  );
};
