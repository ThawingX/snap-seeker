"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import SeekTable from "@/components/seek-table";

export default function AnalysisPage() {
  const params = useParams();
  const id = params.id as string;
  const [query, setQuery] = useState("");

  useEffect(() => {
    // In a real app, we'd fetch the details based on the ID
    // For now we'll use dummy data matching the ID from historyItems
    const fetchQueryDetails = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Sample queries matching the IDs from History.tsx
      const queryMap: Record<string, string> = {
        "1": "茶叶品种比较与选购指南",
        "2": "Best restaurants in San Francisco",
        "3": "机器学习框架对比",
        "4": "Summer travel destinations 2023",
        "5": "提高远程工作效率的方法",
        "6": "健康早餐食谱推荐"
      };
      
      setQuery(queryMap[id] || "Unknown query");
    };
    
    fetchQueryDetails();
  }, [id]);
  
  if (!query) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return <SeekTable query={query} />;
} 