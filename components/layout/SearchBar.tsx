"use client";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

export interface SearchBarRef {
  addTag: (tag: string) => void;
}

export const SearchBar = forwardRef<SearchBarRef>((props, ref) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { isAuthenticated, showAuthModal } = useAuth();

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
    
    // 触发搜索开始埋点
    trackEvent(ANALYTICS_EVENTS.SEARCH_START, {
      search_term: input.trim(),
      search_length: input.trim().length,
      page: 'dashboard',
      user_authenticated: isAuthenticated
    });
    
    // 检查用户是否已登录
    if (!isAuthenticated) {
      // 触发未登录搜索尝试埋点
      trackEvent(ANALYTICS_EVENTS.SEARCH_UNAUTHENTICATED, {
        search_term: input.trim(),
        page: 'dashboard'
      });
      
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
      
      // 触发搜索提交成功埋点
      trackEvent(ANALYTICS_EVENTS.SEARCH_SUBMIT, {
        search_term: input.trim(),
        search_id: tempId,
        page: 'dashboard'
      });
      
      // 直接跳转到results页面，通过URL参数传递查询和ID
      // 将查询存储到sessionStorage中
        sessionStorage.setItem('currentSearch', JSON.stringify({
          query: input,
          timestamp: Date.now()
        }));
        
        router.push(`/results?id=${tempId}&isNew=true`);
    } catch (error) {
      console.error('Error during search submission:', error);
      
      // 触发搜索失败埋点
      trackEvent(ANALYTICS_EVENTS.SEARCH_FAILED, {
        search_term: input.trim(),
        error_message: error instanceof Error ? error.message : 'Unknown error',
        page: 'dashboard'
      });
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
      <div className="relative w-full glass-card rounded-3xl border border-border/50 overflow-hidden shadow-lg transition-glass">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          placeholder="What's on your ideas and plans?"
          rows={1}
          className="w-full px-8 py-6 text-base focus:outline-none bg-transparent text-foreground resize-none transition-all custom-scrollbar placeholder:text-muted-foreground"
          style={{ 
            minHeight: "100px",
            overflowY: showScrollbar ? 'scroll' : 'hidden',
            scrollbarWidth: 'thin',
            paddingTop: showScrollbar ? '16px' : '24px' // 滚动条出现时增加上内边距
          }}
        />
        
        <div className="flex items-center justify-between px-6 py-3 border-t border-border/50">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div 
                className="relative inline-flex items-center cursor-not-allowed opacity-70"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 border border-gray-400 dark:border-gray-500 rounded-full shadow-inner"></div>
                <div className="absolute left-0.5 top-0.5 bg-white dark:bg-gray-300 w-4 h-4 rounded-full shadow-sm"></div>
                <span className="ml-3 text-xs font-medium text-gray-600 dark:text-gray-300">PRO</span>
                
                {/* Tooltip */}
                  {showTooltip && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 border border-gray-700">
                      <div className="text-left">
                        <div className="font-medium mb-1">Premium Extension Required</div>
                        <div className="text-gray-300">Unlock PMF capabilities</div>
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900 dark:border-r-gray-800"></div>
                    </div>
                  )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">

            <button 
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className={`group relative flex items-center justify-center h-12 w-12 rounded-full overflow-hidden text-primary-foreground cursor-pointer transition-all duration-200 ease-out hover:shadow-xl hover:shadow-primary/25 hover:scale-105 active:shadow-lg active:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md border border-primary/30 hover:border-primary/50 active:border-primary/60 shadow-lg shadow-primary/10 before:absolute before:inset-0 before:bg-white/20 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 active:before:opacity-0 ${
                isLoading 
                  ? 'bg-gradient-to-r from-primary/80 to-primary/60 scale-95' 
                  : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/70 active:scale-95 shadow-primary/20'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white transition-all duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75 animate-pulse" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-0.5 group-active:translate-x-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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
          background: hsl(var(--muted));
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: hsl(var(--muted-foreground) / 0.3);
          border-radius: 4px;
          border: 2px solid hsl(var(--muted));
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </div>
  );
}); 

SearchBar.displayName = 'SearchBar';