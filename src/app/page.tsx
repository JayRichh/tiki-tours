"use client";

import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { FeaturesSection } from "~/components/home/FeaturesSection";
import { HeroSection } from "~/components/home/HeroSection";
import { ScrollToTopButton } from "~/components/home/ScrollToTopButton";
import { TestimonialsSection } from "~/components/home/TestimonialsSection";
import { TrustedBySection } from "~/components/home/TrustedBySection";
import { Container } from "~/components/ui/Container";

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 10]);

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full relative min-h-screen pb-12">
      <section className="w-full sm:-mt-24 flex justify-center">
        <Container className="px-6 md:px-8 lg:px-10 max-w-7xl">
          <HeroSection opacity={opacity} scale={scale} y={y} />
        </Container>
      </section>

      <section className="w-full py-10 flex justify-center">
        <TrustedBySection />
      </section>
      <ScrollToTopButton />

      <section className="w-full py-6 flex justify-center">
        <Container className="px-6 md:px-8 lg:px-10 max-w-7xl">
          <FeaturesSection />
        </Container>
      </section>


      <section className="w-full py-10 flex justify-center">
        <Container className="px-6 md:px-8 lg:px-10 max-w-7xl">
          <TestimonialsSection />
        </Container>
      </section>
    </div>
  );
}
