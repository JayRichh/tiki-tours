"use client";

import { CSSProperties } from "react";

import { cn } from "~/utils/cn";

export interface GradientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const GradientBackground = ({ className, children }: GradientBackgroundProps) => {
  return (
    <div className={cn("relative w-full h-full", className)}>
      <div
        className="fixed inset-0 w-full min-h-screen"
        style={{
          backgroundImage: "url('/tikibg.jpg')",
          backgroundSize: "50% auto",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat",
          filter: "brightness(0.6) contrast(0.7) opacity(0.15)",
          mixBlendMode: "color-burn",
        }}
      />
      <div className="absolute inset-0 bg-background/80" />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};
