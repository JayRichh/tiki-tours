"use client";

import { MotionValue, motion } from "framer-motion";
import { ArrowRight, Globe, ScrollIcon, ChevronsDown, MouseIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Text } from "~/components/ui/Text";

interface HeroSectionProps {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  y: MotionValue<number>;
}

export function HeroSection({ opacity, scale, y }: HeroSectionProps) {
  return (
    <motion.div
      style={{ opacity, scale, y }}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-[80vh] justify-center overflow-hidden"
    >
      {/* Hero Content */}
      <div className="relative flex flex-col items-center">

        {/* Text Content */}
        <div className="relative text-center max-w-4xl mx-auto px-4">
       
          <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[800px] md:h-[800px] mx-auto">
            <Image
              src="/tikihero.png"
              alt="Tiki Hero"
              fill
              className="object-contain"
              priority
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-12 w-full text-center">
              <Text
                  variant="h4"
                  color="secondary"
                  className="text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed text-center pb-6"
                >
                  Adventure Planner
                </Text>

              <Text
                variant="body-lg"
                color="secondary"
                className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed text-center"
              >
                Plan your trips, relocations, and adventures with ease.<br></br> Track budgets, manage timelines, and
                organize your journey all in one place.
              </Text>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-full px-4 sm:px-0 mt-8">
                <Link href="/trips" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-4 text-lg font-medium flex items-center justify-center gap-3 rounded-xl
                      bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90
                      shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30
                      transition-all duration-300 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Start Planning
                    <motion.div
                      variants={{
                        initial: { rotate: 0 },
                        hover: { rotate: -45 },
                      }}
                      initial="initial"
                      whileHover="hover"
                      className="transition-transform duration-300"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </motion.button>
                </Link>

                <Link href="/about" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-4 text-lg font-medium flex items-center justify-center gap-3 rounded-xl
                      bg-background/60 backdrop-blur-sm border border-border/50 hover:bg-background/80
                      shadow-lg hover:shadow-xl transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border"
                  >
                    Learn More
                    <ArrowRight className="w-6 h-6" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-col items-center gap-2 mt-24"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <MouseIcon className="w-6 h-6 text-foreground/40" />
          </motion.div>
          <ChevronsDown className="w-5 h-5 text-foreground/40 animate-bounce" />
        </motion.div>
      </div>
    </motion.div>
  );
}
