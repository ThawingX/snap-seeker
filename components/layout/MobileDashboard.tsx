"use client";
import React from "react";
import { MobileSearchBar } from "./MobileSearchBar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BackgroundBeamsWithCollision } from "../ui/background-beams-with-collision";
import { Cover } from "../ui/cover";
import ColourfulText from "../ui/colourful-text";
import Image from "next/image";

export const MobileDashboard = () => {
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center">
          <div className="relative bg-background rounded-md overflow-hidden transition-all duration-300 ease-in-out">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-muted to-background opacity-50"></div>
            <Image
              src="/images/header-logo.jpg"
              alt="SnapSeeker Logo"
              width={120}
              height={24}
              className="rounded-md relative z-10"
              style={{ 
                objectFit: 'contain',
                filter: 'brightness(1.2) contrast(0.9)'
              }}
              priority
              quality={100}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/login"
            className="rounded-full border border-neutral-600 px-3 py-1 text-sm text-white hover:bg-neutral-800"
          >
            Log in
          </Link>
          <Link
            href="/login?mode=signup"
            className="rounded-full bg-teal-500 px-3 py-1 text-sm text-white hover:bg-teal-600"
          >
            Sign up
          </Link>
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
    </div>
  );
};