"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, CheckSquare, DollarSign, Map, Clock, Bell } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Container } from "~/components/ui/Container";
import { Text } from "~/components/ui/Text";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full min-h-[60vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <Container className="relative px-6 md:px-8 lg:px-10 max-w-5xl py-24">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-[hsl(28,85%,35%)] to-[hsl(35,85%,45%)] bg-clip-text text-transparent">
              Your Travel Planner
            </h1>
            <Text variant="body-lg" className="text-foreground/80 max-w-2xl mx-auto text-lg sm:text-xl">
              A comprehensive toolkit for organizing trips, managing budgets, and tracking travel plans.
            </Text>
          </motion.div>
        </Container>
      </section>

      <section className="w-full bg-gradient-to-br from-background/50 to-background/30 backdrop-blur border-y border-border/10">
        <Container className="px-6 md:px-8 lg:px-10 max-w-5xl py-24">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card variant="elevated" className="bg-card/95 backdrop-blur-sm p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[hsl(28,85%,35%)] to-[hsl(35,85%,45%)] bg-clip-text text-transparent">
                  Trip Organization
                </h2>
                <Text className="text-xl leading-relaxed text-foreground/80">
                  A powerful set of tools designed to streamline your travel planning. Create detailed itineraries, manage bookings, and keep all your travel information in one place.
                </Text>
              </Card>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card variant="elevated" className="h-full bg-card/95 backdrop-blur-sm p-8">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[hsl(28,85%,35%)] to-[hsl(35,85%,45%)] bg-clip-text text-transparent">
                    Timeline Management
                  </h2>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4 group">
                      <div className="p-2 rounded-lg bg-[hsl(28,85%,35%)]/10 group-hover:bg-[hsl(28,85%,35%)]/20 transition-colors">
                        <Calendar className="w-5 h-5 text-[hsl(28,85%,35%)]" />
                      </div>
                      <Text className="text-lg text-foreground/80 group-hover:text-foreground transition-colors">
                        Visual timeline for activities and events
                      </Text>
                    </li>
                    <li className="flex items-start gap-4 group">
                      <div className="p-2 rounded-lg bg-[hsl(28,85%,35%)]/10 group-hover:bg-[hsl(28,85%,35%)]/20 transition-colors">
                        <Clock className="w-5 h-5 text-[hsl(28,85%,35%)]" />
                      </div>
                      <Text className="text-lg text-foreground/80 group-hover:text-foreground transition-colors">
                        Deadline tracking and reminders
                      </Text>
                    </li>
                    <li className="flex items-start gap-4 group">
                      <div className="p-2 rounded-lg bg-[hsl(28,85%,35%)]/10 group-hover:bg-[hsl(28,85%,35%)]/20 transition-colors">
                        <Bell className="w-5 h-5 text-[hsl(28,85%,35%)]" />
                      </div>
                      <Text className="text-lg text-foreground/80 group-hover:text-foreground transition-colors">
                        Smart notifications for upcoming events
                      </Text>
                    </li>
                  </ul>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card variant="elevated" className="h-full bg-card/95 backdrop-blur-sm p-8">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[hsl(28,85%,35%)] to-[hsl(35,85%,45%)] bg-clip-text text-transparent">
                    Travel Tools
                  </h2>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4 group">
                      <div className="p-2 rounded-lg bg-[hsl(28,85%,35%)]/10 group-hover:bg-[hsl(28,85%,35%)]/20 transition-colors">
                        <DollarSign className="w-5 h-5 text-[hsl(28,85%,35%)]" />
                      </div>
                      <Text className="text-lg text-foreground/80 group-hover:text-foreground transition-colors">
                        Budget tracking and expense management
                      </Text>
                    </li>
                    <li className="flex items-start gap-4 group">
                      <div className="p-2 rounded-lg bg-[hsl(28,85%,35%)]/10 group-hover:bg-[hsl(28,85%,35%)]/20 transition-colors">
                        <Map className="w-5 h-5 text-[hsl(28,85%,35%)]" />
                      </div>
                      <Text className="text-lg text-foreground/80 group-hover:text-foreground transition-colors">
                        Activity and booking organization
                      </Text>
                    </li>
                    <li className="flex items-start gap-4 group">
                      <div className="p-2 rounded-lg bg-[hsl(28,85%,35%)]/10 group-hover:bg-[hsl(28,85%,35%)]/20 transition-colors">
                        <CheckSquare className="w-5 h-5 text-[hsl(28,85%,35%)]" />
                      </div>
                      <Text className="text-lg text-foreground/80 group-hover:text-foreground transition-colors">
                        Custom checklists and progress tracking
                      </Text>
                    </li>
                  </ul>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <Card variant="elevated" className="bg-card/95 backdrop-blur-sm p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[hsl(28,85%,35%)] to-[hsl(35,85%,45%)] bg-clip-text text-transparent">
                  Start Planning Your Trip
                </h2>
                <Text className="text-xl mb-8 text-foreground/80">
                  Create your first trip and experience organized travel planning.
                </Text>
                <Link href="/trips">
                  <Button 
                    size="lg" 
                    className="group bg-gradient-to-r from-[hsl(28,85%,35%)] to-[hsl(35,85%,45%)] hover:opacity-90 transition-all duration-300"
                  >
                    Create Trip
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
