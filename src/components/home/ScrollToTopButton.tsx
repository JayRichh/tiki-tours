"use client";

import { motion, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";

import { useEffect, useState } from "react";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsVisible(latest > 400);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      whileHover={{ scale: 1.1 }}
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 rounded-full bg-primary/90 p-3 text-primary-foreground shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-primary ${
        isVisible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </motion.button>
  );
}
