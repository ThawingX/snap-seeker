"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconTable, IconBrain, IconChartBar, IconBulb, IconTarget, IconHash, IconPhoto, IconClipboardList, IconList, IconArrowLeft, IconDownload } from "@tabler/icons-react";

import { SearchLogic } from "./search/SearchLogic";
import { CompetitorCards } from "./competitor/CompetitorCards";
import { CompetitorTable } from "./competitor/CompetitorTable";
import { TrendingSearches } from "./trending/TrendingSearches";
import { FigureCards } from "./figure/FigureCards";
import { RequirementCard } from "./requirement/RequirementCard";
import { FunctionList } from "./function/FunctionList";
import { PMFAnalysis, MVPStrategy } from "./premium/LockedContent";
import { useSSEData } from "@/hooks/useSSEData";
import { ENV } from "@/lib/env";











/**
 * 竞争对手分析表格组件
 * 根据搜索词展示竞争对手分析结果
 */
export default function SeekTable({ query, searchId }: { query: string, searchId: string }) {
  // 添加引用用于滚动到特定区域
  const searchLogicRef = useRef<HTMLDivElement>(null!);
  const competitorsRef = useRef<HTMLDivElement>(null!);
  const trendingSearchesRef = useRef<HTMLDivElement>(null!);
  const figuresRef = useRef<HTMLDivElement>(null!);
  const requirementRef = useRef<HTMLDivElement>(null!);
  const functionListRef = useRef<HTMLDivElement>(null!);
  const tableRef = useRef<HTMLDivElement>(null!);
  const insightsRef = useRef<HTMLDivElement>(null!);
  const recommendationsRef = useRef<HTMLDivElement>(null!);

  // 滚动状态管理
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 导出状态管理
  const [isExporting, setIsExporting] = useState(false);

  // 使用 SSE 数据获取 Hook
  const {
    loading,
    logicSteps: searchSteps,
    competitors: competitorData,
    figures: figureData,
    hotKeysData,
    requirementCard: requirementData,
    functionList: functionListData,
    error
  } = useSSEData({ query, searchId });

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 页面卸载时确保数据持久化
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 检查是否有未保存的数据
      const hasUnsavedData = searchSteps.length > 0 || 
                            competitorData.length > 0 || 
                            figureData.length > 0 || 
                            hotKeysData.length > 0 || 
                            requirementData || 
                            functionListData.length > 0;
      
      if (hasUnsavedData) {
        // 尝试最后一次保存
        try {
          const currentResults = {
            logicSteps: searchSteps,
            competitors: competitorData,
            figures: figureData,
            hotKeysData,
            requirementCard: requirementData,
            functionList: functionListData
          };
          
          // 使用同步方式保存到localStorage
          const searchData = {
            id: searchId,
            query: query,
            timestamp: Date.now(),
            results: currentResults
          };
          
          localStorage.setItem(`search_${searchData.id}`, JSON.stringify(searchData));
          console.log('Emergency data save completed before page unload');
        } catch (error) {
          console.error('Failed to save data before unload:', error);
        }
        
        // 提示用户有未保存的数据
        e.preventDefault();
        e.returnValue = '您有未保存的搜索数据，确定要离开吗？';
        return '您有未保存的搜索数据，确定要离开吗？';
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // 页面变为不可见时保存数据
        const hasUnsavedData = searchSteps.length > 0 || 
                              competitorData.length > 0 || 
                              figureData.length > 0 || 
                              hotKeysData.length > 0 || 
                              requirementData || 
                              functionListData.length > 0;
        
        if (hasUnsavedData) {
          try {
            const currentResults = {
              logicSteps: searchSteps,
              competitors: competitorData,
              figures: figureData,
              hotKeysData,
              requirementCard: requirementData,
              functionList: functionListData
            };
            
            const searchData = {
              id: searchId,
              query: query,
              timestamp: Date.now(),
              results: currentResults
            };
            
            localStorage.setItem(`search_${searchData.id}`, JSON.stringify(searchData));
            console.log('Data saved on visibility change');
          } catch (error) {
            console.error('Failed to save data on visibility change:', error);
          }
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // 组件卸载时最后一次保存
      const hasUnsavedData = searchSteps.length > 0 || 
                            competitorData.length > 0 || 
                            figureData.length > 0 || 
                            hotKeysData.length > 0 || 
                            requirementData || 
                            functionListData.length > 0;
      
      if (hasUnsavedData) {
        try {
          const currentResults = {
            logicSteps: searchSteps,
            competitors: competitorData,
            figures: figureData,
            hotKeysData,
            requirementCard: requirementData,
            functionList: functionListData
          };
          
          const searchData = {
            id: searchId,
            query: query,
            timestamp: Date.now(),
            results: currentResults
          };
          
          localStorage.setItem(`search_${searchData.id}`, JSON.stringify(searchData));
          console.log('Final data save on component unmount');
        } catch (error) {
          console.error('Failed to save data on unmount:', error);
        }
      }
    };
  }, [searchSteps, competitorData, figureData, hotKeysData, requirementData, functionListData, searchId, query]);

  // 导出MVP.md文件的处理函数
  const handleExportMVP = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    try {
      const response = await fetch(`${ENV.TARGET_CHAT_API_URL}/${searchId}/download`, {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
         },
       });
      
      if (!response.ok) {
        throw new Error('导出失败');
      }
      
      // 获取文件内容
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // 创建下载链接
      const a = document.createElement('a');
      a.href = url;
      a.download = `prd-${query.replace(/\s+/g, '-')}-${searchId}.md`;
      document.body.appendChild(a);
      a.click();
      
      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('导出PRD文件失败:', error);
      // 这里可以添加错误提示
    } finally {
      setIsExporting(false);
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
      title: "Finalized Requirement Card",
      icon: <IconClipboardList className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#requirement-card",
      onClick: () => {
        if (requirementRef.current) {
          requirementRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      title: "Analysis Figures",
      icon: <IconPhoto className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#figures",
      onClick: () => {
        if (figuresRef.current) {
          figuresRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      title: "Function List",
      icon: <IconList className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#function-list",
      onClick: () => {
        if (functionListRef.current) {
          functionListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    // {
    //   title: "MVP Strategy",
    //   icon: <IconBulb className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
    //   href: "#insights",
    //   onClick: () => {
    //     if (insightsRef.current) {
    //       insightsRef.current.scrollIntoView({ behavior: 'smooth' });
    //     }
    //   }
    // },
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
      {/* 固定的返回按钮 */}
      <Link 
        href="/history" 
        className={`fixed top-6 left-6 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-lg border border-neutral-200 dark:border-neutral-700' 
            : 'bg-transparent'
        } text-cyan-500 hover:text-cyan-400 flex items-center px-4 py-2 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/20`}
      >
        <IconArrowLeft className="h-5 w-5 mr-2" />
        <span className={`transition-opacity duration-300 ${
          isScrolled ? 'opacity-100' : 'opacity-0 sm:opacity-100'
        }`}>
          Back to History
        </span>
      </Link>

      {/* 导出MVP.md按钮 - 仅在数据加载完成时显示 */}
      {!loading && (
        <div className="fixed top-6 right-6 z-50">
          <div className="relative group">
            <button
              onClick={handleExportMVP}
              disabled={isExporting}
              className={`transition-all duration-300 ${
                isScrolled 
                  ? 'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-lg border border-neutral-200 dark:border-neutral-700' 
                  : 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-md border border-neutral-200/50 dark:border-neutral-700/50'
              } text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center px-4 py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isExporting ? (
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <IconDownload className="h-5 w-5 mr-2" />
              )}
              <span className={`transition-opacity duration-300 ${
                isScrolled ? 'opacity-100' : 'opacity-0 sm:opacity-100'
              }`}>
                {isExporting ? 'Exporting...' : 'Export PRD.md'}
              </span>
            </button>
            
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-60">
              <div className="relative">
                Export Product Requirements Document for get your product off the ground faster.
                <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-neutral-900 dark:border-b-neutral-100"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <FloatingDock
        items={dockItems}
        desktopClassName="fixed bottom-8 right-8 z-50 shadow-lg"
        mobileClassName="fixed bottom-8 right-8 z-50 shadow-lg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <div className="space-y-8">
        {/* 页面头部 */}
        <div className="mb-8">
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
        <SearchLogic searchSteps={searchSteps} loading={loading} query={query} searchLogicRef={searchLogicRef} />

        {/* 主要竞争对手卡片部分 */}
        <CompetitorCards competitorData={competitorData} loading={loading} competitorsRef={competitorsRef} />

        {/* 需求热度标签排行榜部分 */}
        <TrendingSearches hotKeysData={hotKeysData} loading={loading} trendingSearchesRef={trendingSearchesRef} />

        {/* 竞争对手数据表格部分 */}
        <CompetitorTable competitorData={competitorData} loading={loading} tableRef={tableRef} />

        {/* 分析图片部分 */}
        <FigureCards figureData={figureData} loading={loading} figuresRef={figuresRef} />

        {/* 产品需求卡片部分 */}
        <RequirementCard requirementData={requirementData} loading={loading} requirementRef={requirementRef} />

        {/* 功能清单部分 */}
        <FunctionList functionData={functionListData} loading={loading} functionListRef={functionListRef} />

        {/* MVP 策略推荐部分 - 已隐藏 */}
        {/* <MVPStrategy loading={loading} insightsRef={insightsRef} /> */}

        {/* PMF 分析部分 */}
        <PMFAnalysis loading={loading} recommendationsRef={recommendationsRef} />
        </div>
      </div>
    </div>
  );
}