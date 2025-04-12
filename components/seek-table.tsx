"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconTable, IconBrain, IconChartBar, IconBulb } from "@tabler/icons-react";

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
 * 竞争对手分析表格组件
 * 根据搜索词展示竞争对手分析结果
 */
export default function SeekTable({ query }: { query: string }) {
  // 添加引用用于滚动到特定区域
  const searchLogicRef = useRef<HTMLDivElement>(null);
  const competitorsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);

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

  // 模拟的竞争对手数据（实际应用中应通过API获取）
  const competitorData: CompetitorData[] = [
    {
      id: "1",
      name: "Competitor A",
      slogan: "Simplify Your Workflow",
      relevance: "High (85%)",
      traffic: "1.2M monthly visits",
      targetUser: ["Small businesses", "Freelancers", "Remote teams"],
      plainPoints: ["Time management", "Collaboration barriers", "Task organization"],
      keyFeatures: ["Team collaboration", "Task automation", "Integration with 50+ tools"],
      potentialWeaknesses: ["Limited custom reporting", "Higher pricing tiers", "Learning curve for new users"],
      revenueModel: "Freemium + SaaS subscription"
    },
    {
      id: "2",
      name: "Competitor B",
      slogan: "Enterprise Solutions for Complex Problems",
      relevance: "Medium (65%)",
      traffic: "850K monthly visits",
      targetUser: ["Enterprise companies", "IT departments", "Large organizations"],
      plainPoints: ["Data security", "Scalability", "Cross-department communication"],
      keyFeatures: ["Advanced security", "Enterprise-grade API", "Customizable workflows"],
      potentialWeaknesses: ["Complex UI", "Expensive pricing", "Slow customer support"],
      revenueModel: "Enterprise licensing + Professional services"
    },
    {
      id: "3",
      name: "Competitor C",
      slogan: "Affordable Solutions for Growing Teams",
      relevance: "High (78%)",
      traffic: "2.1M monthly visits",
      targetUser: ["Startups", "Mid-sized businesses", "Marketing teams"],
      plainPoints: ["Budget constraints", "Scaling pains", "Onboarding process"],
      keyFeatures: ["User-friendly interface", "Affordable pricing tiers", "Quick setup"],
      potentialWeaknesses: ["Limited advanced features", "Fewer integrations", "Occasional performance issues"],
      revenueModel: "SaaS subscription + Marketplace commissions"
    }
  ];

  // 搜索分析步骤
  const searchSteps = [
    {
      title: "Query Analysis",
      description: "Analyzing the search query to identify main topics, keywords, and intent. Breaking down complex queries into manageable components for deeper understanding."
    },
    {
      title: "Domain Identification",
      description: "Identifying relevant industry domains and business sectors related to the query. Mapping query elements to specific market segments for targeted research."
    },
    {
      title: "Competitor Discovery",
      description: "Finding key market players and competitors in the identified domains. Utilizing multiple data sources to ensure comprehensive market coverage."
    },
    {
      title: "Data Collection",
      description: "Gathering detailed information about each competitor including product offerings, market positioning, target audience, and business models."
    },
    {
      title: "Feature Analysis",
      description: "Analyzing key features, strengths, and weaknesses of each competitor to identify patterns and differentiating factors in the market."
    },
    {
      title: "Market Positioning",
      description: "Evaluating how each competitor positions themselves in the market, including messaging, pricing strategies, and target customer segments."
    },
    {
      title: "Trend Identification",
      description: "Recognizing emerging patterns and trends across competitors to highlight market direction and potential opportunities or threats."
    },
    {
      title: "Insight Synthesis",
      description: "Combining all collected data to generate actionable insights and recommendations based on competitive analysis findings."
    },
  ];

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
          {searchSteps.map((step, index) => (
            <Step 
              key={index}
              number={index + 1}
              title={step.title}
              description={step.description}
            />
          ))}
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
          {competitorData.map((competitor) => (
            <CompetitorCard key={competitor.id} competitor={competitor} />
          ))}
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
      </motion.div>

      {/* 洞察和分析部分 */}
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
      
      {/* 建议行动 */}
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
    </div>
  );
} 