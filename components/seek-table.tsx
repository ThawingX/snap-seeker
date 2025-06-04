"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconTable, IconBrain, IconChartBar, IconLock, IconBulb, IconTarget, IconTrendingUp, IconCategory, IconDevices, IconHash } from "@tabler/icons-react";
import { ENV } from '@/lib/env';
import { normalizeSSEData } from '@/lib/utils';
import Image from "next/image";
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';
import { addSearchToHistory } from "@/lib/searchHistory";
import { useToast } from "@/components/ui/toast";

import { SearchLogic } from "./search/SearchLogic";
import { CompetitorCards } from "./competitor/CompetitorCards";
import { CompetitorTable } from "./competitor/CompetitorTable";
import { TrendingSearches } from "./trending/TrendingSearches";
import { PMFAnalysis, MVPStrategy } from "./premium/LockedContent";
import { useSSEData } from "@/hooks/useSSEData";



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
 * 竞争对手分析表格组件
 * 根据搜索词展示竞争对手分析结果
 */
export default function SeekTable({ query, searchId }: { query: string, searchId: string }) {
  // 添加引用用于滚动到特定区域
  const searchLogicRef = useRef<HTMLDivElement>(null);
  const competitorsRef = useRef<HTMLDivElement>(null);
  const trendingSearchesRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);

  // 使用 Toast 组件
  const { showToast } = useToast();

  // 使用 SSE 数据获取 Hook
  const {
    loading,
    logicSteps: searchSteps,
    competitors: competitorData,
    hotKeysData,
    error
  } = useSSEData({ query, searchId });



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
      title: "Trending Searches",
      icon: <IconHash className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#trending-searches",
      onClick: () => {
        if (trendingSearchesRef.current) {
          trendingSearchesRef.current.scrollIntoView({ behavior: 'smooth' });
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



  return (
    <div className="relative">
      <FloatingDock
        items={dockItems}
        desktopClassName="fixed bottom-8 right-8 z-50 shadow-lg"
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
        <div ref={searchLogicRef} className="mb-12">
          <SearchLogic searchSteps={searchSteps} loading={loading} query={query} />
        </div>

        {/* 主要竞争对手卡片部分 */}
        <div ref={competitorsRef} className="mb-12">
          <CompetitorCards competitorData={competitorData} loading={loading} />
        </div>

        {/* 需求热度标签排行榜部分 */}
        <div ref={trendingSearchesRef} className="mb-12">
          <TrendingSearches hotKeysData={hotKeysData} loading={loading} />
        </div>

        {/* 竞争对手数据表格部分 */}
        <div ref={tableRef} className="mb-12">
          <CompetitorTable competitorData={competitorData} loading={loading} />
        </div>

        {/* MVP 策略推荐部分 */}
        <MVPStrategy loading={loading} insightsRef={insightsRef} />

        {/* PMF 分析部分 */}
        <PMFAnalysis loading={loading} recommendationsRef={recommendationsRef} />
      </div>
    </div>
  );
}