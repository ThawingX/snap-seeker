"use client";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export const MobileSearchBar = () => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showScrollbar, setShowScrollbar] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Auto-resize the textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to get the correct scrollHeight
      textarea.style.height = "auto";
      
      // If content height is greater than max height, show scrollbar
      const maxHeight = 150; // smaller max height for mobile
      const scrollHeight = textarea.scrollHeight;
      
      if (scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        setShowScrollbar(true);
      } else {
        textarea.style.height = `${scrollHeight}px`;
        setShowScrollbar(false);
      }
    }
  }, [input]);

  return (
    <div className="w-full">
      <div className="relative w-full bg-neutral-900 rounded-2xl border border-neutral-700 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          placeholder="What's on your ideas and plans?"
          rows={1}
          className="w-full px-6 py-4 text-base focus:outline-none bg-transparent text-white resize-none transition-all custom-scrollbar"
          style={{ 
            minHeight: "80px",
            overflowY: showScrollbar ? 'scroll' : 'hidden',
            scrollbarWidth: 'thin',
          }}
        />
        
        <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-800">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="relative inline-flex items-center cursor-not-allowed opacity-70">
                <div className="w-8 h-4 bg-neutral-800 rounded-full shadow-inner"></div>
                <div className="absolute left-0.5 top-0.5 bg-neutral-600 w-3 h-3 rounded-full"></div>
                <span className="ml-2 text-xs font-medium text-neutral-400">PRO</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Dark theme scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #444;
          border-radius: 3px;
          border: 1px solid #1a1a1a;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }
      `}</style>
    </div>
  );
}; 