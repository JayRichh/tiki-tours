"use client";

import { Box, Component, FileCode, FormInput, Home, Palette } from "lucide-react";

import { Suspense } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useActiveSection } from "~/hooks/useActiveSection";

import { cn } from "~/utils/cn";
import { FeaturesSceneComponent } from "../examples/3d/components/FeaturesSceneComponent";

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">

        {/* 3D Scene Background */}
        <FeaturesSceneComponent />
        
        <div className="flex-1">
            {children}
            </div>

    </div>
  );
}
