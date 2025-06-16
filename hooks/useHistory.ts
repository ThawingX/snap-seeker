import { useState, useEffect } from "react";
import { clearSearchHistory, SearchHistoryItem } from "@/lib/searchHistory";
import { HistoryItemWithResults, SearchResultProcessor } from "@/types/search-result";
import { api, API_ENDPOINTS } from "@/lib/api";

/**
 * 共享的历史记录管理hook
 * 用于History和MobileHistory组件，避免代码重复
 */
export const useHistory = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItemWithResults[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取历史记录
  const fetchHistoryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 从API获取历史记录
      const response = await api.get(API_ENDPOINTS.HISTORY);
      
      if (!response.ok) {
        throw new Error('Failed to fetch history from server');
      }
      
      const data = await response.json();
      // 使用SearchResultProcessor格式化历史数据
      const historyData = Array.isArray(data) ? data : data.data || [];
      const formattedItems = historyData.map(item => SearchResultProcessor.formatHistoryItem(item));
      setHistoryItems(formattedItems);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError("Failed to load history items");
    } finally {
      setLoading(false);
    }
  };

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

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // 初始化时获取历史记录
  useEffect(() => {
    fetchHistoryItems();
  }, []);

  return {
    historyItems,
    loading,
    error,
    handleClearHistory,
    formatDate,
    refetch: fetchHistoryItems
  };
};