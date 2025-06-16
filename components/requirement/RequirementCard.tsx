"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  IconClipboardList, 
  IconUser, 
  IconBook, 
  IconAlertTriangle, 
  IconCoin, 
  IconStar,
  IconPrinter 
} from "@tabler/icons-react";

/**
 * 需求卡片数据类型
 */
export interface RequirementCardData {
  step: string;
  userStory: string;
  slogan: string;
  targetUser: string;
  painPoints: string;
  usp: string[];
  revenueModel: string;
}

/**
 * 需求卡片组件
 * 展示收敛后的产品需求信息 - 卡片嵌套卡片布局
 */
const RequirementCardContent = ({ requirement }: { requirement: RequirementCardData }) => (
  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-md border border-neutral-200 dark:border-neutral-800">
    {/* 主标题卡片 */}
    <div className="bg-gray-50/60 dark:bg-gray-800/60 rounded-xl p-6 mb-8 shadow-sm border border-gray-200/30 dark:border-gray-600/30">
      <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">Finalized Requirement Card</h3>
      <p className="text-xl text-gray-600 dark:text-gray-400 font-medium italic">{requirement.slogan}</p>
    </div>

    {/* 卡片网格布局 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 用户故事卡片 - 采用目标用户的青色调 */}
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-xl p-6 shadow-md border border-cyan-200 dark:border-cyan-700 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-cyan-500 dark:bg-cyan-600 rounded-lg flex items-center justify-center mr-3">
            <IconBook className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-lg font-bold text-cyan-800 dark:text-cyan-200">User Story</h4>
        </div>
        <div className="bg-gradient-to-br from-cyan-50/80 to-teal-50/80 dark:from-cyan-900/50 dark:to-teal-900/50 border border-cyan-200 dark:border-cyan-700 rounded-lg p-4">
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">{requirement.userStory}</p>
        </div>
      </div>

      {/* 目标用户卡片 - 突出青色调 */}
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-xl p-6 shadow-md border border-cyan-200 dark:border-cyan-700 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-cyan-500 dark:bg-cyan-600 rounded-lg flex items-center justify-center mr-3">
            <IconUser className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-lg font-bold text-cyan-800 dark:text-cyan-200">Target User</h4>
        </div>
        <div className="bg-gradient-to-br from-cyan-50/80 to-teal-50/80 dark:from-cyan-900/50 dark:to-teal-900/50 border border-cyan-200 dark:border-cyan-700 rounded-lg p-4">
          <p className="text-neutral-700 dark:text-neutral-300 font-medium">{requirement.targetUser}</p>
        </div>
      </div>

      {/* 痛点卡片 - 采用默认颜色 */}
      <div className="bg-gradient-to-br from-zinc-50/50 to-gray-50/50 dark:from-zinc-800/40 dark:to-gray-800/40 rounded-xl p-6 shadow-sm border border-zinc-200/30 dark:border-zinc-600/30 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-zinc-500/70 dark:bg-zinc-600/70 rounded-lg flex items-center justify-center mr-3">
            <IconAlertTriangle className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-lg font-bold text-zinc-700 dark:text-zinc-200">Pain Points</h4>
        </div>
        <div className="bg-gradient-to-br from-zinc-50/80 to-gray-50/80 dark:from-zinc-800/60 dark:to-gray-800/60 border border-zinc-200/30 dark:border-zinc-600/30 rounded-lg p-4">
          <p className="text-neutral-700 dark:text-neutral-300 font-medium">{requirement.painPoints}</p>
        </div>
      </div>

      {/* 盈利模型卡片 - 低调冷灰色调 */}
      <div className="bg-gradient-to-br from-zinc-50/50 to-gray-50/50 dark:from-zinc-800/40 dark:to-gray-800/40 rounded-xl p-6 shadow-sm border border-zinc-200/30 dark:border-zinc-600/30 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-zinc-500/70 dark:bg-zinc-600/70 rounded-lg flex items-center justify-center mr-3">
            <IconCoin className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-lg font-bold text-zinc-700 dark:text-zinc-200">Revenue Model</h4>
        </div>
        <div className="bg-gradient-to-br from-zinc-50/80 to-gray-50/80 dark:from-zinc-800/60 dark:to-gray-800/60 border border-zinc-200/30 dark:border-zinc-600/30 rounded-lg p-4">
          <p className="text-zinc-700 dark:text-zinc-300 font-medium">{requirement.revenueModel}</p>
        </div>
      </div>
    </div>

    {/* 独特卖点卡片 - 低调中性灰色调 */}
    <div className="bg-gradient-to-br from-neutral-50/50 to-gray-50/50 dark:from-neutral-800/40 dark:to-gray-800/40 rounded-xl p-6 shadow-sm border border-neutral-200/30 dark:border-neutral-600/30 hover:shadow-md transition-shadow duration-300 mt-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-neutral-500/70 dark:bg-neutral-600/70 rounded-lg flex items-center justify-center mr-3">
          <IconStar className="w-4 h-4 text-white" />
        </div>
        <h4 className="text-lg font-bold text-neutral-700 dark:text-neutral-200">Unique Selling Points</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requirement.usp.filter(point => point != null).map((point, index) => (
          <div key={index} className="bg-gradient-to-br from-neutral-50/80 to-gray-50/80 dark:from-neutral-800/60 dark:to-gray-800/60 border border-neutral-200/30 dark:border-neutral-600/30 rounded-lg p-4">
            <div className="flex items-start">
              <span className="bg-neutral-500/70 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                {index + 1}
              </span>
              <p className="text-neutral-700 dark:text-neutral-300 font-medium">{point}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * 骨架加载样式 - 需求卡片（卡片嵌套布局）
 */
const RequirementCardSkeleton = () => (
  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-md border border-neutral-200 dark:border-neutral-800 animate-pulse">
    {/* 主标题卡片骨架 */}
    <div className="bg-gray-100/60 dark:bg-gray-700/60 rounded-xl p-6 mb-8 shadow-sm border border-gray-200/30 dark:border-gray-600/30">
      <div className="h-8 bg-gray-200/70 dark:bg-gray-600/70 rounded-lg mb-3 w-3/4"></div>
      <div className="h-6 bg-gray-200/70 dark:bg-gray-600/70 rounded-lg w-1/2"></div>
    </div>

    {/* 卡片网格布局骨架 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 用户故事卡片骨架 - 采用目标用户的青色调 */}
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-xl p-6 shadow-md border border-cyan-200 dark:border-cyan-700">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-cyan-300 dark:bg-cyan-600 rounded-lg mr-3"></div>
          <div className="h-6 bg-cyan-200 dark:bg-cyan-600 rounded-lg w-24"></div>
        </div>
        <div className="bg-gradient-to-br from-cyan-50/80 to-teal-50/80 dark:from-cyan-900/50 dark:to-teal-900/50 rounded-lg p-4">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 w-4/5"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/5"></div>
        </div>
      </div>

      {/* 目标用户卡片骨架 - 突出青色调 */}
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-xl p-6 shadow-md border border-cyan-200 dark:border-cyan-700">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-cyan-300 dark:bg-cyan-600 rounded-lg mr-3"></div>
          <div className="h-6 bg-cyan-200 dark:bg-cyan-600 rounded-lg w-28"></div>
        </div>
        <div className="bg-gradient-to-br from-cyan-50/80 to-teal-50/80 dark:from-cyan-900/50 dark:to-teal-900/50 rounded-lg p-4">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
        </div>
      </div>

      {/* 痛点卡片骨架 - 采用默认颜色 */}
      <div className="bg-gradient-to-br from-zinc-50/50 to-gray-50/50 dark:from-zinc-800/40 dark:to-gray-800/40 rounded-xl p-6 shadow-sm border border-zinc-200/30 dark:border-zinc-600/30">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-zinc-300/60 dark:bg-zinc-600/60 rounded-lg mr-3"></div>
          <div className="h-6 bg-zinc-200/60 dark:bg-zinc-600/60 rounded-lg w-24"></div>
        </div>
        <div className="bg-gradient-to-br from-zinc-50/80 to-gray-50/80 dark:from-zinc-800/60 dark:to-gray-800/60 rounded-lg p-4">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 w-5/6"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
        </div>
      </div>

      {/* 盈利模型卡片骨架 - 冷灰色调 */}
      <div className="bg-gradient-to-br from-zinc-50/50 to-gray-50/50 dark:from-zinc-800/40 dark:to-gray-800/40 rounded-xl p-6 shadow-sm border border-zinc-200/30 dark:border-zinc-600/30">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-zinc-300/60 dark:bg-zinc-600/60 rounded-lg mr-3"></div>
          <div className="h-6 bg-zinc-200/60 dark:bg-zinc-600/60 rounded-lg w-32"></div>
        </div>
        <div className="bg-gradient-to-br from-zinc-50/80 to-gray-50/80 dark:from-zinc-800/60 dark:to-gray-800/60 rounded-lg p-4">
          <div className="h-4 bg-zinc-200/50 dark:bg-zinc-700/50 rounded mb-2"></div>
          <div className="h-4 bg-zinc-200/50 dark:bg-zinc-700/50 rounded w-4/5"></div>
        </div>
      </div>
    </div>

    {/* 独特卖点卡片骨架 - 中性灰色调 */}
    <div className="bg-gradient-to-br from-neutral-50/50 to-gray-50/50 dark:from-neutral-800/40 dark:to-gray-800/40 rounded-xl p-6 shadow-sm border border-neutral-200/30 dark:border-neutral-600/30 mt-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-neutral-300/60 dark:bg-neutral-600/60 rounded-lg mr-3"></div>
        <div className="h-6 bg-neutral-200/60 dark:bg-neutral-600/60 rounded-lg w-40"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-gradient-to-br from-neutral-50/80 to-gray-50/80 dark:from-neutral-800/60 dark:to-gray-800/60 rounded-lg p-4">
            <div className="flex items-start">
              <div className="bg-neutral-300/60 dark:bg-neutral-600/60 rounded-full w-6 h-6 mr-3 mt-0.5 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-neutral-200/50 dark:bg-neutral-700/50 rounded mb-2"></div>
                <div className="h-4 bg-neutral-200/50 dark:bg-neutral-700/50 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface RequirementCardProps {
  requirementData: RequirementCardData | null;
  loading: boolean;
  requirementRef: React.RefObject<HTMLDivElement>;
  onPrint?: () => void;
}

/**
 * 需求卡片展示组件
 */
export const RequirementCard: React.FC<RequirementCardProps> = ({
  requirementData,
  loading,
  requirementRef,
  onPrint
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold dark:text-white flex items-center">
          <IconClipboardList className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          Finalized Requirement Card
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
      <div className="max-w-6xl mx-auto">
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