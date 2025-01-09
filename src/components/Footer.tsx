"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-5 bg-background/80 backdrop-blur-sm border-t border-border/50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Tiki Tours</h3>
            <p className="text-sm text-foreground-secondary">
              Your personal travel companion for planning trips, relocations, and adventures.
            </p>
          </div>

          {/* Middle column */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-foreground-secondary">
              <li>Trip Planning</li>
              <li>Budget Tracking</li>
              <li>Relocation Support</li>
              <li>Activity Management</li>
            </ul>
          </div>

          {/* Right column */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-foreground-secondary hover:text-primary transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/trips"
                  className="text-foreground-secondary hover:text-primary transition-colors duration-200"
                >
                  Plan Your Journey
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50">
          <p className="text-center text-sm text-foreground-secondary">
            © {new Date().getFullYear()} Tiki Tours. Your journey begins here.
          </p>
        </div>
      </div>
    </footer>
  );
}
