import React, { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  onClick,
  ...rest
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (shouldReduceMotion || window.matchMedia("(pointer: coarse)").matches || !buttonRef.current) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const deltaX = (clientX - centerX) * 0.28;
      const deltaY = (clientY - centerY) * 0.28;
      setPosition({ x: Math.max(-8, Math.min(8, deltaX)), y: Math.max(-8, Math.min(8, deltaY)) });
    },
    [shouldReduceMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-7 py-3.5 text-base font-semibold",
  }[size];

  const variantClasses = {
    primary:
      "relative bg-white text-black font-semibold shadow-[0_0_24px_rgba(255,255,255,0.25)] hover:shadow-[0_0_36px_rgba(0,229,255,0.4)] border border-white/80 overflow-hidden group",
    secondary:
      "bg-[rgba(18,22,30,0.85)] hover:bg-[rgba(25,32,45,0.95)] text-[#F4F5F7] border border-white/10 hover:border-white/25 shadow-md",
    ghost:
      "bg-transparent hover:bg-white/5 text-[#A3A9B5] hover:text-white border border-transparent hover:border-white/10",
  }[variant];

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center gap-2.5 rounded-full select-none outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080B] transition-colors duration-200 cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
      {...(rest as any)}
    >
      {/* Light-sweep shine effect on primary */}
      {variant === "primary" && (
        <span
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
          }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
