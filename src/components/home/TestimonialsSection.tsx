"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { Text } from "~/components/ui/Text";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Digital Nomad",
    content:
      "This app made planning my year-long world tour so much easier. The budget tracking and timeline features are invaluable!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "International Relocator",
    content:
      "Moving countries was daunting, but having all my tasks and deadlines in one place helped me stay organized and calm.",
    rating: 5,
  },
  {
    name: "Emma Williams",
    role: "Adventure Traveler",
    content:
      "The best travel planning tool I've used. It helps me keep track of everything from flights to activities to budgets.",
    rating: 5,
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        ))}
      </div>
      <Text className="mb-4 text-foreground-secondary italic">&quot;{testimonial.content}&quot;</Text>
      <div>
        <Text weight="medium">{testimonial.name}</Text>
        <Text variant="body-sm" color="secondary">
          {testimonial.role}
        </Text>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="space-y-12 py-16 w-full mx-auto">
        <div className="space-y-4 flex flex-col pb-12">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight font-bold bg-gradient-to-r from-[hsl(28,85%,35%)] to-[hsl(35,85%,45%)] bg-clip-text text-transparent">
            What Our Users Say
          </h1>
          <Text variant="body-lg" color="secondary" className="text-lg leading-relaxed">
            Join thousands of travelers who&apos;ve simplified their journey planning
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-2">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
