"use client";

import { ArrowRight, Globe2, Heart, Lightbulb, Shield, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Text } from "~/components/ui/Text";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full pt-12 sm:pt-24">
        <Container className="px-6 md:px-8 lg:px-10 max-w-4xl">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <Text variant="h1" className="tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                About Tiki Tours
              </Text>
              <Text variant="body-lg" className="text-muted-foreground max-w-2xl mx-auto">
                Revolutionizing travel planning with intelligent tools and a passionate community of explorers.
              </Text>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <div className="bg-card/30 border border-border/50 rounded-xl p-8 backdrop-blur-sm">
                <Text variant="h3" className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                  Our Vision
                </Text>
                <Text className="text-lg leading-relaxed">
                  At Tiki Tours, we envision a world where travel planning becomes an exciting part of the journey itself. Our platform transforms complex trip organization into an intuitive, enjoyable experience that sparks inspiration and brings your travel dreams to life.
                </Text>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="bg-card/30 border border-border/50 rounded-xl p-8 backdrop-blur-sm">
                  <Text variant="h3" className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-4">
                    Our Mission
                  </Text>
                  <Text className="text-lg leading-relaxed">
                    We're dedicated to empowering travelers with cutting-edge tools that make trip planning effortless and collaborative. From personalized itineraries to smart budgeting features, we're here to enhance every step of your journey.
                  </Text>
                </div>

                <div className="bg-card/30 border border-border/50 rounded-xl p-8 backdrop-blur-sm">
                  <Text variant="h3" className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-4">
                    Our Values
                  </Text>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Globe2 className="w-6 h-6 text-primary mt-1" />
                      <Text>Embracing cultural diversity and responsible travel</Text>
                    </li>
                    <li className="flex items-start gap-3">
                      <Heart className="w-6 h-6 text-primary mt-1" />
                      <Text>Fostering meaningful connections and experiences</Text>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-primary mt-1" />
                      <Text>Ensuring security and peace of mind for travelers</Text>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-card/30 border border-border/50 rounded-xl p-8 backdrop-blur-sm">
                <Text variant="h3" className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
                  Smart Features
                </Text>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      <Text className="font-semibold">Intelligent Planning</Text>
                    </div>
                    <Text className="text-muted-foreground">
                      AI-powered suggestions and automated scheduling to optimize your itinerary
                    </Text>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <Text className="font-semibold">Collaborative Tools</Text>
                    </div>
                    <Text className="text-muted-foreground">
                      Real-time synchronization and group planning features
                    </Text>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-xl p-8 backdrop-blur-sm border border-border/50">
                <Text variant="h3" className="text-center bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-6">
                  Join Our Community
                </Text>
                <Text className="text-center text-lg mb-8">
                  Connect with fellow travelers, share experiences, and discover new destinations together.
                </Text>
                <div className="flex justify-center">
                  <Link href="/trips">
                    <Button size="lg" className="group">
                      Start Planning
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
