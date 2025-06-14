"use client";
import React, { useState, useEffect } from "react";
import { HistoryCard } from "@/components/history-card";
import { clearSearchHistory, SearchHistoryItem } from "@/lib/searchHistory";
import { api, API_ENDPOINTS } from "@/lib/api";

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
    // 从API获取搜索历史
    const fetchHistoryItems = async () => {
      try {
        setLoading(true);
        
        // 从API获取历史记录
        const response = await api.get(API_ENDPOINTS.HISTORY);
        
        if (!response.ok) {
          throw new Error('Failed to fetch history from server');
        }
        
        const data = await response.json();
        // 假设API返回的数据格式与localStorage一致
        const historyData = Array.isArray(data) ? data : data.data || [];
        setHistoryItems(historyData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch history:', err);
        setError("Failed to load history items");
        setLoading(false);
      }
    };

    fetchHistoryItems();
  }, []);

  // 清除所有历史记录
  const handleClearHistory = async () => {
    try {
      // 通过API清除历史记录
      const response = await api.delete(API_ENDPOINTS.HISTORY);
      
      if (!response.ok) {
        throw new Error('Failed to clear history');
      }
      
      // 清除成功后更新本地状态
      setHistoryItems([]);
      
      // 同时清除本地缓存的搜索数据
      clearSearchHistory();
    } catch (err) {
      console.error('Failed to clear history:', err);
      setError('Failed to clear history');
    }
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
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="sticky top-0 left-0 right-0 z-30 bg-background px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">History</h1>
          {historyItems.length > 0 && (
            <button 
              onClick={handleClearHistory}
              className="text-destructive hover:text-destructive/80 text-xs font-medium px-2 py-1 rounded border border-destructive/20 hover:border-destructive/40 hover:bg-destructive/10 transition-all duration-300"
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
            <div className="text-center py-8 bg-muted rounded-lg p-6">
              <p className="text-sm text-neutral-400">No search history yet</p>
              <p className="text-xs text-neutral-500 mt-2">
                Your search history will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
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