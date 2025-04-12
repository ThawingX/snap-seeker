"use client";
import React from "react";
import { CardDemo } from "@/components/cards-demo-1";

export const History = () => {
  return (
    <div className="flex flex-1 flex-col">
      <CardDemo />
      <div className="flex h-full w-full flex-1 flex-col p-4 md:p-10">
        <div className="flex max-w-4xl flex-col">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Search History</h1>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <div className="space-y-4">
              {/* Sample history items - will be populated dynamically in a real app */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">Sample search query {item}</h3>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded text-neutral-600 dark:text-neutral-300">
                      Category
                    </span>
                  </div>
                </div>
              ))}

              {/* Empty state - shown when no history */}
              {false && (
                <div className="text-center py-10">
                  <p className="text-lg text-neutral-500 dark:text-neutral-400">No search history yet</p>
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-2">
                    Your recent searches will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 