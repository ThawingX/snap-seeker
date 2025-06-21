import React from "react";
import { motion } from "framer-motion";
import { IconTable, IconPrinter } from "@tabler/icons-react";
import { CompetitorData } from "@/types/competitor";

/**
 * 骨架加载样式 - 表格行
 */
const TableRowSkeleton = () => (
  <tr className="border-b border-neutral-800">
    <td className="p-4"><div className="h-5 bg-neutral-800 rounded-md w-full animate-pulse"></div></td>
    <td className="p-4"><div className="h-5 bg-neutral-800 rounded-md w-full animate-pulse"></div></td>
    <td className="p-4">
      <div className="w-full bg-neutral-800 rounded-full h-2 mb-1 animate-pulse"></div>
      <div className="h-4 bg-neutral-800 rounded-md w-1/2 animate-pulse"></div>
    </td>
    <td className="p-4"><div className="h-5 bg-neutral-800 rounded-md w-full animate-pulse"></div></td>
    <td className="p-4">
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-4 bg-neutral-800 rounded-md w-full animate-pulse"></div>
        ))}
      </div>
    </td>
    <td className="p-4">
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-4 bg-neutral-800 rounded-md w-full animate-pulse"></div>
        ))}
      </div>
    </td>
    <td className="p-4">
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-4 bg-neutral-800 rounded-md w-full animate-pulse"></div>
        ))}
      </div>
    </td>
    <td className="p-4"><div className="h-5 bg-neutral-800 rounded-md w-full animate-pulse"></div></td>
  </tr>
);

/**
 * 骨架加载样式 - 移动端卡片
 */
const MobileCardSkeleton = () => (
  <div className="bg-neutral-900 rounded-lg p-4 space-y-3">
    <div className="h-6 bg-neutral-800 rounded-md w-3/4 animate-pulse"></div>
    <div className="h-4 bg-neutral-800 rounded-md w-1/2 animate-pulse"></div>
    <div className="space-y-2">
      <div className="h-4 bg-neutral-800 rounded-md w-full animate-pulse"></div>
      <div className="h-4 bg-neutral-800 rounded-md w-2/3 animate-pulse"></div>
    </div>
  </div>
);

interface CompetitorTableProps {
  competitorData: CompetitorData[];
  loading: boolean;
  tableRef: React.RefObject<HTMLDivElement>;
  onPrint?: () => void;
}

/**
 * 竞争对手数据表格组件
 */
export const CompetitorTable: React.FC<CompetitorTableProps> = ({
  competitorData,
  loading,
  tableRef,
  onPrint
}) => {
  // 防护措施：确保competitorData是数组
  const safeCompetitorData = competitorData || [];
  
  return (
    <motion.div
      ref={tableRef}
      id="table"
      className="mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white flex items-center">
          <IconTable className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          Competitor Table
        </h2>
        {onPrint && (
          <button
            onClick={onPrint}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <IconPrinter className="mr-2 h-4 w-4" />
            Print
          </button>
        )}
      </div>

      {loading ? (
        <>
          {/* 移动端骨架屏 */}
          <div className="block md:hidden space-y-4">
            {[1, 2, 3].map((i) => (
              <MobileCardSkeleton key={i} />
            ))}
          </div>
          
          {/* 桌面端骨架屏 */}
          <div className="hidden md:block overflow-x-auto">
            <div className="min-w-[1200px]">
              <table className="w-full border-collapse bg-neutral-900 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-neutral-800">
                    <th className="p-4 text-left text-neutral-300 font-medium">Product</th>
                    <th className="p-4 text-left text-neutral-300 font-medium">Slogan</th>
                    <th className="p-4 text-left text-neutral-300 font-medium">Relevance</th>
                    <th className="p-4 text-left text-neutral-300 font-medium">Traffic</th>
                    <th className="p-4 text-left text-neutral-300 font-medium">Target Users</th>
                    <th className="p-4 text-left text-neutral-300 font-medium">Pain Points</th>
                    <th className="p-4 text-left text-neutral-300 font-medium">Key Features</th>
                    <th className="p-4 text-left text-neutral-300 font-medium">Revenue Model</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        safeCompetitorData.length > 0 ? (
          <>
            {/* 移动端卡片视图 */}
            <div className="block md:hidden space-y-4">
              {safeCompetitorData.map((competitor, index) => (
                <div key={index} className="bg-neutral-900 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{competitor.product}</h3>
                    <span className="text-sm text-neutral-400">{competitor.traffic}</span>
                  </div>
                  
                  <p className="text-neutral-300 text-sm italic">{competitor.slogan}</p>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-neutral-500 uppercase tracking-wide">Relevance</span>
                      <div className="w-full bg-neutral-800 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${competitor.relevance}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-neutral-400">{competitor.relevance}%</span>
                    </div>
                    
                    <div>
                      <span className="text-xs text-neutral-500 uppercase tracking-wide">Target Users</span>
                      <p className="text-sm text-neutral-300 mt-1">{competitor.targetUsers}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs text-neutral-500 uppercase tracking-wide">Pain Points</span>
                      <p className="text-sm text-neutral-300 mt-1">{competitor.painPoints}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs text-neutral-500 uppercase tracking-wide">Key Features</span>
                      <p className="text-sm text-neutral-300 mt-1">{competitor.keyFeatures}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs text-neutral-500 uppercase tracking-wide">Revenue Model</span>
                      <p className="text-sm text-neutral-300 mt-1">{competitor.revenueModel}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 桌面端表格视图 */}
            <div className="hidden md:block overflow-x-auto">
              <div className="min-w-[1200px]">
                <table className="w-full border-collapse bg-neutral-900 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-neutral-800">
                      <th className="p-4 text-left text-neutral-300 font-medium">Product</th>
                      <th className="p-4 text-left text-neutral-300 font-medium">Slogan</th>
                      <th className="p-4 text-left text-neutral-300 font-medium">Relevance</th>
                      <th className="p-4 text-left text-neutral-300 font-medium">Traffic</th>
                      <th className="p-4 text-left text-neutral-300 font-medium">Target Users</th>
                      <th className="p-4 text-left text-neutral-300 font-medium">Pain Points</th>
                      <th className="p-4 text-left text-neutral-300 font-medium">Key Features</th>
                      <th className="p-4 text-left text-neutral-300 font-medium">Revenue Model</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeCompetitorData.map((competitor, index) => (
                      <tr key={index} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                        <td className="p-4 text-white font-medium">{competitor.product}</td>
                        <td className="p-4 text-neutral-300 italic">{competitor.slogan}</td>
                        <td className="p-4">
                          <div className="w-full bg-neutral-800 rounded-full h-2 mb-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${competitor.relevance}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-neutral-400">{competitor.relevance}%</span>
                        </td>
                        <td className="p-4 text-neutral-300">{competitor.traffic}</td>
                        <td className="p-4 text-neutral-300 max-w-xs">
                          <div className="line-clamp-3">{competitor.targetUsers}</div>
                        </td>
                        <td className="p-4 text-neutral-300 max-w-xs">
                          <div className="line-clamp-3">{competitor.painPoints}</div>
                        </td>
                        <td className="p-4 text-neutral-300 max-w-xs">
                          <div className="line-clamp-3">{competitor.keyFeatures}</div>
                        </td>
                        <td className="p-4 text-neutral-300">{competitor.revenueModel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-muted rounded-xl p-8 text-center text-muted-foreground">
            No competitor data available to display in table format.
          </div>
        )
      )}
    </motion.div>
  );
};