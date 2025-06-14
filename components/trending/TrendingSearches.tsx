"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconHash, IconDevices, IconCategory, IconTrendingUp } from "@tabler/icons-react";
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
}

/**
 * 热门搜索组件
 */
export const TrendingSearches: React.FC<TrendingSearchesProps> = ({
  hotKeysData,
  loading,
  trendingSearchesRef
}) => {
  const hasAnyData = hotKeysData.mostRelevant.length > 0 || 
                     hotKeysData.allInSeeker.length > 0 || 
                     hotKeysData.allFields.length > 0;

  return (
    <motion.div
      ref={trendingSearchesRef}
      id="trending-searches"
      className="mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-6 dark:text-white flex items-center">
        <IconHash className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        Trending Searches ( Monthly )
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          // 骨架屏加载效果
          Array(3).fill(0).map((_, index) => (
            <TrendingSearchSkeleton key={index} />
          ))
        ) : (
          <>
            {hotKeysData.mostRelevant.length > 0 && (
              <DemandRankingCard
                ranking={{
                  title: (
                    <div className="flex items-center">
                      <IconDevices className="mr-2 h-5 w-5 text-cyan-500" />
                      Most Relevant
                    </div>
                  ),
                  tags: hotKeysData.mostRelevant
                }}
              />
            )}
            {hotKeysData.allInSeeker.length > 0 && (
              <DemandRankingCard
                ranking={{
                  title: (
                    <div className="flex items-center">
                      <IconCategory className="mr-2 h-5 w-5 text-purple-500" />
                      All in Seeker
                    </div>
                  ),
                  tags: hotKeysData.allInSeeker
                }}
              />
            )}
            {hotKeysData.allFields.length > 0 && (
              <DemandRankingCard
                ranking={{
                  title: (
                    <div className="flex items-center">
                      <IconTrendingUp className="mr-2 h-5 w-5 text-green-500" />
                      All Fields
                    </div>
                  ),
                  tags: hotKeysData.allFields
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