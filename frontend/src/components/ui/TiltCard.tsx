import React, { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  maxTilt?: number;
  glowColor?: string;
  className?: string;
  children: React.ReactNode;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  maxTilt = 6,
  glowColor = "rgba(0, 229, 255, 0.15)",
  className = "",
  children,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || window.matchMedia("(pointer: coarse)").matches || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setRotateX((0.5 - y) * (maxTilt * 2));
      setRotateY((x - 0.5) * (maxTilt * 2));
      setSheenPos({ x: x * 100, y: y * 100 });
    },
    [maxTilt, shouldReduceMotion]
  );

  const handlePointerLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      className={`[perspective:1200px] ${className}`}
      {...rest}
    >
      <motion.div
        animate={{
          rotateX,
          rotateY,
          scale: isHovered ? 1.01 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
        }}
        className="w-full h-full relative rounded-2xl transition-shadow duration-300"
        style={{
          boxShadow: isHovered
            ? `0 20px 48px -12px rgba(0,0,0,0.8), 0 0 32px -4px ${glowColor}`
            : "0 10px 30px -10px rgba(0,0,0,0.6)",
        }}
      >
        {/* Specular sheen overlay */}
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300 z-20"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(400px circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(255,255,255,0.08), transparent 60%)`,
          }}
        />
        {children}
      </motion.div>
    </div>
  );
};
