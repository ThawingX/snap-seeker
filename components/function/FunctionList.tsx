"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  IconList,
  IconStar,
  IconCircle,
  IconSquare,
  IconDots
} from "@tabler/icons-react";

/**
 * 功能清单数据类型
 */
export interface FunctionListData {
  step: string;
  type: "must-have" | "could-have" | "may-have" | "others";
  content: Record<string, string[]>;
}

/**
 * 功能清单组件
 * 展示四个优先级区域的功能清单，按面积递减排列
 */
const FunctionListContent = ({ functionData }: { functionData: FunctionListData[] }) => {
  // 按优先级排序数据
  const sortedData = functionData.sort((a, b) => {
    const priority = { "must-have": 0, "could-have": 1, "may-have": 2, "others": 3 };
    return priority[a.type] - priority[b.type];
  });

  // 获取优先级配置
  const getPriorityConfig = (type: string) => {
    switch (type) {
      case "must-have":
        return {
          title: "Must Have",
          icon: <IconStar className="w-5 h-5 text-white" />,
          bgColor: "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30",
          borderColor: "border-red-200 dark:border-red-700",
          iconBg: "bg-red-500 dark:bg-red-600",
          textColor: "text-red-800 dark:text-red-200",
          innerBg: "bg-gradient-to-br from-red-50/80 to-pink-50/80 dark:from-red-900/50 dark:to-pink-900/50",
          innerBorder: "border-red-200 dark:border-red-700",
          size: "col-span-2 row-span-2" // 最大区域
        };
      case "could-have":
        return {
          title: "Could Have",
          icon: <IconCircle className="w-4 h-4 text-white" />,
          bgColor: "bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30",
          borderColor: "border-orange-200 dark:border-orange-700",
          iconBg: "bg-orange-500 dark:bg-orange-600",
          textColor: "text-orange-800 dark:text-orange-200",
          innerBg: "bg-gradient-to-br from-orange-50/80 to-yellow-50/80 dark:from-orange-900/50 dark:to-yellow-900/50",
          innerBorder: "border-orange-200 dark:border-orange-700",
          size: "col-span-1 row-span-2" // 中等区域
        };
      case "may-have":
        return {
          title: "May Have",
          icon: <IconSquare className="w-4 h-4 text-white" />,
          bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30",
          borderColor: "border-blue-200 dark:border-blue-700",
          iconBg: "bg-blue-500 dark:bg-blue-600",
          textColor: "text-blue-800 dark:text-blue-200",
          innerBg: "bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/50 dark:to-cyan-900/50",
          innerBorder: "border-blue-200 dark:border-blue-700",
          size: "col-span-1 row-span-1" // 较小区域
        };
      case "others":
        return {
          title: "Others",
          icon: <IconDots className="w-4 h-4 text-white" />,
          bgColor: "bg-gradient-to-br from-gray-50 to-zinc-50 dark:from-gray-900/30 dark:to-zinc-900/30",
          borderColor: "border-gray-200 dark:border-gray-700",
          iconBg: "bg-gray-500 dark:bg-gray-600",
          textColor: "text-gray-800 dark:text-gray-200",
          innerBg: "bg-gradient-to-br from-gray-50/80 to-zinc-50/80 dark:from-gray-900/50 dark:to-zinc-900/50",
          innerBorder: "border-gray-200 dark:border-gray-700",
          size: "col-span-1 row-span-1" // 最小区域
        };
      default:
        return {
          title: "Unknown",
          icon: <IconDots className="w-4 h-4 text-white" />,
          bgColor: "bg-gradient-to-br from-gray-50 to-zinc-50 dark:from-gray-900/30 dark:to-zinc-900/30",
          borderColor: "border-gray-200 dark:border-gray-700",
          iconBg: "bg-gray-500 dark:bg-gray-600",
          textColor: "text-gray-800 dark:text-gray-200",
          innerBg: "bg-gradient-to-br from-gray-50/80 to-zinc-50/80 dark:from-gray-900/50 dark:to-zinc-900/50",
          innerBorder: "border-gray-200 dark:border-gray-700",
          size: "col-span-1 row-span-1"
        };
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-md border border-neutral-200 dark:border-neutral-800">

      {/* 网格布局 - 使用CSS Grid实现不同大小的区域 */}
      <div className="grid grid-cols-3 grid-rows-3 gap-6 min-h-[600px]">
        {sortedData.map((item, index) => {
          const config = getPriorityConfig(item.type);

          return (
            <motion.div
              key={`${item.type}-${index}`}
              className={`${config.bgColor} ${config.borderColor} ${config.size} rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* 标题区域 */}
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 ${config.iconBg} rounded-lg flex items-center justify-center mr-3`}>
                  {config.icon}
                </div>
                <h4 className={`text-lg font-bold ${config.textColor}`}>{config.title}</h4>
              </div>

              {/* 功能列表内容 */}
              <div className={`${config.innerBg} ${config.innerBorder} border rounded-lg p-4 h-full overflow-y-auto`}>
                <div className="space-y-4">
                  {Object.entries(item.content).map(([module, features]) => (
                    <div key={module} className="space-y-2">
                      <h5 className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm border-b border-neutral-200 dark:border-neutral-600 pb-1">
                        {module}
                      </h5>
                      <ul className="space-y-1">
                        {features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="text-sm text-neutral-700 dark:text-neutral-300 flex items-start"
                          >
                            <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 功能清单骨架屏组件
 */
const FunctionListSkeleton = () => (
  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-md border border-neutral-200 dark:border-neutral-800">
    {/* 标题骨架 */}
    <div className="bg-gray-50/60 dark:bg-gray-800/60 rounded-xl p-6 mb-8 shadow-sm border border-gray-200/30 dark:border-gray-600/30">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 w-1/3 animate-pulse"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 animate-pulse"></div>
    </div>

    {/* 网格骨架 */}
    <div className="grid grid-cols-3 grid-rows-3 gap-6 min-h-[600px]">
      {/* Must Have - 大区域 */}
      <div className="col-span-2 row-span-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg mr-3"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>

      {/* Could Have - 中等区域 */}
      <div className="col-span-1 row-span-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg mr-3"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>

      {/* May Have - 小区域 */}
      <div className="col-span-1 row-span-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg mr-3"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>

      {/* Others - 小区域 */}
      <div className="col-span-1 row-span-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg mr-3"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>

      {/* 空白区域 */}
      <div className="col-span-1 row-span-1 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <div className="text-gray-400 dark:text-gray-600 text-sm">Loading...</div>
      </div>
    </div>
  </div>
);

/**
 * 功能清单组件属性
 */
interface FunctionListProps {
  functionData: FunctionListData[];
  loading: boolean;
  functionListRef: React.RefObject<HTMLDivElement>;
}

/**
 * 功能清单主组件
 */
export const FunctionList: React.FC<FunctionListProps> = ({
  functionData,
  loading,
  functionListRef
}) => {
  return (
    <motion.div
      ref={functionListRef}
      id="function-list"
      className="mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-semibold mb-6 dark:text-white flex items-center">
        <IconList className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        Function List
        <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400 font-normal">
          (Prioritized by importance)
        </span>
      </h2>
      {functionData?.length > 0 ? (
        <FunctionListContent functionData={functionData} />
      ) : (
        loading ? (
          <FunctionListSkeleton />
        ) : (
          <div className="text-center py-8 text-neutral-400">
            <p>No function list data available. Please try searching again.</p>
          </div>
        )
      )}
    </motion.div>
  );
};