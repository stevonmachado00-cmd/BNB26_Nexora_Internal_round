import React, { useRef, useCallback, useEffect } from "react";

interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  tier?: "subtle" | "default" | "elevated";
  enableSheen?: boolean;
  enableLiquid?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Glass: React.FC<GlassProps> = ({
  tier = "default",
  enableSheen = true,
  enableLiquid = false,
  className = "",
  children,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!enableSheen || !ref.current || window.matchMedia("(pointer: coarse)").matches) return;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ref.current.style.setProperty("--mouse-x", `${x}px`);
      ref.current.style.setProperty("--mouse-y", `${y}px`);
    });
  }, [enableSheen]);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const tierClasses = {
    subtle: "glass-subtle",
    default: "glass-default",
    elevated: "glass-elevated",
  }[tier];

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      className={`relative rounded-2xl ${tierClasses} ${
        enableSheen ? "cursor-sheen" : ""
      } ${className}`}
      style={
        enableLiquid
          ? ({
              backdropFilter: "url(#liquid-glass) blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
            } as React.CSSProperties)
          : undefined
      }
      {...rest}
    >
      {/* Specular 1px gradient border */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none p-[1px] -z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 60%, rgba(0,229,255,0.08) 100%)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />
      {children}
    </div>
  );
};
