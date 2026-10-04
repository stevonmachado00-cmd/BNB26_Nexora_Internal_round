import React from "react";
import { EditorTabId } from "../state/workbenchMachine";

interface TabsBarProps {
  openTabs: EditorTabId[];
  activeTab: EditorTabId;
  onSelectTab: (tab: EditorTabId) => void;
  onCloseTab: (tab: EditorTabId) => void;
  isDirty?: boolean;
}

export const TabsBar: React.FC<TabsBarProps> = ({
  openTabs,
  activeTab,
  onSelectTab,
  onCloseTab,
  isDirty = false,
}) => {
  // If only solution.py is open and reassessment isn't, we can render a very slim bar or single tab
  return (
    <div className="h-[32px] bg-[#181818] border-b border-[#2B2B2B] flex items-center px-2 select-none shrink-0 overflow-x-auto scrollbar-none">
      {openTabs.map((tabId) => {
        const isActive = activeTab === tabId;
        const isSolution = tabId === "solution.py";
        const label = isSolution ? "solution.py" : "Practice";
        const icon = isSolution ? "codicon-file-code text-[#CCA700]" : "codicon-mortar-board text-[#3794FF]";

        return (
          <div
            key={tabId}
            onClick={() => onSelectTab(tabId)}
            className={`group relative flex items-center h-[31px] px-3 text-xs border-r border-[#2B2B2B] cursor-pointer transition-colors ${
              isActive
                ? "bg-[#1F1F1F] text-white font-medium"
                : "bg-[#181818] text-[#888888] hover:text-[#CCCCCC]"
            }`}
          >
            {isActive && (
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#007ACC]" />
            )}

            <span className={`codicon ${icon} text-xs mr-2`} />
            <span>{label}</span>

            {isSolution && isDirty && (
              <span className="w-1.5 h-1.5 rounded-full bg-white ml-2 opacity-80" />
            )}

            {!isSolution && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tabId);
                }}
                className="w-4 h-4 ml-2 rounded hover:bg-white/10 flex items-center justify-center text-[#888888] hover:text-white"
                title="Close tab"
              >
                <span className="codicon codicon-close text-[10px]" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
