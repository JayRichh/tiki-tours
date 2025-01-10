import { Suspense } from "react";

import type { Metadata } from "next";
import localFont from "next/font/local";

import { Footer } from "~/components/Footer";
import { Navigation } from "~/components/Navigation";
import { GradientBackground } from "~/components/ui/GradientBackground";
import { Spinner } from "~/components/ui/Spinner";

import "./globals.css";
import { FeaturesSceneComponent } from "./examples/3d/components/FeaturesSceneComponent";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  preload: true,
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  preload: true,
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tiki.tours'),
  title: "Tiki Tours - Travel Planning Made Easy",
  icons: {
    icon: [
      { url: '/koru-icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' }
    ],
    apple: [
      { url: '/koru-icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: ['/koru-icon.svg']
  },
  description: "Plan your trips, relocations, and adventures with ease. Track budgets, manage timelines, and organize your journey.",
  keywords: ["travel planning", "trip organization", "vacation planner", "travel itinerary", "budget tracking"],
  authors: [{ name: "Tiki Tours" }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tiki.tours',
    siteName: 'Tiki Tours',
    title: 'Tiki Tours - Travel Planning Made Easy',
    description: 'Plan your trips, relocations, and adventures with ease. Track budgets, manage timelines, and organize your journey.',
    images: [
      {
        url: '/tikitoursbanner.png',
        width: 1200,
        height: 630,
        alt: 'Tiki Tours Banner',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiki Tours - Travel Planning Made Easy',
    description: 'Plan your trips, relocations, and adventures with ease.',
    images: ['/tikitoursbanner.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: 'google-site-verification',
  }
};

function NavigationLoading() {
  return (
    <div className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <Spinner size="sm" variant="primary" />
    </div>
  );
}

function MainContentLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <Spinner size="lg" variant="primary" />
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="text-foreground font-sans antialiased min-h-full flex flex-col">
        {/* Background pattern */}
        <div className="fixed inset-0 w-full min-h-screen z-0 pointer-events-none">
          <GradientBackground />
        </div>

              {/* 3D Scene Background */}
      <FeaturesSceneComponent />

        {/* Navigation */}
        <Suspense fallback={<NavigationLoading />}>
          <Navigation />
        </Suspense>

        {/* Main content */}
        <div className="pt-16 flex-1 flex flex-col relative z-10">
          <Suspense fallback={<MainContentLoading />}>{children}</Suspense>
        </div>

        <Footer />
      </body>
    </html>
  );
}
