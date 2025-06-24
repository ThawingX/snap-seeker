"use client";
import React from "react";
import { MobileSearchBar } from "./MobileSearchBar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BackgroundBeamsWithCollision } from "../ui/background-beams-with-collision";
import { Cover } from "../ui/cover";
import ColourfulText from "../ui/colourful-text";
import Image from "next/image";
import ProductHuntBadge from "../ui/product-hunt-badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { IconBrandDiscord } from "@tabler/icons-react";

export const MobileDashboard = () => {
  return (
    <div className="flex flex-col h-full bg-background text-foreground relative">
      {/* Top Left Controls */}
       <div className="fixed top-16 left-4 z-40 flex items-center space-x-2">
         <a
           href="https://discord.gg/CSkT2BdNKy"
           target="_blank"
           rel="noopener noreferrer"
           className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] transition-all duration-300 backdrop-blur-sm"
           aria-label="Join Discord"
         >
           <IconBrandDiscord className="h-5 w-5" />
         </a>
         <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#5865F2]/10 hover:bg-[#5865F2]/20 transition-all duration-300 backdrop-blur-sm">
           <ThemeToggle className="w-5 h-5" />
         </div>
       </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center px-4 pt-6">
          <BackgroundBeamsWithCollision className="flex flex-col items-center justify-center rounded-3xl shadow-lg bg-opacity-60 backdrop-blur-sm">
            <h1 className="text-2xl md:text-3xl font-bold text-center mt-8 mb-8 relative z-10 text-white">
            Get Your <ColourfulText text="MVP" /> Right. Find Your <ColourfulText text="PMF" /> Fast. 
            </h1>

            <div className="relative z-10 w-full max-w-lg px-4 mb-8">
              <MobileSearchBar />
            </div>
          </BackgroundBeamsWithCollision>
        </div>
      </div>
      
      {/* Product Hunt Badge - Fixed to bottom right */}
      <div className="fixed bottom-20 right-2 z-40">
        <ProductHuntBadge className="scale-[0.6] transform-gpu" />
      </div>
    </div>
  );
};