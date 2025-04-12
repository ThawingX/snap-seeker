"use client";
import React, { useState, useRef, useEffect } from "react";

export const SearchBar = () => {
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
      const maxHeight = 250; // increased max height to match image
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
    <div className="w-full max-w-3xl mb-12">
      <div className="relative w-full bg-neutral-900 rounded-3xl border border-neutral-700 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          placeholder="What's on your ideas and plans?"
          rows={1}
          className="w-full px-8 py-6 text-base focus:outline-none bg-transparent text-white resize-none transition-all custom-scrollbar"
          style={{ 
            minHeight: "100px",
            overflowY: showScrollbar ? 'scroll' : 'hidden',
            scrollbarWidth: 'thin',
            paddingTop: showScrollbar ? '16px' : '24px' // 滚动条出现时增加上内边距
          }}
        />
        
        <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-800">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="relative inline-flex items-center cursor-not-allowed opacity-70">
                <div className="w-10 h-5 bg-neutral-800 rounded-full shadow-inner"></div>
                <div className="absolute left-0.5 top-0.5 bg-neutral-600 w-4 h-4 rounded-full"></div>
                <span className="ml-3 text-xs font-medium text-neutral-400">PRO</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center justify-center h-12 w-12 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 暗色主题的滚动条样式 */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #444;
          border-radius: 4px;
          border: 2px solid #1a1a1a;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }
      `}</style>
    </div>
  );
}; 