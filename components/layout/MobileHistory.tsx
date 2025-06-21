"use client";
import React from "react";
import { HistoryCard } from "@/components/history-card";
import { useHistory } from "@/hooks/useHistory";

export const MobileHistory = () => {
  const { historyItems, loading, error, formatDate } = useHistory();

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="sticky top-0 left-0 right-0 z-30 bg-background px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
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