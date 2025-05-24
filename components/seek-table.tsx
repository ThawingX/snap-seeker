"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconTable, IconBrain, IconChartBar, IconLock, IconBulb, IconTarget, IconTrendingUp, IconCategory, IconDevices, IconHash } from "@tabler/icons-react";
import { isProxyChatEnabled } from '@/lib/env';
import { ENV } from '@/lib/env';
import { normalizeSSEData } from '@/lib/utils';
import Image from "next/image";
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * 竞争对手数据接口
 * 定义了竞争对手分析中需要展示的数据结构
 */
interface CompetitorData {
  id: string;
  name: string;
  slogan: string;
  relevance: string;
  traffic: string;
  targetUser: string[];
  plainPoints: string[];
  keyFeatures: string[];
  potentialWeaknesses: string[];
  revenueModel: string;
}

/**
 * 竞争对手卡片数据接口
 * 来自SSE响应的卡片数据结构
 */
interface CompetitorCardData {
  product_name: string;
  slogan: string;
  relevance: string;
  traffic: string;
  target_users: string[];
  pain_points_addressed: string[];
  key_features: string[];
  potential_weaknesses: string[];
  revenue_model: string | string[];
}

/**
 * 需求热度标签接口
 */
interface DemandTag {
  tag: string;
  searchCount: number;
  trend: 'hot' | 'rising' | 'stable';
}

/**
 * 需求排行榜接口
 */
interface DemandRanking {
  title: string | React.ReactNode;
  tags: DemandTag[];
}

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
      <div className="flex flex-wrap gap-2">
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
 * 骨架加载样式 - 洞察部分
 */
const InsightsSkeleton = () => (
  <div className="bg-neutral-900 rounded-xl p-6 mb-6 animate-pulse">
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
  <div className="bg-neutral-900 rounded-xl p-6 animate-pulse">
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

/**
 * 锁定内容组件
 * 用于显示需要付费解锁的内容
 */
const LockedContent = ({ title, description }: { title: string; description: string }) => {
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
 * 需求热度标签卡片组件
 */
const DemandRankingCard = ({ ranking }: { ranking: DemandRanking }) => (
  <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-md">
    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">{ranking.title}</h3>
    <div className="space-y-3">
      {ranking.tags.map((tag, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-neutral-500 dark:text-neutral-400 w-6">{`#${index + 1}`}</span>
            <span className="text-neutral-800 dark:text-neutral-200">{tag.tag}</span>
            {tag.trend === 'hot' && (
              <span className="text-red-500">🔥</span>
            )}
            {tag.trend === 'rising' && (
              <span className="text-green-500">📈</span>
            )}
            {tag.trend === 'stable' && (
              <span className="text-blue-500">📊</span>
            )}
          </div>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {tag.searchCount.toLocaleString()} searches
          </span>
        </div>
      ))}
    </div>
  </div>
);

/**
 * 竞争对手分析表格组件
 * 根据搜索词展示竞争对手分析结果
 */
export default function SeekTable({ query, searchId }: { query: string, searchId: string }) {
  // 添加引用用于滚动到特定区域
  const searchLogicRef = useRef<HTMLDivElement>(null);
  const competitorsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);

  // 添加状态用于存储 SSE 响应数据
  const [loading, setLoading] = useState(true);
  const [logicSteps, setLogicSteps] = useState<{ title: string; description: string }[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Store interval ID in a ref to access it in cleanup
  const intervalIdRef = useRef<number | null>(null);

  /**
   * 滚动到指定区域的函数
   */
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 浮动导航菜单项
  const dockItems = [
    {
      title: "Search Logic",
      icon: <IconBrain className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#search-logic",
      onClick: () => {
        if (searchLogicRef.current) {
          searchLogicRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      title: "Main Competitors",
      icon: <IconChartBar className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#competitors",
      onClick: () => {
        if (competitorsRef.current) {
          competitorsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      title: "Competitor Table",
      icon: <IconTable className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#table",
      onClick: () => {
        if (tableRef.current) {
          tableRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      title: "MVP Strategy",
      icon: <IconBulb className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#insights",
      onClick: () => {
        if (insightsRef.current) {
          insightsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      title: "PMF Analysis",
      icon: <IconTarget className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#recommendations",
      onClick: () => {
        if (recommendationsRef.current) {
          recommendationsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  ];

  // SSE 连接和数据处理
  useEffect(() => {
    if (!searchId || !query) return;

    // 检查是否已有缓存数据
    const cachedData = localStorage.getItem(`searchData_${searchId}`);
    if (cachedData) {
      try {
        const { logicSteps: cachedSteps, competitors: cachedCompetitors } = JSON.parse(cachedData);
        if (cachedSteps && cachedCompetitors) {
          setLogicSteps(cachedSteps);
          setCompetitors(cachedCompetitors);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error parsing cached data:', err);
        // 如果解析缓存数据出错，继续执行获取新数据
      }
    }

    // 仅保留 AbortController
    let abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setLogicSteps([]);
        setCompetitors([]);
        setError(null);

        let response;
        // Determine which API endpoint to use based on environment
        if (isProxyChatEnabled()) {
          // Development environment - use proxy API
          response = await fetch('/api/proxy/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'text/event-stream',
            },
            body: JSON.stringify({ query }),
            signal: abortController.signal
          });
        } else {
          // Production environment - direct API call
          response = await fetch(ENV.TARGET_CHAT_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'text/event-stream',
            },
            body: JSON.stringify({ query }),
            signal: abortController.signal
          });
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is not readable');
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let currentLogicSteps: { title: string; description: string }[] = [];
        let currentCompetitors: CompetitorData[] = [];

        // Stream handling variables similar to proxy
        let lastDataTime = Date.now();
        const streamTimeout = 15000; // 15 seconds
        let hasReceivedCompetitors = false;

        // Set up timeout monitoring
        if (!isProxyChatEnabled()) {
          // Only needed in production (direct API) as proxy handles this server-side
          intervalIdRef.current = window.setInterval(() => {
            const currentTime = Date.now();
            // If no data for 15 seconds and we've received some competitor data, end the stream
            if ((currentTime - lastDataTime > streamTimeout) && hasReceivedCompetitors) {
              console.log("Stream processing timed out, sending end signal");
              setLoading(false);

              // Save data to localStorage before ending
              const dataToStore = {
                logicSteps: currentLogicSteps,
                competitors: currentCompetitors
              };
              localStorage.setItem(`searchData_${searchId}`, JSON.stringify(dataToStore));

              // Clear the interval
              if (intervalIdRef.current !== null) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
              }
            }
          }, 1000);
        }

        const processChunk = async () => {
          try {
            const { done, value } = await reader.read();

            if (done) {
              // 存储完整的数据到localStorage
              const dataToStore = {
                logicSteps: currentLogicSteps,
                competitors: currentCompetitors
              };
              localStorage.setItem(`searchData_${searchId}`, JSON.stringify(dataToStore));
              setLoading(false);

              // Clean up the interval if it exists
              if (intervalIdRef.current !== null) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
              }

              return;
            }

            // Update last data time on each chunk
            lastDataTime = Date.now();

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            // Process each line
            for (const line of lines) {
              if (line.trim() === '') continue;

              try {
                // Normalize the line to handle both environments consistently
                const normalizedLine = normalizeSSEData(line);

                if (normalizedLine.startsWith('data:')) {
                  const jsonString = normalizedLine.substring(5).trim();
                  const jsonData = JSON.parse(jsonString);

                  // Check for competitor data to track progress
                  if (jsonData.step === 'Main Competitors') {
                    hasReceivedCompetitors = true;
                  }

                  if (jsonData.step) {
                    // 检测特定的结束消息
                    if (jsonData.step === "Done") {
                      console.log("收到结束信号，流处理完成");
                      // 存储完整的数据到localStorage
                      const dataToStore = {
                        logicSteps: currentLogicSteps,
                        competitors: currentCompetitors
                      };
                      localStorage.setItem(`searchData_${searchId}`, JSON.stringify(dataToStore));
                      setLoading(false);
                      return; // 结束处理
                    }
                    else if (jsonData.step === 'step') {
                      const content = jsonData.messageContent;
                      const titleMatch = content.match(/## (.+?)\n/);
                      const title = titleMatch ? titleMatch[1] : 'Step';
                      const description = content.replace(/## .+?\n/, '').trim();

                      currentLogicSteps = [...currentLogicSteps, { title, description }];
                      setLogicSteps(currentLogicSteps);
                    }
                    else if (jsonData.step === 'Main Competitors') {
                      const cardIndex = jsonData.card_index;
                      const cardContent = jsonData.card_content as CompetitorCardData;

                      const revenueModel = Array.isArray(cardContent.revenue_model)
                        ? cardContent.revenue_model.join(', ')
                        : cardContent.revenue_model;

                      const newCompetitor: CompetitorData = {
                        id: cardIndex.toString(),
                        name: cardContent.product_name,
                        slogan: cardContent.slogan,
                        relevance: cardContent.relevance,
                        traffic: cardContent.traffic,
                        targetUser: cardContent.target_users,
                        plainPoints: cardContent.pain_points_addressed,
                        keyFeatures: cardContent.key_features,
                        potentialWeaknesses: cardContent.potential_weaknesses,
                        revenueModel: revenueModel
                      };

                      currentCompetitors = [...currentCompetitors];
                      currentCompetitors[cardIndex] = newCompetitor;
                      setCompetitors(currentCompetitors);
                    }
                  }
                }
              } catch (err) {
                console.error('Error parsing SSE data:', err, line);
              }
            }

            processChunk();
          } catch (error) {
            console.error('Error processing stream chunk:', error);
            setError('Error processing response data. Please try again.');
            setLoading(false);
          }
        };

        processChunk();
      } catch (err) {
        console.error('Error in SSE connection:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
      // Clear interval if it exists
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [query]);

  // 默认的搜索分析步骤 - 当没有接收到服务器数据时使用
  const defaultSearchSteps: { title: string; description: string }[] = [];

  // 使用逻辑步骤数据，如果为空则使用默认步骤
  const searchSteps = logicSteps.length > 0 ? logicSteps : defaultSearchSteps;

  // 默认的竞争对手数据 - 当没有接收到服务器数据时使用
  const defaultCompetitorData: CompetitorData[] = [];

  // 使用竞争对手数据，如果为空则使用默认数据
  const competitorData = competitors.length > 0 ? competitors : defaultCompetitorData;

  return (
    <div className="relative">
      <FloatingDock
        items={dockItems}
        desktopClassName="fixed bottom-8 right-1 -translate-x-1/2 z-50 shadow-lg"
        mobileClassName="fixed bottom-8 right-8 z-50 shadow-lg"
      />

      <div className="space-y-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <Link href="/history" className="text-cyan-500 hover:text-cyan-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to History
          </Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">Competitor Analysis</h1>
          <p className="text-neutral-400">Results for: {query}</p>
          {loading && (
            <div className="flex items-center mt-2 text-neutral-400">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing data...
            </div>
          )}
          {error && (
            <div className="mt-2 text-red-500">
              Error: {error}
            </div>
          )}
        </div>

        {/* 搜索逻辑思考链部分 */}
        <motion.div
          ref={searchLogicRef}
          id="search-logic"
          className="bg-neutral-900 rounded-xl p-6 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-white flex items-center"><IconBrain className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />Search Processing Logic</h2>
          <div className="mb-4 border-l-2 border-cyan-500 pl-4">
            <p className="text-neutral-300 italic">
              "Analyzing competitors in the market to identify strengths, weaknesses, and opportunities for {query}..."
            </p>
          </div>
          <div className="space-y-0">
            {searchSteps.length > 0 ? (
              searchSteps.map((step, index) => (
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

        {/* 主要竞争对手卡片部分 */}
        <motion.div
          ref={competitorsRef}
          id="competitors"
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6 dark:text-white flex items-center"> <IconChartBar className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />Main Competitors</h2>
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

        {/* 需求热度标签排行榜部分 */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-6 dark:text-white flex items-center">
            <IconHash className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
            Trending Searches ( Monthly ) 
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              // 骨架屏加载效果
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-neutral-900 rounded-xl p-5 shadow-md animate-pulse">
                  <div className="h-6 bg-neutral-800 rounded-md w-2/3 mb-4"></div>
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="h-4 bg-neutral-800 rounded-md w-6"></div>
                        <div className="h-4 bg-neutral-800 rounded-md w-24"></div>
                      </div>
                      <div className="h-4 bg-neutral-800 rounded-md w-20"></div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <>
                <DemandRankingCard
                  ranking={{
                    title: <div className="flex items-center"><IconDevices className="mr-2 h-5 w-5 text-cyan-500" />Most Relevant</div>,
                    tags: [
                      { tag: "AI Integration", searchCount: 15420, trend: "hot" },
                      { tag: "Real-time Analytics", searchCount: 12800, trend: "rising" },
                      { tag: "Mobile Support", searchCount: 10500, trend: "stable" },
                      { tag: "Cloud Storage", searchCount: 9300, trend: "stable" },
                      { tag: "API Integration", searchCount: 8900, trend: "rising" }
                    ]
                  }}
                />
                <DemandRankingCard
                  ranking={{
                    title: <div className="flex items-center"><IconCategory className="mr-2 h-5 w-5 text-purple-500" />All in Seeker</div>,
                    tags: [
                      { tag: "Enterprise Solutions", searchCount: 18600, trend: "hot" },
                      { tag: "Small Business", searchCount: 14200, trend: "rising" },
                      { tag: "Startups", searchCount: 11800, trend: "stable" },
                      { tag: "Freelancers", searchCount: 9600, trend: "rising" },
                      { tag: "Education", searchCount: 8400, trend: "stable" }
                    ]
                  }}
                />
                <DemandRankingCard
                  ranking={{
                    title: <div className="flex items-center"><IconTrendingUp className="mr-2 h-5 w-5 text-green-500" />All Fields</div>,
                    tags: [
                      { tag: "Machine Learning", searchCount: 20100, trend: "hot" },
                      { tag: "Blockchain", searchCount: 16500, trend: "rising" },
                      { tag: "Cloud Native", searchCount: 13200, trend: "hot" },
                      { tag: "Edge Computing", searchCount: 10800, trend: "rising" },
                      { tag: "Microservices", searchCount: 9100, trend: "stable" }
                    ]
                  }}
                />
              </>
            )}
          </div>
        </motion.div>

        {/* 竞争对手数据表格部分 */}
        <motion.div
          ref={tableRef}
          id="table"
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4 dark:text-white flex items-center"><IconTable className=" mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />Competitor Table</h2>
          {competitorData.length > 0 ? (
            <>
              <div className="bg-neutral-900 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
                  <table className="w-full border-collapse min-w-[1200px]">
                    <thead>
                      <tr className="bg-gradient-to-r from-neutral-800 to-neutral-900 text-neutral-200 whitespace-nowrap">
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
                      {competitorData.map((competitor) => (
                        <tr key={competitor.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                          <td className="p-4 font-medium text-cyan-400">{competitor.name}</td>
                          <td className="p-4 italic text-sm text-neutral-300">{competitor.slogan}</td>
                          <td className="p-4 text-neutral-300">
                            <div className="flex flex-col space-y-1">
                              <div className="w-full bg-neutral-700 rounded-full h-2">
                                <div
                                  className="bg-cyan-500 h-2 rounded-full"
                                  style={{ width: competitor.relevance.match(/\d+/)?.[0] + '%' }}
                                ></div>
                              </div>
                              <span className="text-xs">{competitor.relevance}</span>
                            </div>
                          </td>
                          <td className="p-4 text-neutral-300">{competitor.traffic}</td>
                          <td className="p-4 text-neutral-300">
                            <ul className="list-disc list-inside">
                              {competitor.targetUser.map((user, idx) => (
                                <li key={idx} className="text-sm py-1">{user}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="p-4 text-neutral-300">
                            <ul className="list-disc list-inside">
                              {competitor.plainPoints.map((point, idx) => (
                                <li key={idx} className="text-sm py-1">{point}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="p-4 text-neutral-300">
                            <ul className="list-disc list-inside">
                              {competitor.keyFeatures.map((feature, idx) => (
                                <li key={idx} className="text-sm py-1">{feature}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="p-4 text-neutral-300">{competitor.revenueModel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-2 italic">* Scroll horizontally to view all data</p>
            </>
          ) : (
            loading ? (
              <div className="bg-neutral-900 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
                  <table className="w-full border-collapse min-w-[1200px]">
                    <thead>
                      <tr className="bg-gradient-to-r from-neutral-800 to-neutral-900 text-neutral-200 whitespace-nowrap">
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
              <div className="bg-neutral-900 rounded-xl p-8 text-center text-neutral-400">
                No competitor data available to display in table format.
              </div>
            )
          )}
        </motion.div>

        {/* MVP section */}
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
            <LockedContent
              title="Customized MVP Strategy Analysis"
              description="Get detailed recommendations for your Minimum Viable Product (MVP), including core features, technology stack selection, and development timeline planning."
            />
          )}
        </motion.div>

        {/* PMF section */}
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
            <LockedContent
              title="PMF Achievement Strategy"
              description="In-depth analysis of product-market fit, providing market entry strategies, user acquisition plans, and product iteration recommendations."
            />
          )}
        </motion.div>
      </div>
    </div>
  );
} 