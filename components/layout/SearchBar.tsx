"use client";
import React from "react";

export const SearchBar = () => {
  return (
    <div className="w-full max-w-3xl mb-12">
      <div className="relative w-full">
        <input 
          type="text" 
          placeholder="Ask anything..." 
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 pr-20 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <button className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </button>
          <button className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <button className="p-1.5 rounded-full bg-teal-500 hover:bg-teal-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14.586L7.707 10.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 00-1.414-1.414L12 14.586z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}; 