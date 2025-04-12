"use client";
import React from "react";
import { BackgroundBeamsWithCollision } from "../ui/background-beams-with-collision";
import { SearchBar } from "./SearchBar";

export const Dashboard = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2 p-4 md:p-10">
        <div className="flex max-w-4xl flex-col items-center justify-center w-full">
          <BackgroundBeamsWithCollision className="flex flex-col items-center justify-center rounded-3xl shadow-lg bg-opacity-60 backdrop-blur-sm">
            <h1 className="text-4xl md:text-5xl font-bold text-center mt-16 mb-12 relative z-10 text-black dark:text-white">
              What do you want to know?
            </h1>
            
            <div className="relative z-10 w-full max-w-2xl px-6 mb-16">
              <SearchBar />
            </div>
          </BackgroundBeamsWithCollision>
        </div>
      </div>
    </div>
  );
}; 