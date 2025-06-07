"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconClipboardList } from "@tabler/icons-react";

/**
 * 需求卡片数据类型
 */
export interface RequirementCardData {
  step: string;
  userStory: string;
  slogan: string;
  targetUser: string;
  plainPoints: string;
  usp: string[];
  revenueModel: string;
}

/**
 * 需求卡片组件
 * 展示收敛后的产品需求信息
 */
const RequirementCardContent = ({ requirement }: { requirement: RequirementCardData }) => (
  <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-md border border-neutral-200 dark:border-neutral-700">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Product Requirements</h3>
      <p className="text-lg text-cyan-600 dark:text-cyan-400 font-medium italic">{requirement.slogan}</p>
    </div>

    <div className="space-y-6">
      {/* 用户故事 */}
      <div>
        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">User Story</p>
        <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">{requirement.userStory}</p>
      </div>

      {/* 目标用户 */}
      <div>
        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">Target User</p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-blue-800 dark:text-blue-300 font-medium">{requirement.targetUser}</p>
        </div>
      </div>

      {/* 痛点 */}
      <div>
        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">Pain Points</p>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-red-800 dark:text-red-300">{requirement.plainPoints}</p>
        </div>
      </div>

      {/* 独特卖点 */}
      <div>
        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">Unique Selling Points</p>
        <div className="grid grid-cols-1 gap-2">
          {requirement.usp.filter(point => point != null).map((point, index) => (
            <div key={index} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-start">
                <span className="bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-green-800 dark:text-green-300 font-medium">{point}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 盈利模型 */}
      <div>
        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">Revenue Model</p>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
          <p className="text-purple-800 dark:text-purple-300 font-medium">{requirement.revenueModel}</p>
        </div>
      </div>
    </div>
  </div>
);

/**
 * 骨架加载样式 - 需求卡片
 */
const RequirementCardSkeleton = () => (
  <div className="bg-neutral-900 rounded-xl p-6 shadow-md border border-neutral-700 animate-pulse">
    <div className="mb-6">
      <div className="h-8 bg-neutral-800 rounded-md w-1/2 mb-2"></div>
      <div className="h-6 bg-neutral-800 rounded-md w-3/4"></div>
    </div>

    <div className="space-y-6">
      {/* 用户故事骨架 */}
      <div>
        <div className="h-4 bg-neutral-800 rounded-md w-1/4 mb-2"></div>
        <div className="h-16 bg-neutral-800 rounded-md w-full"></div>
      </div>

      {/* 目标用户骨架 */}
      <div>
        <div className="h-4 bg-neutral-800 rounded-md w-1/4 mb-2"></div>
        <div className="h-12 bg-neutral-800 rounded-lg w-full"></div>
      </div>

      {/* 痛点骨架 */}
      <div>
        <div className="h-4 bg-neutral-800 rounded-md w-1/4 mb-2"></div>
        <div className="h-12 bg-neutral-800 rounded-lg w-full"></div>
      </div>

      {/* USP骨架 */}
      <div>
        <div className="h-4 bg-neutral-800 rounded-md w-1/3 mb-2"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-neutral-800 rounded-lg w-full"></div>
          ))}
        </div>
      </div>

      {/* 盈利模型骨架 */}
      <div>
        <div className="h-4 bg-neutral-800 rounded-md w-1/4 mb-2"></div>
        <div className="h-12 bg-neutral-800 rounded-lg w-full"></div>
      </div>
    </div>
  </div>
);

interface RequirementCardProps {
  requirementData: RequirementCardData | null;
  loading: boolean;
  requirementRef: React.RefObject<HTMLDivElement>;
}

/**
 * 需求卡片展示组件
 */
export const RequirementCard: React.FC<RequirementCardProps> = ({
  requirementData,
  loading,
  requirementRef
}) => {
  return (
    <motion.div
      ref={requirementRef}
      id="requirement-card"
      className="mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-semibold mb-6 dark:text-white flex items-center">
        <IconClipboardList className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        Product Requirements
      </h2>
      <div className="max-w-4xl mx-auto">
        {requirementData ? (
          <RequirementCardContent requirement={requirementData} />
        ) : (
          loading ? (
            <RequirementCardSkeleton />
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <p>No requirement data available. Please try searching again.</p>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
};