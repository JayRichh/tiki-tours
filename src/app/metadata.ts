import { Metadata } from "next";
import { TIKI_KEYWORDS } from "~/utils/tiki-keywords";

export const metadata: Metadata = {
    metadataBase: new URL("https://tiki.tours"),
    title: "Tiki Tours - Travel Planning Made Easy",
    icons: {
      icon: [{ url: "/koru-icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }],
      apple: [{ url: "/koru-icon.svg", type: "image/svg+xml" }],
      shortcut: ["/koru-icon.svg"],
    },
    description:
      "Plan your trips, relocations, and adventures with ease. Track budgets, manage timelines, and organize your journey.",
    keywords: [
      "travel planning",
      "trip organization",
      "vacation planner",
      "travel itinerary",
      "budget tracking",
      ...TIKI_KEYWORDS,
    ],
    authors: [{ name: "Tiki Tours" }],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://tiki.tours",
      siteName: "Tiki Tours",
      title: "Tiki Tours - Travel Planning Made Easy",
      description:
        "Plan your trips, relocations, and adventures with ease. Track budgets, manage timelines, and organize your journey.",
      images: [
        {
          url: "/tikitoursbanner.png",
          width: 1200,
          height: 630,
          alt: "Tiki Tours Banner",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Tiki Tours - Travel Planning Made Easy",
      description: "Plan your trips, relocations, and adventures with ease.",
      images: ["/tikitoursbanner.png"],
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
      google: "google-site-verification",
    },
  };