"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, DollarSign, Map, Clock, Bell, CheckSquare } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { FeaturesSceneComponent } from "~/app/examples/3d/components/FeaturesSceneComponent";
import { Text } from "~/components/ui/Text";

interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
  details: {
    title: string;
    description: string;
  }[];
}

const features: Feature[] = [
  {
    title: "Timeline & Activities",
    description: "Visual planning tools for organizing your perfect trip",
    icon: Calendar,
    details: [
      {
        title: "Visual Timeline",
        description: "Interactive timeline view of your entire trip"
      },
      {
        title: "Activity Planning",
        description: "Drag & drop interface for organizing activities"
      },
      {
        title: "Smart Reminders",
        description: "Automated notifications for upcoming events"
      }
    ]
  },
  {
    title: "Budget Management",
    description: "Track expenses and manage your travel budget",
    icon: DollarSign,
    details: [
      {
        title: "Real-time Tracking",
        description: "Monitor expenses as you travel"
      },
      {
        title: "Budget Analytics",
        description: "Visual breakdowns of your spending"
      },
      {
        title: "Cost Forecasting",
        description: "Predict expenses for better planning"
      }
    ]
  },
  {
    title: "Travel Tools",
    description: "Essential tools for seamless trip organization",
    icon: Map,
    details: [
      {
        title: "Checklists",
        description: "Custom lists for every travel need"
      },
      {
        title: "Progress Tracking",
        description: "Monitor your trip preparation status"
      },
      {
        title: "Document Storage",
        description: "Keep all travel documents organized"
      }
    ]
  }
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity }}
      className="relative w-full"
    >
      <div className="group relative h-full overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(28,85%,35%)]/5 via-transparent to-[hsl(35,85%,45%)]/5 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_8px)]" />
        
        {/* Content */}
        <div className="relative p-8 md:p-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-[hsl(28,85%,35%)]/10 group-hover:bg-[hsl(28,85%,35%)]/20 transition-colors">
              <feature.icon className="h-7 w-7 text-[hsl(28,85%,35%)]" />
            </div>
            <Text variant="h3" className="text-2xl font-semibold bg-gradient-to-r from-[hsl(28,85%,35%)] to-[hsl(35,85%,45%)] bg-clip-text text-transparent">
              {feature.title}
            </Text>
          </div>

          <Text className="mb-8 text-lg text-foreground/80">
            {feature.description}
          </Text>

          <div className="space-y-6">
            {feature.details.map((detail, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group/item"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-[hsl(28,85%,35%)]/5 group-hover/item:bg-[hsl(28,85%,35%)]/10 transition-colors">
                    {i === 0 ? <Clock className="w-5 h-5 text-[hsl(28,85%,35%)]" /> :
                     i === 1 ? <Bell className="w-5 h-5 text-[hsl(28,85%,35%)]" /> :
                     <CheckSquare className="w-5 h-5 text-[hsl(28,85%,35%)]" />}
                  </div>
                  <div>
                    <Text className="font-medium text-foreground/90 mb-1">
                      {detail.title}
                    </Text>
                    <Text className="text-foreground/70 group-hover/item:text-foreground/80 transition-colors">
                      {detail.description}
                    </Text>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  return (
    <section 
      className="w-full relative overflow-hidden min-h-screen" 
      ref={containerRef}
    >


      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.03)_120%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.01)_0px,rgba(255,255,255,0.01)_1px,transparent_1px,transparent_12px)]" />

      <div className="relative space-y-24 w-full mx-auto px-6 md:px-8 lg:px-10 max-w-7xl py-24 mt-24">
        <motion.div 
          style={{ opacity, scale }}
          className="space-y-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-[hsl(28,85%,35%)] to-[hsl(35,85%,45%)] bg-clip-text text-transparent [text-wrap:balance]">
            Travel Planning Tools
          </h1>
          <Text variant="body-lg" className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto">
            Everything you need to organize trips, manage budgets, and track travel plans in one place
          </Text>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 relative">
          {/* Hover Effect Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1
              }}
            >
              <FeatureCard 
                feature={feature} 
                index={index} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
