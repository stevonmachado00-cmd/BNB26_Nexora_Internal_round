import React from "react";

interface ProgressBarProps {
  value: number; // 0 to 100
  color?: "emerald" | "indigo" | "amber" | "rose" | "purple";
  height?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = "indigo",
  height = "md",
  showLabel = false,
  className = "",
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const heightClasses = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2.5",
  }[height];

  const colorClasses = {
    emerald: "bg-[#2ea043]",
    indigo: "bg-[#4a5a75]",
    amber: "bg-[#d29922]",
    rose: "bg-[#f85149]",
    purple: "bg-[#8b949e]",
  }[color];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-[11px] mb-1 text-[#8b949e] font-mono">
          <span>Progress</span>
          <span className="text-[#f0f6fc] font-semibold">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-[#12161f] rounded-sm overflow-hidden border border-[#212734] ${heightClasses}`}>
        <div
          className={`h-full rounded-sm transition-all duration-500 ease-out ${colorClasses}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

