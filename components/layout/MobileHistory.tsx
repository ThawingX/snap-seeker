"use client";
import React, { useState, useEffect } from "react";
import { HistoryCard } from "@/components/history-card";
import { getSearchHistory, clearSearchHistory, SearchHistoryItem } from "@/lib/searchHistory";

// Sample API response type
interface HistoryItem {
  id: string;
  query: string;
  description: string;
  timestamp: string;
  category: string;
  logoUrl?: string;
}

export const MobileHistory = () => {
  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 从localStorage中获取搜索历史
    const fetchHistoryItems = async () => {
      try {
        setLoading(true);
        // 模拟加载延迟
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // 获取本地存储的历史记录
        const storedHistory = getSearchHistory();
        setHistoryItems(storedHistory);
        setLoading(false);
      } catch (err) {
        setError("Failed to load history items");
        setLoading(false);
      }
    };

    fetchHistoryItems();
  }, []);

  // 清除所有历史记录
  const handleClearHistory = () => {
    clearSearchHistory();
    setHistoryItems([]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      <div className="sticky top-0 left-0 right-0 z-30 bg-black px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">History</h1>
          {historyItems.length > 0 && (
            <button 
              onClick={handleClearHistory}
              className="text-red-500 hover:text-red-600 text-xs font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col px-4 pt-4 pb-16">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-sm text-neutral-400">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : historyItems.length === 0 ? (
            <div className="text-center py-8 bg-neutral-900 rounded-lg p-6">
              <p className="text-sm text-neutral-400">No search history yet</p>
              <p className="text-xs text-neutral-500 mt-2">
                Your search history will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {historyItems.map((item) => (
                <HistoryCard
                  key={item.id}
                  title={item.query}
                  description={item.description}
                  date={formatDate(item.timestamp)}
                  category={item.category}
                  logoUrl={item.logoUrl}
                  logoAlt={`${item.query} logo`}
                  id={item.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 