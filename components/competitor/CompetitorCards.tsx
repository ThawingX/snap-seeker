"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconChartBar } from "@tabler/icons-react";
import { CompetitorData } from "@/types/competitor";

/**
 * 竞争对手信息卡组件
 * 展示单个竞争对手的详细信息
 */
const CompetitorCard = ({ competitor }: { competitor: CompetitorData }) => (
  <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-md mb-6">
    <div className="mb-4">
      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{competitor.name}</h3>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm italic">{competitor.slogan}</p>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Relevance</p>
        <p className="text-neutral-800 dark:text-neutral-200">{competitor.relevance}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Traffic</p>
        <p className="text-neutral-800 dark:text-neutral-200">{competitor.traffic}</p>
      </div>
    </div>

    <div className="mb-4">
      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">Target User</p>
      <div className="flex flex-wrap gap-2">
        {competitor.targetUser.map((user, index) => (
          <span key={index} className="bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-300 px-2 py-1 rounded text-xs">
            {user}
          </span>
        ))}
      </div>
    </div>

    <div className="mb-4">
      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">Plain Points</p>
      <ul className="list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
        {competitor.plainPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>

    <div className="mb-4">
      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">Key Features</p>
      <ul className="list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
        {competitor.keyFeatures.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>

    <div className="mb-4">
      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">Potential Weaknesses</p>
      <ul className="list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
        {competitor.potentialWeaknesses.map((weakness, index) => (
          <li key={index}>{weakness}</li>
        ))}
      </ul>
    </div>

    <div>
      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">Revenue Model</p>
      <p className="text-neutral-800 dark:text-neutral-200">{competitor.revenueModel}</p>
    </div>
  </div>
);

/**
 * 骨架加载样式 - 竞争对手卡片
 */
const CompetitorCardSkeleton = () => (
  <div className="bg-neutral-900 rounded-xl p-5 shadow-md mb-6 animate-pulse">
    <div className="mb-4">
      <div className="h-6 bg-neutral-800 rounded-md w-2/3 mb-2"></div>
      <div className="h-4 bg-neutral-800 rounded-md w-1/2"></div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <div className="h-4 bg-neutral-800 rounded-md w-2/3 mb-2"></div>
        <div className="h-5 bg-neutral-800 rounded-md w-full"></div>
      </div>
      <div>
        <div className="h-4 bg-neutral-800 rounded-md w-2/3 mb-2"></div>
        <div className="h-5 bg-neutral-800 rounded-md w-full"></div>
      </div>
    </div>

    <div className="mb-4">
      <div className="h-4 bg-neutral-800 rounded-md w-1/3 mb-2"></div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 bg-neutral-800 rounded-md w-20"></div>
        ))}
      </div>
    </div>

    <div className="mb-4">
      <div className="h-4 bg-neutral-800 rounded-md w-1/3 mb-2"></div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 bg-neutral-800 rounded-md w-full"></div>
        ))}
      </div>
    </div>

    <div className="mb-4">
      <div className="h-4 bg-neutral-800 rounded-md w-1/3 mb-2"></div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 bg-neutral-800 rounded-md w-full"></div>
        ))}
      </div>
    </div>

    <div>
      <div className="h-4 bg-neutral-800 rounded-md w-1/3 mb-2"></div>
      <div className="h-4 bg-neutral-800 rounded-md w-3/4"></div>
    </div>
  </div>
);

interface CompetitorCardsProps {
  competitorData: CompetitorData[];
  loading: boolean;
  competitorsRef: React.RefObject<HTMLDivElement>;
}

/**
 * 竞争对手卡片展示组件
 */
export const CompetitorCards: React.FC<CompetitorCardsProps> = ({
  competitorData,
  loading,
  competitorsRef
}) => {
  return (
    <motion.div
      ref={competitorsRef}
      id="competitors"
      className="mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-semibold mb-6 dark:text-white flex items-center">
        <IconChartBar className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        Main Competitors
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitorData.length > 0 ? (
          <>
            {competitorData.map((competitor) => (
              <CompetitorCard key={competitor.id} competitor={competitor} />
            ))}
            {loading && competitorData.length < 3 &&
              Array(3 - competitorData.length).fill(0).map((_, index) => (
                <CompetitorCardSkeleton key={`skeleton-${index}`} />
              ))
            }
          </>
        ) : (
          loading ? (
            Array(3).fill(0).map((_, index) => (
              <CompetitorCardSkeleton key={index} />
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-neutral-400">
              <p>No competitor data available. Please try searching again.</p>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
};