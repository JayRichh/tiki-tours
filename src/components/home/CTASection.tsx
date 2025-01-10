"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import Link from "next/link";

import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { Text } from "../ui/Text";

export function CTASection() {
  return (
    <Container className="relative px-6 md:px-8 lg:px-10 max-w-7xl py-12 mb-10">
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(28,85%,35%)]/5 via-transparent to-[hsl(35,85%,45%)]/5" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_8px)]" />

        <div className="relative rounded-3xl p-8 md:p-12 lg:p-16 border border-border/50 backdrop-blur-sm">
          <motion.div
            className="flex flex-col items-center text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-[hsl(28,85%,35%)] to-[hsl(35,85%,45%)] bg-clip-text text-transparent">
              Ready to Start Your Adventure?
            </h2>
            <Text
              variant="body-lg"
              color="secondary"
              className="text-lg sm:text-xl max-w-2xl text-center"
            >
              Powerful tools for organizing trips, managing timelines, and tracking expenses - all
              in one place.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/trips">
                <Button
                  size="lg"
                  className="px-10 py-5 text-lg font-medium bg-[#B0703C] text-primary-foreground hover:bg-[#B0703C]/90 rounded-full"
                >
                  Start Planning Now
                  <span className="ml-2 text-[22px] leading-none relative top-[1px]">↗</span>
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10 py-5 text-lg font-medium border-2 rounded-full"
                >
                  View Sample Trips
                  <span className="ml-2 text-[22px] leading-none relative top-[1px]">↗</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Container>
  );
}
