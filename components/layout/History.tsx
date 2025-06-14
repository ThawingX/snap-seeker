"use client";
import React, { useState, useEffect } from "react";
import { HistoryCard, HistoryCardProps } from "@/components/history-card";
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

export const History = () => {
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
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      <div className="flex w-full flex-1 flex-col overflow-y-auto relative">
        <div className="sticky top-0 left-0 right-0 z-30 bg-background shadow-sm px-4 md:px-10 py-4">
          <div className="flex flex-col max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl md:text-4xl font-bold">Search History</h1>
              {historyItems.length > 0 && (
                <button 
                  onClick={handleClearHistory}
                  className="text-destructive hover:text-destructive/80 text-sm font-medium px-3 py-1 rounded-md border border-destructive/20 hover:border-destructive/40 hover:bg-destructive/10 transition-all duration-300"
                >
                  Clear History
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col w-full max-w-7xl mx-auto px-4 md:px-10 pt-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-neutral-500">Loading history...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg text-red-500">{error}</p>
            </div>
          ) : historyItems.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg shadow p-6">
              <p className="text-lg text-muted-foreground">No search history yet</p>
              <p className="text-sm text-muted-foreground/80 mt-2">
                Your recent searches will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {historyItems.filter(item => item != null).map((item) => (
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