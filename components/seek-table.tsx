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
        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">相关度</p>
        <p className="text-neutral-800 dark:text-neutral-200">{competitor.relevance}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">流量</p>
        <p className="text-neutral-800 dark:text-neutral-200">{competitor.traffic}</p>
      </div>
    </div>

    <div className="mb-4">
      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">目标用户</p>
      <div className="flex flex-wrap gap-2">
        {competitor.targetUser.map((user, index) => (
          <span key={index} className="bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-300 px-2 py-1 rounded text-xs">
            {user}
          </span>
        ))}
      </div>
    </div>

    <div className="mb-4">
      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">核心卖点</p>
      <ul className="list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
        {competitor.plainPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>

    <div className="mb-4">
      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">主要功能</p>
      <ul className="list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
        {competitor.keyFeatures.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>

    <div className="mb-4">
      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">潜在弱点</p>
      <ul className="list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
        {competitor.potentialWeaknesses.map((weakness, index) => (
          <li key={index}>{weakness}</li>
        ))}
      </ul>
    </div>

    <div>
      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-2">盈利模式</p>
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
      title: "查询逻辑",
      icon: <IconBrain className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#search-logic",
      onClick: () => {
        if (searchLogicRef.current) {
          searchLogicRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      title: "数据表格",
      icon: <IconTable className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#table",
      onClick: () => {
        if (tableRef.current) {
          tableRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      title: "分析洞见",
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
      title: "查询分析",
      description: "分析搜索查询以识别主要主题、关键词和意图。将复杂查询分解为可管理的组件，以便更深入理解。"
    },
    {
      title: "领域识别",
      description: "识别与查询相关的行业领域和业务部门。将查询元素映射到特定市场细分，以便进行有针对性的研究。"
    },
    {
      title: "竞争对手发现",
      description: "寻找已识别领域中的关键市场参与者和竞争对手。利用多个数据源确保全面的市场覆盖。"
    },
    {
      title: "数据收集",
      description: "收集有关每个竞争对手的详细信息，包括产品供应、市场定位、目标受众和商业模式。"
    },
    {
      title: "功能分析",
      description: "分析每个竞争对手的关键功能、优势和劣势，以识别市场中的模式和差异化因素。"
    },
    {
      title: "市场定位",
      description: "评估每个竞争对手在市场中的定位，包括信息传递、定价策略和目标客户群体。"
    },
    {
      title: "趋势识别",
      description: "识别竞争对手之间的新兴模式和趋势，以突出市场方向和潜在机会或威胁。"
    },
    {
      title: "洞察合成",
      description: "综合所有收集的数据，根据竞争分析结果生成可行的洞察和建议。"
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
          返回历史记录
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">竞争对手分析</h1>
        <p className="text-neutral-400">查询结果：{query}</p>
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
        <h2 className="text-2xl font-semibold mb-6 text-white">搜索处理逻辑</h2>
        <div className="mb-4 border-l-2 border-cyan-500 pl-4">
          <p className="text-neutral-300 italic">
            "分析市场中的竞争对手，识别优势、劣势和"{query}"的机会..."
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

      {/* 竞争对手数据表格部分 */}
      <motion.div 
        ref={tableRef}
        id="table"
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-6 dark:text-white">竞争对手数据</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitorData.map((competitor) => (
            <CompetitorCard key={competitor.id} competitor={competitor} />
          ))}
        </div>
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
        <h2 className="text-2xl font-semibold mb-6 dark:text-white">市场洞察</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-cyan-600 dark:text-cyan-400">市场趋势</h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              基于对{competitorData.length}个主要竞争对手的分析，我们观察到以下市场趋势：
              用户界面简化、自动化工具整合、跨平台功能是当前市场焦点。
              SaaS订阅模式仍是主流收入来源，但市场正向多元化收入模式发展。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-cyan-600 dark:text-cyan-400">目标用户分析</h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              市场细分明确，各竞争对手针对不同规模企业提供差异化服务。
              小型企业和自由职业者市场竞争激烈，而企业级市场有更高进入壁垒但利润更高。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-cyan-600 dark:text-cyan-400">机会空间</h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              现有竞争对手在自定义报告、性能优化和定价策略方面存在不足，
              提供更灵活的解决方案并兼顾性能和易用性可能是市场机会点。
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
        <h2 className="text-2xl font-semibold mb-6 dark:text-white">推荐行动</h2>
        <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
          <li>关注用户体验设计，平衡强大功能与易用性</li>
          <li>开发灵活的定价模型，覆盖不同细分市场需求</li>
          <li>优先发展竞争对手忽视的自定义报告功能</li>
          <li>投资技术基础设施以解决性能问题</li>
          <li>构建差异化整合能力，提供竞争对手缺乏的连接</li>
        </ul>
      </motion.div>
    </div>
  );
} 