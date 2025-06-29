"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconHash, IconDevices, IconCategory, IconTrendingUp, IconPrinter } from "@tabler/icons-react";
import { DemandRanking, HotKeysData } from "@/types/competitor";

/**
 * 需求热度标签卡片组件
 */
const DemandRankingCard = ({ ranking }: { ranking: DemandRanking }) => (
  <div className="bg-card rounded-xl p-5 shadow-md">
    <h3 className="text-xl font-bold text-card-foreground mb-4">{ranking.title}</h3>
    <div className="space-y-3">
      {ranking.tags.filter(tag => tag != null).map((tag, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground w-6">{`#${index + 1}`}</span>
            <span className="text-card-foreground">{tag.tag}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {tag.searchCount.toLocaleString()} searches
          </span>
        </div>
      ))}
    </div>
  </div>
);

/**
 * 骨架加载样式 - 热门搜索卡片
 */
const TrendingSearchSkeleton = () => (
  <div className="bg-muted rounded-xl p-5 shadow-md animate-pulse">
    <div className="h-6 bg-muted-foreground/20 rounded-md w-2/3 mb-4"></div>
    {Array(5).fill(0).map((_, i) => (
      <div key={i} className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-muted-foreground/20 rounded-md w-6"></div>
          <div className="h-4 bg-muted-foreground/20 rounded-md w-24"></div>
        </div>
        <div className="h-4 bg-muted-foreground/20 rounded-md w-20"></div>
      </div>
    ))}
  </div>
);

interface TrendingSearchesProps {
  hotKeysData: HotKeysData;
  loading: boolean;
  trendingSearchesRef: React.RefObject<HTMLDivElement>;
  onPrint?: () => void;
}

/**
 * 热门搜索组件
 */
export const TrendingSearches: React.FC<TrendingSearchesProps> = ({
  hotKeysData,
  loading,
  trendingSearchesRef,
  onPrint
}) => {
  // 防护措施：确保hotKeysData存在且包含所需属性
  const safeHotKeysData = hotKeysData || {
    mostRelevant: [],
    allInSeeker: [],
    allFields: []
  };
  
  const hasAnyData = (safeHotKeysData.mostRelevant || []).length > 0 || 
                     (safeHotKeysData.allInSeeker || []).length > 0 || 
                     (safeHotKeysData.allFields || []).length > 0;

  return (
    <motion.div
      ref={trendingSearchesRef}
      id="trending-searches"
      className="mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold dark:text-white flex items-center">
          <IconHash className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          Trending Searches ( Monthly )
        </h2>
        {onPrint && (
          <button
            onClick={onPrint}
            className="flex items-center px-3 py-2 text-sm bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-700 dark:text-white rounded-lg transition-colors duration-200 no-print"
            title="Print this module"
          >
            <IconPrinter className="h-4 w-4 mr-1" />
            Print
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          // 骨架屏加载效果
          Array(3).fill(0).map((_, index) => (
            <TrendingSearchSkeleton key={index} />
          ))
        ) : (
          <>
            {(safeHotKeysData.mostRelevant || []).length > 0 && (
              <DemandRankingCard
                ranking={{
                  title: (
                    <div className="flex items-center">
                      <IconDevices className="mr-2 h-5 w-5 text-cyan-500" />
                      Most Relevant
                    </div>
                  ),
                  tags: safeHotKeysData.mostRelevant || []
                }}
              />
            )}
            {(safeHotKeysData.allInSeeker || []).length > 0 && (
              <DemandRankingCard
                ranking={{
                  title: (
                    <div className="flex items-center">
                      <IconCategory className="mr-2 h-5 w-5 text-purple-500" />
                      All in Seeker
                    </div>
                  ),
                  tags: safeHotKeysData.allInSeeker || []
                }}
              />
            )}
            {(safeHotKeysData.allFields || []).length > 0 && (
              <DemandRankingCard
                ranking={{
                  title: (
                    <div className="flex items-center">
                      <IconTrendingUp className="mr-2 h-5 w-5 text-green-500" />
                      All Fields
                    </div>
                  ),
                  tags: safeHotKeysData.allFields || []
                }}
              />
            )}
            {!hasAnyData && (
              <div className="col-span-3 text-center py-8 text-neutral-400">
                <p>No trending search data available. Please try searching again.</p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};