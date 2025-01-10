"use client";

import { useEffect, useState } from "react";
import { useHeaderScroll } from "~/hooks/useHeaderScroll";
import { Progress } from "./ui/Progress";
import { cn } from "~/utils/cn";

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const isHeaderVisible = useHeaderScroll();

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={cn(
      "fixed top-16 left-0 w-full z-40 translate transition-all transition-400",
      !isHeaderVisible ? "-translate-y-16" : "translate-y-0"
    )}>
      <Progress 
        value={scrollProgress} 
        size="sm"
        variant="orange"
        className="opacity-60 hover:opacity-90 shadow-sm [&>div]:h-[2px]"
      />
    </div>
  );
}
