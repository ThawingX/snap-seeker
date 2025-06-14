"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconLock, IconBulb, IconTarget } from "@tabler/icons-react";
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * 锁定内容组件
 * 用于显示需要付费解锁的内容
 */
const LockedContentCard = ({ title, description }: { title: string; description: string }) => {
  const handleUpgradeClick = () => {
    trackEvent(ANALYTICS_EVENTS.UPGRADE_CLICK, {
      content_type: title,
      content_id: title.toLowerCase().replace(/\s+/g, '_')
    });
  };

  return (
    <div className="relative bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-md mb-6 overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{title}</h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">{description}</p>

        <div className="mt-4 flex justify-center items-center">
          <Link
            href="/login?mode=signup"
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full flex items-center space-x-2 transition-colors"
            onClick={handleUpgradeClick}
          >
            <IconLock size={18} />
            <span>Upgrade to Unlock</span>
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-t from-white/80 dark:from-black/80 to-transparent flex items-center justify-center">
        <div className="w-full h-full relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-black/80 to-transparent" />
        </div>
      </div>
    </div>
  );
};

/**
 * 骨架加载样式 - 洞察部分
 */
const InsightsSkeleton = () => (
  <div className="bg-muted rounded-xl p-6 mb-6 animate-pulse">
    <div className="h-7 bg-neutral-800 rounded-md w-1/4 mb-6"></div>
    <div className="space-y-6">
      <div>
        <div className="h-5 bg-neutral-800 rounded-md w-1/3 mb-3"></div>
        <div className="h-4 bg-neutral-800 rounded-md w-full mb-2"></div>
        <div className="h-4 bg-neutral-800 rounded-md w-full"></div>
      </div>
      <div>
        <div className="h-5 bg-neutral-800 rounded-md w-2/5 mb-3"></div>
        <div className="h-4 bg-neutral-800 rounded-md w-full mb-2"></div>
        <div className="h-4 bg-neutral-800 rounded-md w-3/4"></div>
      </div>
      <div>
        <div className="h-5 bg-neutral-800 rounded-md w-1/3 mb-3"></div>
        <div className="h-4 bg-neutral-800 rounded-md w-full mb-2"></div>
        <div className="h-4 bg-neutral-800 rounded-md w-full"></div>
      </div>
    </div>
  </div>
);

/**
 * 骨架加载样式 - 建议行动部分
 */
const RecommendationsSkeleton = () => (
  <div className="bg-muted rounded-xl p-6 animate-pulse">
    <div className="h-7 bg-neutral-800 rounded-md w-2/5 mb-6"></div>
    <div className="space-y-3">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="flex items-start">
          <div className="h-3 w-3 rounded-full bg-neutral-800 mt-1 mr-3 flex-shrink-0"></div>
          <div className="h-4 bg-neutral-800 rounded-md w-full"></div>
        </div>
      ))}
    </div>
  </div>
);

interface MVPStrategyProps {
  loading: boolean;
  insightsRef: React.RefObject<HTMLDivElement>;
}

interface PMFAnalysisProps {
  loading: boolean;
  recommendationsRef: React.RefObject<HTMLDivElement>;
}

/**
 * MVP策略推荐组件
 */
export const MVPStrategy: React.FC<MVPStrategyProps> = ({ loading, insightsRef }) => {
  return (
    <motion.div
      ref={insightsRef}
      id="insights"
      className="mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-neutral-900 dark:text-white flex items-center">
        <IconBulb className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        MVP Strategy Recommendations
      </h2>
      {loading ? (
        <InsightsSkeleton />
      ) : (
        <LockedContentCard
          title="Customized MVP Strategy Analysis"
          description="Get detailed recommendations for your Minimum Viable Product (MVP), including core features, technology stack selection, and development timeline planning."
        />
      )}
    </motion.div>
  );
};

/**
 * PMF分析组件
 */
export const PMFAnalysis: React.FC<PMFAnalysisProps> = ({ loading, recommendationsRef }) => {
  return (
    <motion.div
      ref={recommendationsRef}
      id="recommendations"
      className="mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-neutral-900 dark:text-white flex items-center">
        <IconTarget className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        Product-Market Fit (PMF) Analysis
      </h2>
      {loading ? (
        <RecommendationsSkeleton />
      ) : (
        <LockedContentCard
          title="PMF Achievement Strategy"
          description="In-depth analysis of product-market fit, providing market entry strategies, user acquisition plans, and product iteration recommendations."
        />
      )}
    </motion.div>
  );
};