"use client";
import React, { useState, useEffect } from "react";
import { HistoryCard } from "@/components/history-card";

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
            query: "Tea varieties comparison and buying guide",
            description: "Explore various tea varieties, their characteristics, origins, brewing methods and buying advice",
            timestamp: new Date().toISOString(),
            category: "Tea｜Teaware｜Tea Culture",
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
            query: "Machine learning framework comparison",
            description: "Comparing the most popular machine learning frameworks: TensorFlow, PyTorch, scikit-learn and their use cases",
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            category: "Technology｜AI｜Programming｜Machine Learning",
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
            query: "Methods to improve remote work efficiency",
            description: "Tips and tools to improve productivity when working at home or remotely",
            timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            category: "Productivity｜Remote Work｜Efficiency｜Time Management",
            logoUrl: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/notion.svg"
          },
          {
            id: "6",
            query: "Healthy breakfast recipe recommendations",
            description: "Quick and nutritious breakfast recipes that can be completed in 15 minutes",
            timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
            category: "Food｜Healthy Eating｜Recipes",
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
    <div className="flex flex-col h-full bg-black text-white">
      <div className="sticky top-0 left-0 right-0 z-30 bg-black px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">History</h1>
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