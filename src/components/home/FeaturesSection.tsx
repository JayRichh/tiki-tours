"use client";

import { motion } from "framer-motion";
import { Calendar, Globe, DollarSign, Map, CheckSquare, Clock } from "lucide-react";

import Link from "next/link";

import { Text } from "~/components/ui/Text";

type Feature = {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: readonly string[];
  badges: readonly string[];
  theme: string;
};

const features: Feature[] = [
  {
    href: "/trips",
    title: "Trip Planning",
    description:
      "Create detailed trip plans with timelines, activities, and checklists. Keep everything organized in one place.",
    icon: Calendar,
    features: [
      "Timeline management",
      "Activity planning",
      "Custom checklists",
      "Travel documents",
    ],
    badges: ["Easy to Use", "Customizable"],
    theme: "blue",
  },
  {
    href: "/trips",
    title: "Budget Tracking",
    description:
      "Track your travel expenses, set budgets, and monitor spending. Stay on top of your finances throughout your journey.",
    icon: DollarSign,
    features: [
      "Expense tracking",
      "Budget planning",
      "Cost analysis",
      "Currency conversion",
    ],
    badges: ["Real-time", "Detailed Reports"],
    theme: "green",
  },
  {
    href: "/trips",
    title: "Relocation Tools",
    description:
      "Specialized tools for managing international moves. Track shipping, housing, and essential tasks.",
    icon: Globe,
    features: [
      "Moving checklists",
      "Task management",
      "Progress tracking",
      "Document storage",
    ],
    badges: ["International", "Comprehensive"],
    theme: "purple",
  },
];

const themeColors = {
  blue: {
    bg: "bg-blue-500/5",
    hoverBg: "hover:bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-500",
    icon: "text-blue-500",
    badge: "bg-blue-500/10 text-blue-400",
    hover: "group-hover:text-blue-400",
  },
  green: {
    bg: "bg-emerald-500/5",
    hoverBg: "hover:bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-500",
    icon: "text-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-400",
    hover: "group-hover:text-emerald-400",
  },
  purple: {
    bg: "bg-purple-500/5",
    hoverBg: "hover:bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-500",
    icon: "text-purple-500",
    badge: "bg-purple-500/10 text-purple-400",
    hover: "group-hover:text-purple-400",
  },
};

function FeatureCard({ feature }: { feature: Feature }) {
  const colors = themeColors[feature.theme as keyof typeof themeColors];

  return (
    <Link href={feature.href} className="block h-full">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`group relative h-full rounded-xl border-2 ${colors.border} bg-card/95 backdrop-blur-sm shadow-lg transition-all duration-200 ${colors.hoverBg}`}
      >
        <div className="p-6 md:p-8">
          <div className="mb-8 flex items-center gap-4">
            <div className={`rounded-xl p-4 ${colors.bg}`}>
              <feature.icon className={`h-7 w-7 ${colors.icon}`} />
            </div>
            <Text variant="h3" className={`text-2xl font-semibold ${colors.text}`}>
              {feature.title}
            </Text>
          </div>

          <Text className="mb-8 text-base text-foreground-secondary">{feature.description}</Text>

          <div className="mb-8 flex flex-wrap gap-2">
            {feature.badges.map((badge, i) => (
              <span
                key={i}
                className={`rounded-full px-3 py-1 text-sm font-medium ${colors.badge}`}
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="space-y-3">
            {feature.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-3 text-base">
                <span className={`h-1.5 w-1.5 rounded-full ${colors.text}`} />
                <span className={`text-foreground-secondary ${colors.hover}`}>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="space-y-12 py-16 w-full mx-auto">
        <div className="space-y-4 flex flex-col pb-12">
          <h1
            className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight font-bold bg-gradient-to-r from-[hsl(28,85%,35%)] to-[hsl(35,85%,45%)] bg-clip-text text-transparent"
          >
            Plan with Confidence
          </h1>
          <Text variant="body-lg" color="secondary" className="text-lg leading-relaxed">
            Everything you need to plan your perfect trip or relocation
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 transition-transform duration-300 mx-2">
          {features.map((feature, index) => (
            <FeatureCard key={`${feature.href}-${feature.title}`} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
