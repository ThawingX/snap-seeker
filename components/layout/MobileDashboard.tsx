"use client";
import React from "react";
import { MobileSearchBar } from "./MobileSearchBar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BackgroundBeamsWithCollision } from "../ui/background-beams-with-collision";
import { Cover } from "../ui/cover";
import ColourfulText from "../ui/colourful-text";

export const MobileDashboard = () => {
  return (
    <div className="flex flex-col h-full bg-black text-white">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-teal-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 14.5L4.5 19.5M15 10a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 3L12 7M21 12L17 12M19.7782 4.2218L16.9497 7.0503M4.2218 4.2218L7.0503 7.0503M12 17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ml-2 text-lg font-medium text-white">SnapSeeker</span>
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
              <Cover>Snap seek</Cover> what's out there for your<br /> <ColourfulText text="ideas and plans" />
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