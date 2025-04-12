"use client";
import React, { useState, useEffect } from "react";
import { HistoryCard, HistoryCardProps } from "@/components/history-card";

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
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchHistoryItems = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Sample data (in a real app, this would come from the API)
        const sampleData: HistoryItem[] = [
          {
            id: "1",
            query: "茶叶品种比较与选购指南",
            description: "探索各种茶叶品种的特点、产地、冲泡方法及选购建议",
            timestamp: new Date().toISOString(),
            category: "茶叶｜茶具｜茶文化",
            logoUrl: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/buymeacoffee.svg"
          },
          {
            id: "2",
            query: "Best restaurants in San Francisco",
            description: "Looking for top-rated restaurants in the San Francisco Bay Area with outdoor seating",
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            category: "Food｜Restaurants｜San Francisco",
            logoUrl: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/yelp.svg"
          },
          {
            id: "3",
            query: "机器学习框架对比",
            description: "比较最流行的机器学习框架：TensorFlow、PyTorch、scikit-learn及其使用场景",
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            category: "技术｜AI｜编程｜机器学习",
            logoUrl: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/tensorflow.svg"
          },
          {
            id: "4",
            query: "Summer travel destinations 2023",
            description: "Exploring popular summer travel destinations with good weather and affordable accommodations",
            timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            category: "Travel｜Vacation｜Summer",
            logoUrl: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/tripadvisor.svg"
          },
          {
            id: "5",
            query: "提高远程工作效率的方法",
            description: "提高在家或远程工作时的生产力的技巧和工具",
            timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            category: "生产力｜远程工作｜工作效率｜时间管理",
            logoUrl: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/notion.svg"
          },
          {
            id: "6",
            query: "健康早餐食谱推荐",
            description: "快速且营养丰富的早餐食谱，15分钟内即可完成",
            timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
            category: "食品｜健康饮食｜食谱",
            logoUrl: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/airbnb.svg"
          },
        ];
        
        setHistoryItems(sampleData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load history items");
        setLoading(false);
      }
    };

    fetchHistoryItems();
  }, []);

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
        <div className="sticky top-0 left-0 right-0 z-30 bg-white dark:bg-neutral-900 shadow-sm px-4 md:px-10 py-4">
          <div className="flex flex-col max-w-7xl mx-auto w-full">
            <h1 className="text-3xl md:text-4xl font-bold">Search History</h1>
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
            <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
              <p className="text-lg text-neutral-500 dark:text-neutral-400">No search history yet</p>
              <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-2">
                Your recent searches will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
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