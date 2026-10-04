import React from "react";

interface ConnectorProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const Connector: React.FC<ConnectorProps> = ({ startX, startY, endX, endY }) => {
  if (startX <= 0 || endX <= 0) return null;

  // Compute bezier control points
  const deltaX = endX - startX;
  const cp1X = startX + deltaX * 0.5;
  const cp1Y = startY;
  const cp2X = startX + deltaX * 0.5;
  const cp2Y = endY;

  const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-30 w-full h-full"
      style={{ overflow: "visible" }}
    >
      <path
        d={pathData}
        fill="none"
        stroke="#007ACC"
        strokeWidth="1.5"
        strokeOpacity="0.45"
        strokeDasharray="3 3"
      />
      {/* Little dot at start and end */}
      <circle cx={startX} cy={startY} r="2.5" fill="#007ACC" fillOpacity="0.8" />
      <circle cx={endX} cy={endY} r="2.5" fill="#007ACC" fillOpacity="0.8" />
    </svg>
  );
};
