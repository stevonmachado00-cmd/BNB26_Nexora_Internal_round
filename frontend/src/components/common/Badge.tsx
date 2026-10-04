import React from "react";
import { ErrorClassification, MisconceptionStatus } from "../../types";

interface BadgeProps {
  type?: ErrorClassification | MisconceptionStatus | "difficulty" | "custom";
  variant?: "success" | "warning" | "error" | "info" | "neutral" | "purple";
  label: string;
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  type,
  variant,
  label,
  size = "md",
  className = "",
}) => {
  let style = "bg-[#141922] text-[#c9d1d9] border-[#262e3d]";

  if (variant) {
    switch (variant) {
      case "success":
        style = "bg-[#0c2013] text-[#3fb950] border-[#1e4a29]";
        break;
      case "warning":
        style = "bg-[#231b09] text-[#d29922] border-[#523f14]";
        break;
      case "error":
        style = "bg-[#261114] text-[#f85149] border-[#542227]";
        break;
      case "purple":
        style = "bg-[#171b26] text-[#c9d1d9] border-[#2e374a]";
        break;
      case "info":
        style = "bg-[#0e1b2e] text-[#58a6ff] border-[#1f3b60]";
        break;
      case "neutral":
        style = "bg-[#141922] text-[#8b949e] border-[#262e3d]";
        break;
    }
  } else if (type) {
    switch (type) {
      case "active":
        style = "bg-[#231b09] text-[#d29922] border-[#523f14]";
        break;
      case "recurring":
        style = "bg-[#261114] text-[#f85149] border-[#542227] font-semibold";
        break;
      case "resolved":
        style = "bg-[#0c2013] text-[#3fb950] border-[#1e4a29]";
        break;
      case "provisional":
        style = "bg-[#0e1b2e] text-[#58a6ff] border-[#1f3b60]";
        break;
      case "never-seen":
        style = "bg-[#141922] text-[#6e7681] border-[#21262d]";
        break;
      case "conceptual":
        style = "bg-[#231b09] text-[#d29922] border-[#523f14]";
        break;
      case "careless-slip":
        style = "bg-[#0e1b2e] text-[#58a6ff] border-[#1f3b60]";
        break;
      case "logical":
        style = "bg-[#171b26] text-[#c9d1d9] border-[#2e374a]";
        break;
      case "syntax":
        style = "bg-[#261114] text-[#f85149] border-[#542227]";
        break;
      case "runtime":
        style = "bg-[#261114] text-[#f85149] border-[#542227]";
        break;
    }
  }

  const sizeClasses = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border font-mono tracking-tight ${sizeClasses} ${style} ${className}`}
    >
      {label}
    </span>
  );
};

