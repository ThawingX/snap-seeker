import React from "react";
import { motion } from "framer-motion";
import {
  IconList,
  IconStar,
  IconCircle,
  IconSquare,
  IconDots,
  IconPrinter
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
  // 防护措施：确保functionData是数组
  const safeData = functionData || [];
  
  // 按优先级排序数据
  const sortedData = safeData.sort((a, b) => {
    const priority = { "must-have": 0, "could-have": 1, "may-have": 2, "others": 3 };
    return priority[a.type] - priority[b.type];
  });

  // 计算内容高度和获取优先级配置
  const getPriorityConfig = (type: string, contentLength: number) => {
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
          responsiveSize: "md:col-span-2 md:row-span-1"
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
          responsiveSize: "md:col-span-1 md:row-span-1"
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
          responsiveSize: "md:col-span-1 md:row-span-1"
        };
      case "others":
      default:
        return {
          title: "Others",
          icon: <IconDots className="w-4 h-4 text-white" />,
          bgColor: "bg-gradient-to-br from-gray-50 to-zinc-50 dark:from-gray-900/30 dark:to-zinc-900/30",
          borderColor: "border-gray-200 dark:border-gray-700",
          iconBg: "bg-gray-500 dark:bg-gray-600",
          textColor: "text-gray-800 dark:text-gray-200",
          innerBg: "bg-gradient-to-br from-gray-50/80 to-zinc-50/80 dark:from-gray-900/50 dark:to-zinc-900/50",
          innerBorder: "border-gray-200 dark:border-gray-700",
          responsiveSize: "md:col-span-1 md:row-span-1"
        };
    }
  };

  // 计算总内容数量用于动态布局
  const calculateContentLength = (content: Record<string, string[]>) => {
    return Object.values(content).reduce((total, features) => total + features.length, 0);
  };

  // 动态计算网格高度
  const calculateGridHeight = () => {
    const totalItems = sortedData.length;
    const hasLargeContent = sortedData.some(item => calculateContentLength(item.content) > 10);
    
    if (totalItems <= 2) return "min-h-[300px]";
    if (totalItems === 3 && hasLargeContent) return "min-h-[400px]";
    if (totalItems >= 4 || hasLargeContent) return "min-h-[450px]";
    return "min-h-[350px]";
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-8 shadow-md border border-neutral-200 dark:border-neutral-800">
      {/* 网格布局 - 移动端单列，桌面端3列网格 */}
      <div className={`grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-4 md:gap-6 ${calculateGridHeight()}`}>
        {sortedData.map((item, index) => {
          const contentLength = calculateContentLength(item.content);
          const config = getPriorityConfig(item.type, contentLength);

          return (
            <motion.div
              key={`${item.type}-${index}`}
              className={`${config.bgColor} ${config.borderColor} col-span-1 ${config.responsiveSize} rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* 标题区域 */}
              <div className="flex items-center mb-4 flex-shrink-0">
                <div className={`w-8 h-8 ${config.iconBg} rounded-lg flex items-center justify-center mr-3`}>
                  {config.icon}
                </div>
                <h4 className={`text-lg font-bold ${config.textColor}`}>{config.title}</h4>
              </div>

              {/* 功能列表内容 - 使用flex-1确保填满剩余空间 */}
              <div className={`${config.innerBg} ${config.innerBorder} border rounded-lg p-4 flex-1 overflow-y-auto`}>
                <div className="space-y-4 h-full">
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
                  {/* 如果内容较少，添加填充空间 */}
                  {contentLength < 5 && (
                    <div className="flex-1 flex items-end justify-center text-neutral-400 dark:text-neutral-600 text-xs">
                      <span className="opacity-50">• • •</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* 如果数据不足4个，填充空白区域 - 仅在桌面端显示 */}
        {sortedData.length < 4 && Array.from({ length: 4 - sortedData.length }).map((_, index) => (
          <div 
            key={`empty-${index}`} 
            className="hidden md:flex col-span-1 row-span-1 bg-gray-50/30 dark:bg-gray-900/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 items-center justify-center"
          >
            <div className="text-gray-400 dark:text-gray-600 text-sm opacity-50">
              <IconDots className="w-6 h-6 mx-auto mb-2" />
              <span>Available</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 功能清单骨架屏组件
 */
const FunctionListSkeleton = () => (
  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-8 shadow-md border border-neutral-200 dark:border-neutral-800">
    {/* 网格骨架 - 移动端单列，桌面端3列网格 */}
    <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-4 md:gap-6 min-h-[400px] md:min-h-[600px]">
      {/* Must Have - 大区域 */}
      <div className="col-span-1 md:col-span-2 md:row-span-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 md:p-6 animate-pulse">
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
      <div className="col-span-1 md:row-span-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 md:p-6 animate-pulse">
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
      <div className="col-span-1 md:row-span-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 md:p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg mr-3"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>

      {/* Others - 小区域 */}
      <div className="col-span-1 md:row-span-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 md:p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg mr-3"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
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
  onPrint?: () => void;
}

/**
 * 功能清单主组件
 */
const FunctionList: React.FC<FunctionListProps> = ({
  functionData,
  loading,
  functionListRef,
  onPrint
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <h2 className="text-xl md:text-2xl font-semibold dark:text-white flex items-center">
          <IconList className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          Function List
          <span className="ml-2 text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-normal hidden sm:inline">
            (Prioritized by importance)
          </span>
        </h2>
        {onPrint && (
          <button
            onClick={onPrint}
            className="flex items-center justify-center px-3 py-2 text-sm bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-700 dark:text-white rounded-lg transition-colors duration-200 no-print self-start sm:self-auto"
            title="Print this module"
          >
            <IconPrinter className="h-4 w-4 mr-1" />
            Print
          </button>
        )}
      </div>
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

// 导出所有必要的组件和类型
export { FunctionList, FunctionListContent, FunctionListSkeleton };