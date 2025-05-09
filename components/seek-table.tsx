"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconTable, IconBrain, IconChartBar, IconBulb } from "@tabler/icons-react";
import { addSearchToHistory } from "@/lib/searchHistory";

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
 * 竞争对手分析表格组件
 * 根据搜索词展示竞争对手分析结果
 */
export default function SeekTable({ query }: { query: string }) {
  // 添加引用用于滚动到特定区域
  const searchLogicRef = useRef<HTMLDivElement>(null);
  const competitorsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);

  // 添加状态用于存储 SSE 响应数据
  const [loading, setLoading] = useState(true);
  const [logicSteps, setLogicSteps] = useState<{ title: string; description: string }[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      title: "Data Insights",
      icon: <IconBulb className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#insights",
      onClick: () => {
        if (insightsRef.current) {
          insightsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  ];

  // SSE 连接和数据处理
  useEffect(() => {
    if (!query) return;

    // 将查询保存到搜索历史
    addSearchToHistory(query);

    // 防止严格模式下重复请求
    let isRequestCancelled = false;
    let abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setLogicSteps([]);
        setCompetitors([]);
        setError(null);

        // 创建 EventSource 进行 SSE 请求
        // 由于 SSE 通常使用 GET 请求，而我们需要 POST 请求，所以使用 fetch 创建 POST 请求
        const response = await fetch('/api/proxy/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 使用 ReadableStream API 处理流式响应
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is not readable');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        const processChunk = async () => {
          try {
            const { done, value } = await reader.read();
            
            // 如果请求被取消则终止处理
            if (isRequestCancelled) {
              reader.cancel("Request cancelled");
              return;
            }
            
            if (done) {
              setLoading(false);
              return;
            }

            // 解码二进制数据
            buffer += decoder.decode(value, { stream: true });
            
            // 处理可能的多行数据
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // 保留最后一个可能不完整的行

            for (const line of lines) {
              if (line.trim() === '') continue;
              
              try {
                // 处理SSE格式的数据行(data: {...})
                if (line.startsWith('data:')) {
                  // 提取data:后面的JSON部分
                  const jsonString = line.substring(5).trim();
                  const jsonData = JSON.parse(jsonString);
                  
                  if (jsonData.step) {
                    // 处理逻辑链数据
                    if (jsonData.step === 'step') {
                      const content = jsonData.messageContent;
                      // 从 markdown 内容中提取标题和描述
                      const titleMatch = content.match(/## (.+?)\n/);
                      const title = titleMatch ? titleMatch[1] : 'Step';
                      const description = content.replace(/## .+?\n/, '').trim();
                      
                      setLogicSteps(prev => [...prev, { title, description }]);
                    }
                    // 处理竞争对手卡片数据
                    else if (jsonData.step === 'Main Competitors') {
                      const cardIndex = jsonData.card_index;
                      const cardContent = jsonData.card_content as CompetitorCardData;
                      
                      // 处理 revenue_model，可能是字符串或字符串数组
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
                      
                      setCompetitors(prev => {
                        // 替换现有索引或添加新的
                        const newCompetitors = [...prev];
                        newCompetitors[cardIndex] = newCompetitor;
                        return newCompetitors;
                      });
                    }
                  }
                } else {
                  // 尝试解析不带data:前缀的JSON格式(向后兼容)
                  const jsonData = JSON.parse(line);
                  
                  if (jsonData.data) {
                    // 处理逻辑链数据
                    if (jsonData.data.step === 'step') {
                      const content = jsonData.data.messageContent;
                      // 从 markdown 内容中提取标题和描述
                      const titleMatch = content.match(/## (.+?)\n/);
                      const title = titleMatch ? titleMatch[1] : 'Step';
                      const description = content.replace(/## .+?\n/, '').trim();
                      
                      setLogicSteps(prev => [...prev, { title, description }]);
                    }
                    // 处理竞争对手卡片数据
                    else if (jsonData.data.step === 'Main Competitors') {
                      const cardIndex = jsonData.data.card_index;
                      const cardContent = jsonData.data.card_content as CompetitorCardData;
                      
                      // 处理 revenue_model，可能是字符串或字符串数组
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
                      
                      setCompetitors(prev => {
                        // 替换现有索引或添加新的
                        const newCompetitors = [...prev];
                        newCompetitors[cardIndex] = newCompetitor;
                        return newCompetitors;
                      });
                    }
                  }
                }
              } catch (err) {
                console.error('Error parsing SSE data:', err, line);
              }
            }
            
            // 继续处理下一个块
            processChunk();
          } catch (error) {
            // 处理流读取错误
            if (!isRequestCancelled) {
              console.error('Error processing stream chunk:', error);
              setError('Error processing response data. Please try again.');
              setLoading(false);
            }
          }
        };

        processChunk();
      } catch (err) {
        // 只有在请求没有被主动取消时才显示错误
        if (!isRequestCancelled) {
          console.error('Error in SSE connection:', err);
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          setLoading(false);
        }
      }
    };

    fetchData();

    // 清理函数：取消请求和标记已取消
    return () => {
      isRequestCancelled = true;
      abortController.abort();
    };
  }, [query]); // 只在query变化时重新执行

  // 默认的搜索分析步骤 - 当没有接收到服务器数据时使用
  const defaultSearchSteps: { title: string; description: string }[] = [];

  // 使用逻辑步骤数据，如果为空则使用默认步骤
  const searchSteps = logicSteps.length > 0 ? logicSteps : defaultSearchSteps;
  
  // 默认的竞争对手数据 - 当没有接收到服务器数据时使用
  const defaultCompetitorData: CompetitorData[] = [];

  // 使用竞争对手数据，如果为空则使用默认数据
  const competitorData = competitors.length > 0 ? competitors : defaultCompetitorData;

  return (
    <div className="flex flex-col p-6 lg:p-10 w-full max-w-7xl mx-auto">
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

      {/* 浮动导航栏 */}
      <FloatingDock 
        items={dockItems.map(item => ({
          title: item.title,
          icon: item.icon,
          href: item.href
        }))}
        desktopClassName="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 shadow-lg"
        mobileClassName="fixed bottom-8 right-8 z-50 shadow-lg"
      />

      {/* 搜索逻辑思考链部分 */}
      <motion.div 
        ref={searchLogicRef}
        id="search-logic"
        className="bg-neutral-900 rounded-xl p-6 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-white">Search Processing Logic</h2>
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
        <h2 className="text-2xl font-semibold mb-6 dark:text-white">Main Competitors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitorData.length > 0 ? (
            competitorData.map((competitor) => (
              <CompetitorCard key={competitor.id} competitor={competitor} />
            ))
          ) : (
            loading ? (
              // 骨架屏加载效果
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

      {/* 竞争对手数据表格部分 */}
      <motion.div 
        ref={tableRef}
        id="table"
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Competitor Table</h2>
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

      {/* 洞察和分析部分 */}
      {competitorData.length > 0 ? (
        <motion.div 
          ref={insightsRef}
          id="insights"
          className="bg-white dark:bg-neutral-900 rounded-xl p-6 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">Market Insights</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2 text-cyan-600 dark:text-cyan-400">Market Trends</h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                Based on analysis of {competitorData.length} key competitors, we observe the following market trends:
                UI simplification, automation tool integration, and cross-platform functionality are current market focus areas.
                SaaS subscription remains the dominant revenue source, but the market is evolving toward diversified revenue models.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-cyan-600 dark:text-cyan-400">Target User Analysis</h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                The market segmentation is clear, with each competitor targeting different enterprise scales with differentiated services.
                Small business and freelancer markets are highly competitive, while enterprise markets have higher barriers to entry but greater profitability.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-cyan-600 dark:text-cyan-400">Opportunity Areas</h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                Existing competitors have deficiencies in custom reporting, performance optimization, and pricing strategies.
                Providing more flexible solutions that balance performance and usability could be a market opportunity.
              </p>
            </div>
          </div>
        </motion.div>
      ) : loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <InsightsSkeleton />
        </motion.div>
      ) : null}
      
      {/* 建议行动 */}
      {competitorData.length > 0 ? (
        <motion.div 
          className="bg-white dark:bg-neutral-900 rounded-xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">Recommended Actions</h2>
          <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
            <li>Focus on UX design, balancing powerful features with ease of use</li>
            <li>Develop flexible pricing models to cover different market segments</li>
            <li>Prioritize development of custom reporting features overlooked by competitors</li>
            <li>Invest in technical infrastructure to address performance issues</li>
            <li>Build differentiated integration capabilities, providing connections competitors lack</li>
          </ul>
        </motion.div>
      ) : loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <RecommendationsSkeleton />
        </motion.div>
      ) : null}
    </div>
  );
} 