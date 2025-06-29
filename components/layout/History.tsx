"use client";
import React from "react";
import { HistoryCard, HistoryCardProps } from "@/components/history-card";
import { useHistory } from "@/hooks/useHistory";

export const History = () => {
  const { historyItems, loading, error, formatDate } = useHistory();

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      <div className="flex w-full flex-1 flex-col overflow-y-auto relative">
        <div className="sticky top-0 left-0 right-0 z-30 bg-background shadow-sm px-4 md:px-10 py-4">
          <div className="flex flex-col max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl md:text-4xl font-bold">Search History</h1>
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