import React, { useState } from "react";
import { LearnerProfile } from "../../types";

interface TitleBarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  learner?: LearnerProfile;
  onOpenCommandPalette: () => void;
  onGenerateNewQuestion: () => void;
  floatingXpToast?: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  currentPath,
  onNavigate,
  learner,
  onOpenCommandPalette,
  onGenerateNewQuestion,
  floatingXpToast = false,
}) => {
  const [showLevelPopover, setShowLevelPopover] = useState(false);

  const navMenus = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Learn", path: "/learn" },
    { label: "Profile", path: "/profile" },
    { label: "Settings", path: "/settings" },
  ];

  const level = learner?.level || 8;
  const xpPercent = 67; // 67%
  const streakDays = 5;
  const xpToNext = 330;
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * xpPercent) / 100;

  return (
    <header className="h-[40px] bg-[#181818] border-b border-[#2B2B2B] flex items-center justify-between px-3 select-none text-[13px] text-[#CCCCCC] z-40 shrink-0">
      {/* Left: Brand mark + Compact Nav Menus */}
      <div className="flex items-center gap-1 min-w-0">
        <div className="flex items-center gap-1.5 mr-2">
          <div className="w-5 h-5 rounded bg-[#007ACC] flex items-center justify-center text-white font-black text-[10px] tracking-tighter">
            RE
          </div>
          <span className="font-semibold text-white tracking-tight text-xs hidden md:inline">
            Re:Learn
          </span>
        </div>

        <nav className="flex items-center" aria-label="Workbench navigation">
          {navMenus.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`px-2.5 py-1 rounded text-[12px] font-normal transition-colors cursor-pointer ${
                  isActive
                    ? "text-white bg-white/10 font-medium"
                    : "text-[#AAAAAA] hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Center: Command Center Pill */}
      <div className="flex-1 max-w-[500px] mx-4 hidden sm:flex items-center justify-center">
        <button
          onClick={onOpenCommandPalette}
          className="w-full max-w-[420px] h-[26px] bg-[#222222] hover:bg-[#282828] border border-[#333333] hover:border-[#444444] rounded-[5px] px-2.5 flex items-center justify-between text-xs text-[#8E8E8E] transition-all cursor-pointer group shadow-inner"
          title="Search commands (Ctrl+K or Ctrl+Shift+P)"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="codicon codicon-search text-[12px] text-[#888888] group-hover:text-white transition-colors" />
            <span className="truncate text-[#CCCCCC] group-hover:text-white transition-colors text-[12px]">
              Functions & Return Values
            </span>
          </div>

          <kbd className="hidden lg:flex items-center gap-0.5 text-[10px] text-[#777777] bg-[#181818] px-1.5 py-0.5 rounded border border-[#333333]">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right: XP Ring + Popover + Avatar */}
      <div className="flex items-center gap-2 shrink-0 relative">
        {/* Floating +40 XP animation */}
        {floatingXpToast && (
          <div className="absolute -top-3 left-0 text-[#2EA043] font-bold text-xs font-mono animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-none">
            +40 XP
          </div>
        )}

        {/* Level Ring with Tap Popover */}
        <div className="relative">
          <button
            onClick={() => setShowLevelPopover(!showLevelPopover)}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 transition-colors cursor-pointer group"
            title="View Level & Streak"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                <circle
                  cx="10"
                  cy="10"
                  r={radius}
                  className="stroke-[#333333]"
                  strokeWidth="2.2"
                  fill="transparent"
                />
                <circle
                  cx="10"
                  cy="10"
                  r={radius}
                  className="stroke-[#007ACC] transition-all duration-500 ease-out"
                  strokeWidth="2.2"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-[8px] font-bold text-white">
                {level}
              </span>
            </div>

            <span className="text-[11px] font-medium text-white group-hover:text-[#007ACC] transition-colors hidden sm:inline">
              Lvl {level}
            </span>
          </button>

          {/* Popover with Level, XP to next level, and today's streak */}
          {showLevelPopover && (
            <div
              className="wb-glass absolute right-0 top-9 w-60 rounded-[8px] p-3 text-xs text-[#CCCCCC] font-sans shadow-xl z-50 border border-[#3C3C3C] space-y-2 animate-in fade-in duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-1 border-b border-[#333333]">
                <span className="font-semibold text-white">Level {level} Explorer</span>
                <span className="text-[11px] text-[#007ACC] font-mono font-bold">
                  {xpPercent}%
                </span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between text-[#888888]">
                  <span>XP to Level {level + 1}:</span>
                  <span className="text-white font-mono">{xpToNext} XP</span>
                </div>
                <div className="flex justify-between text-[#888888]">
                  <span>Today&apos;s Practice Streak:</span>
                  <span className="text-[#CCA700] font-mono font-bold">
                    🔥 {streakDays} days
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generate New Question */}
        <button
          onClick={onGenerateNewQuestion}
          className="w-7 h-7 rounded flex items-center justify-center text-[#888888] hover:text-white hover:bg-white/10 transition-colors"
          title="New question (F8)"
          aria-label="Generate new question"
        >
          <span className="codicon codicon-sparkle text-xs text-[#3794FF]" />
        </button>

        {/* Avatar */}
        <div
          className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#007ACC] to-[#3794FF] text-white font-semibold text-[11px] flex items-center justify-center shadow-sm ml-1"
          title={learner?.name || "Learner"}
        >
          {learner?.name?.charAt(0) || "A"}
        </div>
      </div>
    </header>
  );
};
