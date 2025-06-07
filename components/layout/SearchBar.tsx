"use client";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export interface SearchBarRef {
  addTag: (tag: string) => void;
}

export const SearchBar = forwardRef<SearchBarRef>((props, ref) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useImperativeHandle(ref, () => ({
    addTag: (tag: string) => {
      const newTag = `#${tag}`;
      const currentInput = input;
      
      // 如果 textarea 中已经有内容，在前面添加标签
      if (currentInput.trim()) {
        setInput(`${newTag} ${currentInput}`);
      } else {
        setInput(newTag);
      }
      
      // 聚焦到 textarea 并将光标移到标签后面
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPosition = newTag.length + (currentInput.trim() ? 1 : 0);
          textareaRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  }));

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

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // 生成一个临时ID用于页面跳转
      const tempId = crypto.randomUUID();
      
      // 保存查询内容到localStorage，但不添加到历史记录
      // 实际的ID处理和历史记录添加将在seek-table.tsx中完成
      localStorage.setItem(tempId, JSON.stringify({ query: input }));
      
      // 立即跳转到results页面，带临时id参数
      router.push(`/results?id=${tempId}`);
    } catch (error) {
      console.error('Error during search submission:', error);
      // 使用toast组件显示错误信息
      showToast({
        message: '搜索请求失败，请稍后再试',
        type: 'error',
        duration: 3000
      });
      setIsLoading(false);
    }
  };

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
            <button 
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className={`flex items-center justify-center h-12 w-12 rounded-full ${isLoading ? 'bg-cyan-700' : 'bg-cyan-500 hover:bg-cyan-600'} text-white cursor-pointer transition-colors`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              )}
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
}); 

SearchBar.displayName = 'SearchBar';