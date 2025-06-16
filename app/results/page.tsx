"use client";

import React, { useEffect, useState, Suspense } from "react";
import SeekTable from "@/components/seek-table";
import { useSearchParams } from "next/navigation";

function ResultsContent() {
  const [query, setQuery] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get searchId from URL parameters
    const id = searchParams.get("id");
    const isNew = searchParams.get("isNew") === 'true';
    
    if (id) {
      setSearchId(id);
      
      if (isNew) {
        // 对于新搜索，从sessionStorage获取query
        try {
          const currentSearchData = sessionStorage.getItem('currentSearch');
          if (currentSearchData) {
            const { query: storedQuery, timestamp } = JSON.parse(currentSearchData);
            
            // 检查数据是否过期（30分钟）
            const now = Date.now();
            const maxAge = 30 * 60 * 1000; // 30分钟
            
            if (now - timestamp < maxAge && storedQuery) {
              setQuery(storedQuery);
              // 清除已使用的搜索数据
              sessionStorage.removeItem('currentSearch');
            } else {
              // 数据过期，清除并设置默认值
              sessionStorage.removeItem('currentSearch');
              setQuery('Search Query'); // 设置默认值
            }
          } else {
            setQuery('Search Query'); // 设置默认值
          }
        } catch (error) {
          console.error('Error reading currentSearch from sessionStorage:', error);
          setQuery('Search Query'); // 设置默认值
        }
      } else {
        // 对于历史查询，设置一个默认值，实际的query会从API响应中获取
        setQuery('Loading...'); // 临时值，会被历史数据覆盖
      }
    }
  }, [searchParams]);

  return (
    <>
      {query ? (
        <SeekTable query={query} searchId={searchId} />
      ) : (
        <div className="flex items-center justify-center h-32 text-neutral-600 dark:text-neutral-400">
          <span>Loading...</span>
        </div>
      )}
    </>
  );
}

export default function ResultsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-neutral-50 dark:bg-neutral-950 py-8">
      <Suspense fallback={
        <div className="flex items-center justify-center h-32 text-neutral-600 dark:text-neutral-400">
          <span>Loading results...</span>
        </div>
      }>
        <ResultsContent />
      </Suspense>
    </main>
  );
}