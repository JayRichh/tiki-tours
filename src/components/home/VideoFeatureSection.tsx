"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Suspense, useRef, useState } from "react";
import { Spinner } from "../ui/Spinner";

export function VideoFeatureSection() {
  const videoRef = useRef<HTMLDivElement>(null); // Reference for useInView
  const isInView = useInView(videoRef, { once: true, margin: "0px 0px -100px 0px" });

  // Framer Motion scroll animations
  const { scrollYProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  return (
    <section className="w-full relative overflow-hidden min-h-screen">
      <div className="relative w-full mx-auto px-6 md:px-8 lg:px-10 max-w-7xl py-24 mt-24">
        <motion.div
          style={{ opacity, scale }}
          className="space-y-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-[hsl(28,85%,35%)] to-[hsl(35,85%,45%)] bg-clip-text text-transparent [text-wrap:balance]">
            Your Trip Overview
          </h1>
        </motion.div>

        <div ref={videoRef} className="mt-12 relative flex items-center justify-center">
          {isInView && (
            <Suspense fallback={<VideoSkeleton />}>
              <VideoPlayer
                
                src="https://player.vimeo.com/video/1045638761?badge=0&autopause=1&player_id=0&app_id=58479&background=1&muted=1&autoplay=1&dnt=1"

                title="Trip Overview Video"
              />
            </Suspense>
          )}
        </div>
      </div>
    </section>
  );
}

// Video Skeleton for loading state
function VideoSkeleton() {
  return (
    <div className="relative w-full h-[400px] bg-gray-800 flex items-center justify-center rounded-3xl shadow-lg">
      <Spinner className="w-12 h-12" />
    </div>
  );
}

// Reusable VideoPlayer Component
function VideoPlayer({ src, title }: { src: string; title: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full relative"
    >
      <div className="relative pt-[56.25%] overflow-hidden rounded-3xl shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-1"></div>
        <div className="absolute inset-0 bg-black rounded-3xl overflow-hidden">
          <iframe
            ref={iframeRef}
            onLoad={() => setIsLoading(false)}
            src={src}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            className={`absolute top-0 left-0 w-full h-full rounded-3xl transition-opacity duration-500 z-0 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            title={title}
            loading="lazy"
            aria-label={title}
          />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <Spinner className="w-12 h-12" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}