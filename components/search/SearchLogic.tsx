"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconBrain, IconPrinter } from "@tabler/icons-react";
import { SearchStep } from "@/types/competitor";

/**
 * 分析步骤组件
 * 用于链式思考部分展示每个分析步骤
 */
const Step = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <motion.div
    className="flex mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: number * 0.2 }}
  >
    <div className="flex-shrink-0 mr-4">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-cyan-500 text-white font-bold">
        {number}
      </div>
    </div>
    <div className="flex-grow">
      <h3 className="text-lg font-medium mb-2 text-white">{title}</h3>
      <p className="text-neutral-300 text-sm">{description}</p>
    </div>
  </motion.div>
);

/**
 * 骨架加载样式 - 步骤条目
 */
const StepSkeleton = ({ number }: { number: number }) => (
  <motion.div
    className="flex mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: number * 0.1 }}
  >
    <div className="flex-shrink-0 mr-4">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-neutral-800 text-neutral-700 font-bold animate-pulse">
        {number}
      </div>
    </div>
    <div className="flex-grow">
      <div className="h-6 bg-neutral-800 rounded-md w-1/3 mb-2 animate-pulse"></div>
      <div className="h-4 bg-neutral-800 rounded-md w-full animate-pulse"></div>
    </div>
  </motion.div>
);

interface SearchLogicProps {
  searchSteps: SearchStep[];
  loading: boolean;
  query: string;
  searchLogicRef: React.RefObject<HTMLDivElement>;
  onPrint?: () => void;
}

/**
 * 搜索逻辑思考链组件
 */
export const SearchLogic: React.FC<SearchLogicProps> = ({
  searchSteps,
  loading,
  query,
  searchLogicRef,
  onPrint
}) => {
  return (
    <motion.div
      ref={searchLogicRef}
      id="search-logic"
      className="bg-muted rounded-xl p-6 mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white flex items-center">
          <IconBrain className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          Search Processing Logic
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
      <div className="mb-4 border-l-2 border-cyan-500 pl-4">
        <p className="text-neutral-300 italic">
          "Analyzing competitors in the market to identify strengths, weaknesses, and opportunities for {query}..."
        </p>
      </div>
      <div className="space-y-0">
        {searchSteps.length > 0 ? (
          searchSteps.filter(step => step != null).map((step, index) => (
            <Step
              key={index}
              number={index + 1}
              title={step.title}
              description={step.description}
            />
          ))
        ) : (
          loading ? (
            // 骨架屏加载效果
            Array(5).fill(0).map((_, index) => (
              <StepSkeleton key={index} number={index + 1} />
            ))
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <p>No search logic data available. Please try searching again.</p>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
};