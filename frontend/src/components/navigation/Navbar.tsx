import React, { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import {
  Code2,
  LayoutDashboard,
  User,
  Settings,
  Sparkles,
  Home,
} from "lucide-react";
import { LearnerProfile } from "../../types";
import { Glass } from "../ui/Glass";

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  learner: LearnerProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  learner,
}) => {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", path: "/", icon: Home },
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Learn", path: "/learn", icon: Code2, badge: "Active" },
    { label: "Profile", path: "/profile", icon: User },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  // Calculate circular SVG progress metrics for the XP ring
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (learner.masteryPercentage / 100) * circumference;

  return (
    <>
      <header
        className={`fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-300 ${
          isScrolled ? "scale-[0.98]" : "scale-100"
        }`}
      >
        <Glass
          tier={isScrolled ? "elevated" : "default"}
          className="rounded-full px-3.5 sm:px-6 py-2.5 flex items-center justify-between border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.65)]"
        >
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate("/")}
            className="flex items-center gap-2 text-left group cursor-pointer outline-none"
          >
            <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-extrabold text-xs font-mono shadow-sm group-hover:scale-105 transition-transform">
              RE
            </div>
            <span className="font-extrabold font-mono text-white text-sm tracking-wider hidden sm:inline">
              RE:LEARN
            </span>
          </button>

          {/* Navigation Links with Sliding Layout Pill */}
          <nav
            onMouseLeave={() => setHoveredPath(null)}
            className="flex items-center gap-1 sm:gap-1.5 relative"
          >
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (item.path === "/learn" && currentPath.startsWith("/learn"));

              return (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.path)}
                  onMouseEnter={() => setHoveredPath(item.path)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer select-none outline-none focus-visible:ring-1 focus-visible:ring-[#00E5FF] ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-[#A3A9B5] hover:text-white"
                  }`}
                >
                  {/* Sliding active pill indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full bg-white/10 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 340,
                        damping: 28,
                      }}
                    />
                  )}

                  {/* Hover highlight tracking cursor */}
                  {hoveredPath === item.path && !isActive && (
                    <motion.div
                      layoutId="hoverNavPill"
                      className="absolute inset-0 rounded-full bg-white/5 -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 26,
                      }}
                    />
                  )}

                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.badge && isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Level Pill with Animated XP Ring & Profile Avatar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("/dashboard")}
              className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono transition-colors cursor-pointer"
            >
              {/* Animated Mini Circular XP Ring */}
              <div className="relative w-5 h-5 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r={radius}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r={radius}
                    stroke="#00E5FF"
                    strokeWidth="2.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <Sparkles className="w-2.5 h-2.5 text-[#00E5FF] absolute" />
              </div>

              <span className="text-white font-bold">
                Lvl {learner.level}
              </span>
              <span className="text-[#6B7280] hidden sm:inline">&bull;</span>
              <span className="text-[#00E5FF] font-semibold hidden sm:inline">
                {learner.masteryPercentage}%
              </span>
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => onNavigate("/profile")}
              className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#00E5FF] text-black font-bold text-xs flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
              title="Open Profile"
            >
              {learner.name.charAt(0)}
            </button>
          </div>
        </Glass>

        {/* Thin Scroll Progress Indicator Line under Navbar */}
        <motion.div
          className="h-[2px] bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] rounded-full mx-6 mt-1 origin-left"
          style={{ scaleX: scrollYProgress }}
        />
      </header>

      {/* Spacer to prevent content from jumping behind floating navbar */}
      <div className="h-20" />
    </>
  );
};
