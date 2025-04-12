"use client";
import React from "react";

export const InfoCards = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="h-32 border border-neutral-200 p-4 rounded-xl hover:shadow-sm transition-shadow dark:border-neutral-700">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-neutral-100 rounded-md flex items-center justify-center mr-3 dark:bg-neutral-800">
            <svg className="w-5 h-5 text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <span className="text-sm font-medium">OpenAI's GPT-4 Phase-Out Plan</span>
        </div>
        <p className="text-xs text-neutral-500">Information about OpenAI's plans for GPT-4</p>
      </div>
      
      <div className="h-32 border border-neutral-200 p-4 rounded-xl hover:shadow-sm transition-shadow dark:border-neutral-700">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-neutral-100 rounded-md flex items-center justify-center mr-3 dark:bg-neutral-800">
            <svg className="w-5 h-5 text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" fill="white" />
            </svg>
          </div>
          <span className="text-sm font-medium">Adobe Faces Backlash on Bluesky</span>
        </div>
        <p className="text-xs text-neutral-500">Latest news about Adobe's challenges</p>
      </div>
      
      <div className="h-32 border border-neutral-200 p-4 rounded-xl hover:shadow-sm transition-shadow dark:border-neutral-700">
        <div className="flex flex-col">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Nasdaq</span>
            <span className="text-sm font-medium">16,724.46</span>
          </div>
          <div className="text-xs text-teal-500 font-medium">+2.06%</div>
          <div className="flex justify-between mt-4">
            <span className="text-sm font-medium">AAPL</span>
            <span className="text-sm font-medium">198.15</span>
          </div>
          <div className="text-xs text-teal-500 font-medium">+4.06%</div>
        </div>
      </div>
    </div>
  );
};