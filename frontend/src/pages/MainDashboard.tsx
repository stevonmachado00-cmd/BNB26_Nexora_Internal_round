import React, { useState } from "react";
import { LearnerProfile } from "../types";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  ChevronRight,
  Clock,
  Award,
} from "lucide-react";

interface MainDashboardProps {
  learner: LearnerProfile;
  onStartLesson: (conceptId?: string) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  learner,
  onStartLesson,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Comprehensive Python Fundamentals catalog with minimalist visual symbols
  const fundamentals = [
    {
      id: "variables",
      title: "Variables & Data Types",
      description: "Memory assignment, naming conventions, integers, floats, strings, and type casting.",
      mastery: 91,
      status: "Mastered",
      statusColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/80",
      image: "/lessons/variables.jpg",
      level: "Foundational",
      duration: "18 mins",
    },
    {
      id: "conditions",
      title: "Conditions & Branching",
      description: "Boolean logic, if-elif-else statements, truthiness, and comparison operators.",
      mastery: 78,
      status: "Proficient",
      statusColor: "text-teal-400 bg-teal-950/60 border-teal-800/80",
      image: "/lessons/conditions.jpg",
      level: "Foundational",
      duration: "25 mins",
    },
    {
      id: "lists",
      title: "Lists & Sequences",
      description: "0-based indexing, negative indexes, slicing, iteration, and in-place list methods.",
      mastery: 73,
      status: "Proficient",
      statusColor: "text-teal-400 bg-teal-950/60 border-teal-800/80",
      image: "/lessons/lists.jpg",
      level: "Core Sequence",
      duration: "30 mins",
    },
    {
      id: "loops",
      title: "Loops & Iterations",
      description: "for loops, while loops, range boundaries, break/continue, and nested iteration.",
      mastery: 64,
      status: "Developing",
      statusColor: "text-amber-400 bg-amber-950/60 border-amber-800/80",
      image: "/lessons/loops.jpg",
      level: "Core Control",
      duration: "35 mins",
    },
    {
      id: "problem-solving",
      title: "Problem Solving Patterns",
      description: "Accumulator variables, boundary checks, flag patterns, and algorithmic traces.",
      mastery: 58,
      status: "Developing",
      statusColor: "text-amber-400 bg-amber-950/60 border-amber-800/80",
      image: "/lessons/problem-solving.jpg",
      level: "Algorithmic",
      duration: "40 mins",
    },
    {
      id: "functions",
      title: "Functions & Return Values",
      description: "Parameters, return statements vs print display, variable scope, and caller references.",
      mastery: 52,
      status: "Current Lesson",
      statusColor: "text-chart-2 bg-chart-2/15 border-chart-2/50 font-bold",
      image: "/lessons/functions.jpg",
      level: "Modular Logic",
      duration: "30 mins",
      isCurrent: true,
    },
    {
      id: "dictionaries",
      title: "Dictionaries & Mappings",
      description: "Key-value pairs, .get() safe access, dictionary updates, and key lookups.",
      mastery: 41,
      status: "Needs Practice",
      statusColor: "text-rose-400 bg-rose-950/60 border-rose-800/80",
      image: "/lessons/dictionaries.jpg",
      level: "Data Structures",
      duration: "35 mins",
    },
    {
      id: "error-handling",
      title: "Error Handling & Debugging",
      description: "Understanding stack traces, IndexError, KeyError, TypeError, and try-except blocks.",
      mastery: 35,
      status: "Up Next",
      statusColor: "text-muted-foreground bg-muted border-border",
      image: "/lessons/error-handling.jpg",
      level: "Reliability",
      duration: "25 mins",
    },
  ];

  // Coursera-style filter pills
  const filters = [
    { id: "all", label: "All Fundamentals" },
    { id: "current", label: "Current Focus" },
    { id: "mastered", label: "Mastered" },
    { id: "practice", label: "Needs Practice" },
  ];

  const filteredFundamentals = fundamentals.filter((item) => {
    if (selectedFilter === "current") return item.isCurrent;
    if (selectedFilter === "mastered") return item.mastery >= 75;
    if (selectedFilter === "practice") return item.mastery < 60;
    return true;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 text-foreground select-none">
      {/* 1. Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <span>Python Fundamentals</span>
          <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-chart-2/15 text-chart-2 border border-chart-2/30">
            Adaptive Path
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
          Master core programming concepts through cognitive root-cause diagnosis, mental model tracing, and concept transfer.
        </p>
      </div>

      {/* 2. Level Hero Banner */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-chart-1 font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Learner Progression Status</span>
            </div>
            
            <div className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-3">
              <span>Level {learner.level}: {learner.levelTitle}</span>
            </div>

            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              Your level increases when underlying concept understanding improves through verified transfer testing, not simply by repetitive question solving.
            </p>
          </div>

          <button
            onClick={() => onStartLesson("functions")}
            className="px-6 py-3.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] shrink-0"
          >
            <span>Continue Current Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Coursera-Style Filter Tabs */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-chart-2" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Learning Modules
            </h2>
            <span className="text-xs font-mono text-muted-foreground ml-2">
              ({filteredFundamentals.length} Modules)
            </span>
          </div>

          {/* Coursera-style pill category buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium font-sans whitespace-nowrap transition-all ${
                  selectedFilter === f.id
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Coursera-Style Square / Portrait Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-2">
          {filteredFundamentals.map((fund) => (
            <div
              key={fund.id}
              onClick={() => onStartLesson(fund.id)}
              className={`group rounded-2xl bg-card border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl ${
                fund.isCurrent
                  ? "border-chart-2 ring-1 ring-chart-2/40 shadow-lg shadow-chart-2/10"
                  : "border-border hover:border-foreground/30 hover:bg-card/90"
              }`}
            >
              {/* Top: 16:10 Aspect Visual Symbol Thumbnail */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60 border-b border-border">
                <img
                  src={fund.image}
                  alt={fund.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                
                {/* Status Pill Badge overlaid top-left */}
                <div className="absolute top-2.5 left-2.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-md border font-semibold ${fund.statusColor}`}>
                    {fund.status}
                  </span>
                </div>

                {/* Current lesson pulse badge top-right */}
                {fund.isCurrent && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-chart-2/40 text-[10px] font-mono text-chart-2 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-2 animate-ping" />
                    <span>ACTIVE</span>
                  </div>
                )}
              </div>

              {/* Bottom Card Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  {/* Category / Level Tag */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-chart-2" />
                      {fund.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {fund.duration}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-chart-2 transition-colors line-clamp-1 leading-snug">
                    {fund.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {fund.description}
                  </p>
                </div>

                {/* Card Button */}
                <div className="pt-2 border-t border-border">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartLesson(fund.id);
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      fund.isCurrent
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "bg-muted hover:bg-accent text-foreground border border-border"
                    }`}
                  >
                    <span>{fund.isCurrent ? "Continue Lesson" : "Practice Concept"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
