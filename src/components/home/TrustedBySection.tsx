"use client";

import { motion, useAnimation } from "framer-motion";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

interface Brand {
  name: string;
  domain: string;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const brands: Brand[] = [
  // Travel Tech & Booking
  { name: "Hopper", domain: "hopper.com" },
  { name: "GetYourGuide", domain: "getyourguide.com" },
  { name: "Klook", domain: "klook.com" },
  { name: "Viator", domain: "viator.com" },
  { name: "TripActions", domain: "tripactions.com" },
  // Hospitality
  { name: "Selina", domain: "selina.com" },
  { name: "CitizenM", domain: "citizenm.com" },
  { name: "Sonder", domain: "sonder.com" },
  { name: "Kimpton", domain: "ihg.com" },
  { name: "Freehand", domain: "freehandhotels.com" },
  // Transportation
  { name: "FlixBus", domain: "flixbus.com" },
  { name: "Blade", domain: "blade.com" },
  { name: "Wheels Up", domain: "wheelsup.com" },
  // Travel Services
  { name: "TravelPerk", domain: "travelperk.com" },
  { name: "TripIt", domain: "tripit.com" },
  { name: "Hoteltonight", domain: "hoteltonight.com" },
  { name: "Peek", domain: "peek.com" },
  { name: "TourRadar", domain: "tourradar.com" },
  { name: "Omio", domain: "omio.com" },
  { name: "Turo", domain: "turo.com" },
  // New additions
  { name: "Airbnb", domain: "airbnb.com" },
  { name: "Expedia", domain: "expedia.com" },
  { name: "Booking", domain: "booking.com" },
  { name: "Kayak", domain: "kayak.com" },
  { name: "Skyscanner", domain: "skyscanner.com" },
];

function ScrollingRow({
  reverse = false,
  speed = 50, // pixels per second
}: {
  reverse?: boolean;
  speed?: number;
}) {
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());
  const [shuffledBrands, setShuffledBrands] = useState<Brand[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    setShuffledBrands(shuffleArray([...brands]));
  }, []);

  // Duplicate brands only twice for seamless looping
  const displayBrands = [...shuffledBrands, ...shuffledBrands];

  // Handle image load errors
  const handleImageError = (domain: string) => {
    setFailedLogos((prev) => new Set([...prev, domain]));
  };

  // Calculate the width of one set of brands
  useEffect(() => {
    if (containerRef.current) {
      const singleSetWidth = containerRef.current.scrollWidth / 2;
      setContentWidth(singleSetWidth);
    }
  }, [displayBrands]);

  // Start the scrolling animation
  useEffect(() => {
    if (contentWidth === 0) return;

    const duration = contentWidth / speed; // Duration based on speed

    controls.start({
      x: reverse ? -contentWidth : -contentWidth,
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          duration: duration,
        },
      },
    });
  }, [controls, contentWidth, speed, reverse]);

  // Pause the animation on hover
  const handleMouseEnter = () => {
    controls.stop();
  };

  // Resume the animation when not hovered
  const handleMouseLeave = () => {
    if (contentWidth === 0) return;
    const duration = contentWidth / speed;
    controls.start({
      x: reverse ? -contentWidth : -contentWidth,
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          duration: duration,
        },
      },
    });
  };

  return (
    <motion.div
      ref={containerRef}
      className="flex gap-8"
      style={{
        display: "flex",
        width: "max-content",
      }}
      animate={controls}
      initial={{ x: 0 }}
      role="list"
      aria-label="Trusted brands carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayBrands.map((brand, index) => (
        <div
          key={`${brand.domain}-${index}`}
          className="flex items-center justify-center bg-card/95 backdrop-blur-sm border border-zinc-200/20 hover:border-primary/50 rounded-lg p-6 shadow-sm min-w-[240px] h-36 transition-colors group"
          role="listitem"
        >
          <div className="w-full h-full relative flex-shrink-0 rounded-lg group-hover:opacity-80 transition-opacity">
            {failedLogos.has(brand.domain) ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-lg font-semibold text-primary/80 group-hover:text-primary transition-colors">
                  {brand.name}
                </span>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center relative">
                <div className="w-full max-w-[220px] h-[120px] relative">
                  <Image
                    src={`https://logo.clearbit.com/${brand.domain}`}
                    alt={`${brand.name} logo`}
                    fill
                    sizes="220px"
                    className="object-contain"
                    onError={() => handleImageError(brand.domain)}
                    unoptimized
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export function TrustedBySection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full relative bg-gradient-to-br from-background/50 to-background/30 backdrop-blur py-12 border-y border-border/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight font-bold bg-gradient-to-r from-[hsl(28,85%,35%)] to-[hsl(35,85%,45%)] bg-clip-text text-transparent">
          Trusted By Leading Travel Brands
        </h2>
      </div>
      <div className="space-y-12">
        <div className="relative h-auto overflow-hidden">
          <ScrollingRow />
        </div>
        <div className="relative h-auto overflow-hidden">
          <ScrollingRow reverse speed={30} />
        </div>
      </div>
    </motion.div>
  );
}
