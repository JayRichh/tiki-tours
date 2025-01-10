"use client";

import { useScroll } from "framer-motion";

import { useEffect, useRef } from "react";

import { FeaturesScene } from "../scenes/FeaturesScene";

interface FeaturesSceneComponentProps {
  className?: string;
}

export function FeaturesSceneComponent({ className }: FeaturesSceneComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<FeaturesScene | null>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    if (containerRef.current && !sceneRef.current) {
      // Create scene
      sceneRef.current = new FeaturesScene(containerRef.current);

      // Handle scroll updates
      const updateScroll = (latest: number) => {
        if (sceneRef.current) {
          sceneRef.current.updateScroll(latest);
        }
      };

      // Handle resize
      const handleResize = () => {
        if (containerRef.current) {
          containerRef.current.style.width = `${window.innerWidth}px`;
          containerRef.current.style.height = `${window.innerHeight}px`;
        }
      };

      // Initial size
      handleResize();

      // Add listeners
      window.addEventListener("resize", handleResize);
      const unsubscribeScroll = scrollYProgress.on("change", updateScroll);

      return () => {
        window.removeEventListener("resize", handleResize);
        unsubscribeScroll();
        if (sceneRef.current) {
          sceneRef.current.dispose();
          sceneRef.current = null;
        }
      };
    }
  }, [scrollYProgress]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "auto",
        zIndex: 0,
        overflow: "hidden",
      }}
    />
  );
}
