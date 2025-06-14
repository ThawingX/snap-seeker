"use client";
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
            className="flex items-center px-3 py-2 text-sm bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-700 dark:text-white rounded-lg transition-colors duration-200 no-print"
            title="Print this module"
          >
            <IconPrinter className="h-4 w-4 mr-1" />
            Print
          </button>
        )}
      </div>
      {competitorData.length > 0 ? (
        <>
          <div className="bg-muted rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
              <table className="w-full border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900 text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                    <th className="p-4 text-left font-medium sticky top-0 w-[140px]">Product</th>
                    <th className="p-4 text-left font-medium sticky top-0 w-[220px]">Slogan</th>
                    <th className="p-4 text-left font-medium sticky top-0 w-[150px]">Relevance</th>
                    <th className="p-4 text-left font-medium sticky top-0 w-[160px]">Traffic</th>
                    <th className="p-4 text-left font-medium sticky top-0 w-[240px]">Target User</th>
                    <th className="p-4 text-left font-medium sticky top-0 w-[240px]">Plain Points</th>
                    <th className="p-4 text-left font-medium sticky top-0 w-[240px]">Key Features</th>
                    <th className="p-4 text-left font-medium sticky top-0 w-[180px]">Revenue Model</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorData.filter(competitor => competitor != null).map((competitor) => (
                    <tr key={competitor.id} className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="p-4 font-medium text-cyan-600 dark:text-cyan-400">{competitor.name}</td>
                      <td className="p-4 italic text-sm text-neutral-600 dark:text-neutral-300">{competitor.slogan}</td>
                      <td className="p-4 text-neutral-700 dark:text-neutral-300">
                        <div className="flex flex-col space-y-1">
                          <div className="w-full bg-neutral-300 dark:bg-neutral-700 rounded-full h-2">
                            <div
                              className="bg-cyan-500 h-2 rounded-full"
                              style={{ width: competitor.relevance.match(/\d+/)?.[0] + '%' }}
                            ></div>
                          </div>
                          <span className="text-xs">{competitor.relevance}</span>
                        </div>
                      </td>
                      <td className="p-4 text-neutral-700 dark:text-neutral-300">{competitor.traffic}</td>
                      <td className="p-4 text-neutral-700 dark:text-neutral-300">
                        <ul className="list-disc list-inside">
                          {competitor.targetUser.filter(user => user != null).map((user, idx) => (
                            <li key={idx} className="text-sm py-1">{user}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 text-neutral-700 dark:text-neutral-300">
                        <ul className="list-disc list-inside">
                          {competitor.plainPoints.filter(point => point != null).map((point, idx) => (
                            <li key={idx} className="text-sm py-1">{point}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 text-neutral-700 dark:text-neutral-300">
                        <ul className="list-disc list-inside">
                          {competitor.keyFeatures.filter(feature => feature != null).map((feature, idx) => (
                            <li key={idx} className="text-sm py-1">{feature}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 text-neutral-700 dark:text-neutral-300">{competitor.revenueModel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-500 mt-2 italic">* Scroll horizontally to view all data</p>
        </>
      ) : (
        loading ? (
          <div className="bg-muted rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
              <table className="w-full border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900 text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                    <th className="p-4 text-left font-medium sticky top-0 w-[140px]">Product</th>
                    <th className="p-4 text-left font-medium sticky top-0 w-[220px]">Slogan</th>
                    <th className="p-4 text-left font-medium sticky top-0 w-[150px]">Relevance</th>
                    <th className="p-4 text-left font-medium sticky top-0 w-[160px]">Traffic</th>
                    <th className="p-4 text-left font-medium sticky top-0 w-[240px]">Target User</th>
                    <th className="p-4 text-left font-medium sticky top-0 w-[240px]">Plain Points</th>
                    <th className="p-4 text-left font-medium sticky top-0 w-[240px]">Key Features</th>
                    <th className="p-4 text-left font-medium sticky top-0 w-[180px]">Revenue Model</th>
                  </tr>
                </thead>
                <tbody>
                  {Array(3).fill(0).map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-muted rounded-xl p-8 text-center text-muted-foreground">
            No competitor data available to display in table format.
          </div>
        )
      )}
    </motion.div>
  );
};