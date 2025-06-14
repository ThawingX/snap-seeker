"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";

export const MobileSearchBar = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { isAuthenticated, showAuthModal } = useAuth();

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

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    
    // 检查用户是否已登录
    if (!isAuthenticated) {
      // 保存当前搜索数据到sessionStorage，用于登录后恢复
      sessionStorage.setItem('pendingSearch', JSON.stringify({
        query: input,
        timestamp: Date.now()
      }));
      
      // 显示登录模态框
      showAuthModal('login');
      return;
    }
    
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
    <div className="w-full">
      <div className="relative w-full glass-card rounded-2xl border border-border/50 overflow-hidden transition-glass">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          placeholder="What's on your ideas and plans?"
          rows={1}
          className="w-full px-6 py-4 text-base focus:outline-none bg-transparent text-foreground resize-none transition-glass custom-scrollbar"
          style={{ 
            minHeight: "80px",
            overflowY: showScrollbar ? 'scroll' : 'hidden',
            scrollbarWidth: 'thin',
          }}
        />
        
        <div className="flex items-center justify-between px-4 py-2 border-t border-border/50">
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
            <button 
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className={`flex items-center justify-center h-10 w-10 rounded-full ${isLoading ? 'bg-primary/80' : 'bg-primary hover:bg-primary/90'} text-primary-foreground transition-all duration-300 border border-primary/20 hover:border-primary/40 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              )}
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