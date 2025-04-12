"use client";
import React from "react";
import { SearchBar } from "./SearchBar";
import { InfoCards } from "./InfoCards";

export const Dashboard = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2 p-4 md:p-10">
        <div className="flex max-w-4xl flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">What do you want to know?</h1>
          
          <SearchBar />
          {/* <InfoCards /> */}
        </div>
      </div>
    </div>
  );
}; 