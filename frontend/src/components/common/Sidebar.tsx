import React from "react";
import {
  LayoutDashboard,
  Code2,
  TrendingUp,
  BrainCircuit,
  History,
  User,
  Settings,
  Target,
  X,
  Layers,
} from "lucide-react";
import { LearnerProfile } from "../../types";

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  learner: LearnerProfile;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  learner,
  isMobileOpen,
  onToggleMobile,
}) => {
  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Learn", path: "/learn", icon: Code2, badge: "Targeted" },
    { label: "Progress", path: "/progress", icon: TrendingUp },
    {
      label: "Misconceptions",
      path: "/misconceptions",
      icon: BrainCircuit,
      badgeCount: learner.activeMisconceptionsCount,
    },
    { label: "History", path: "/history", icon: History },
  ];

  const secondaryNavItems = [
    { label: "Profile", path: "/profile", icon: User },
    { label: "Settings", path: "/profile", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0c1017] border-r border-[#212734] text-[#8b949e] w-64 select-none">
      {/* Brand Header */}
      <div className="px-4 py-3.5 border-b border-[#212734] flex items-center justify-between">
        <button
          onClick={() => onNavigate("/")}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-7 h-7 rounded bg-[#1b2230] border border-[#2f3a4e] flex items-center justify-center text-[#f0f6fc] font-mono font-bold text-xs tracking-tight transition-colors group-hover:border-[#42526e]">
            RE
          </div>
          <div>
            <div className="font-bold tracking-wider text-[#f0f6fc] text-xs font-mono flex items-center gap-1.5">
              RE:LEARN
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-1 py-0.2 rounded bg-[#141922] text-[#8b949e] border border-[#262e3d]">
                v1.0
              </span>
            </div>
            <div className="text-[10px] text-[#6e7681] font-mono">Cognitive Tutor Engine</div>
          </div>
        </button>

        {isMobileOpen && (
          <button
            onClick={onToggleMobile}
            className="md:hidden text-[#8b949e] hover:text-[#f0f6fc] p-1 rounded hover:bg-[#161c26]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto custom-scrollbar">
        <div className="px-2.5 pt-1 pb-1.5 text-[10px] font-mono uppercase tracking-widest text-[#6e7681] font-semibold">
          Platform
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.path ||
            (item.path === "/learn" && currentPath.startsWith("/learn"));

          return (
            <button
              key={item.path}
              onClick={() => {
                onNavigate(item.path);
                if (isMobileOpen) onToggleMobile();
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[#18202d] text-[#f0f6fc] border border-[#2d384c] font-semibold"
                  : "text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#121721] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-[#f0f6fc]" : "text-[#6e7681]"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#12161f] text-[#8b949e] border border-[#212734] font-mono">
                  {item.badge}
                </span>
              )}

              {typeof item.badgeCount === "number" && item.badgeCount > 0 && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#231b09] text-[#d29922] border border-[#523f14]">
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}

        {/* Target Goal Panel */}
        <div className="pt-4 pb-1">
          <div className="px-2.5 pb-1.5 text-[10px] font-mono uppercase tracking-widest text-[#6e7681] font-semibold flex items-center gap-1.5">
            <Target className="w-3 h-3 text-[#8b949e]" />
            Target Goal
          </div>
          <div className="mx-1 p-2 rounded bg-[#090d13] border border-[#1e2533] text-xs">
            <div className="font-medium text-[#c9d1d9] text-[11px] leading-tight">{learner.goal}</div>
            <div className="text-[10px] text-[#6e7681] font-mono mt-1 flex items-center justify-between">
              <span>Python Fundamentals</span>
              <span className="text-[#3fb950]">On Track</span>
            </div>
          </div>
        </div>

        {/* Secondary Links */}
        <div className="pt-3 pb-1">
          <div className="px-2.5 pb-1.5 text-[10px] font-mono uppercase tracking-widest text-[#6e7681] font-semibold">
            Preferences
          </div>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.path);
                  if (isMobileOpen) onToggleMobile();
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#18202d] text-[#f0f6fc] border border-[#2d384c]"
                    : "text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#121721] border border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#6e7681]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Learner Mastery Level Card */}
      <div className="p-3 border-t border-[#212734] bg-[#090d13]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-bold text-[#f0f6fc] font-mono text-[11px] flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#8b949e]" />
            LVL {learner.level}
          </span>
          <span className="text-[#8b949e] text-[10px] font-mono">
            {learner.masteryPercentage}% Mastery
          </span>
        </div>

        {/* Mastery bar */}
        <div className="w-full bg-[#141922] h-1.5 rounded-sm overflow-hidden border border-[#212734] mb-1.5">
          <div
            className="h-full bg-[#388bfd] rounded-sm transition-all duration-500"
            style={{ width: `${learner.masteryPercentage}%` }}
          />
        </div>

        <div className="text-[9px] text-[#6e7681] font-mono leading-tight">
          Advances via cognitive concept transfer.
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80"
            onClick={onToggleMobile}
          />
          <div className="relative z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

