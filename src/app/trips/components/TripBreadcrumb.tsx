"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Trip } from "~/types/trips";

interface TripBreadcrumbProps {
  trip?: Trip;
  className?: string;
}

export function TripBreadcrumb({ trip, className }: TripBreadcrumbProps) {
  return (
    <nav className={className}>
      <div className="flex items-center gap-4">
        <Link
          href="/trips"
          className="flex items-center gap-1 text-sm text-foreground-secondary hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Trips
        </Link>
        {trip && (
          <>
            <span className="text-foreground/40">/</span>
            <span className="text-sm text-foreground">{trip.destination}</span>
          </>
        )}
      </div>
    </nav>
  );
}
