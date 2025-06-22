"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconTable, IconBrain, IconChartBar, IconBulb, IconTarget, IconHash, IconPhoto, IconClipboardList, IconList, IconArrowLeft, IconDownload, IconPrinter } from "@tabler/icons-react";

import { SearchLogic } from "./search/SearchLogic";
import { CompetitorCards } from "./competitor/CompetitorCards";
import { CompetitorTable } from "./competitor/CompetitorTable";
import { TrendingSearches } from "./trending/TrendingSearches";
import { FigureCards } from "./figure/FigureCards";
import { RequirementCard } from "./requirement/RequirementCard";
import { FunctionList } from "./function/FunctionList";
import { PMFAnalysis, MVPStrategy } from "./premium/LockedContent";
import { API_ENDPOINTS, api, tokenManager } from "@/lib/api";
import { CompetitorData, HotKeysData, SearchStep } from '@/types/competitor';
import { FigureData } from '@/components/figure/FigureCards';
import { RequirementCardData } from '@/components/requirement/RequirementCard';
import { FunctionListData } from '@/components/function/FunctionList';
import { SearchResultData, HistoryApiResponse, SearchResultProcessor, createInitialResultsState } from '@/types/search-result';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';
import { useToast } from "@/components/ui/toast";
import { useSSEData } from "@/hooks/useSSEData";











/**
 * 竞争对手分析表格组件
 * 根据搜索词展示竞争对手分析结果
 */
export default function SeekTable({ query: initialQuery, searchId }: { query: string, searchId: string }) {
  // 内部query状态，用于处理历史查询时的query更新
  const [query, setQuery] = useState(initialQuery);
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
  
  // 检查是否为新搜索（从首页搜索按钮进来的）- 直接从URL参数获取，避免useEffect时序问题
  const getIsNewSearch = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('isNew') === 'true';
    }
    return false;
  };
  const [isNewSearch, setIsNewSearch] = useState(getIsNewSearch);

  // 打印功能处理函数
  const handlePrintModule = (moduleId: string, moduleName: string) => {
    // 触发打印开始埋点
    trackEvent(ANALYTICS_EVENTS.PRINT_START, {
      module_id: moduleId,
      module_name: moduleName,
      page: 'search_results'
    });
    
    const moduleElement = document.getElementById(moduleId);
    if (!moduleElement) {
      console.error(`Module with id '${moduleId}' not found`);
      // 触发打印失败埋点
      trackEvent(ANALYTICS_EVENTS.PRINT_FAILED, {
        module_id: moduleId,
        module_name: moduleName,
        error_message: 'Module element not found',
        page: 'search_results'
      });
      return;
    }

    // 创建新窗口用于打印
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Failed to open print window');
      return;
    }

    // 获取当前页面的样式
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('');
        } catch (e) {
          console.warn('Cannot access stylesheet:', e);
          return '';
        }
      })
      .join('');

    // 构建打印页面HTML
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print - ${moduleName}</title>
          <meta charset="utf-8">
          <style>
            ${styles}
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none !important; }
              .print-header { margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
              .print-title { font-size: 24px; font-weight: bold; color: #333; }
              .print-subtitle { font-size: 14px; color: #666; margin-top: 5px; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <div class="print-title">${moduleName}</div>
            <div class="print-subtitle">Generated from: ${query} | Date: ${new Date().toLocaleDateString()}</div>
          </div>
          ${moduleElement.outerHTML}
        </body>
      </html>
    `;

    // 写入打印窗口并打印
    printWindow.document.write(printHTML);
    printWindow.document.close();
    
    // 等待内容加载完成后打印
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        
        // 触发打印成功埋点
        trackEvent(ANALYTICS_EVENTS.PRINT_SUCCESS, {
          module_id: moduleId,
          module_name: moduleName,
          page: 'search_results'
        });
      }, 500);
    };
  };

  // 数据状态管理 - 历史查询时使用的状态
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearchSteps, setHistorySearchSteps] = useState<SearchStep[]>([]);
  const [historyCompetitorData, setHistoryCompetitorData] = useState<CompetitorData[]>([]);
  const [historyFigureData, setHistoryFigureData] = useState<FigureData[]>([]);
  const [historyHotKeysData, setHistoryHotKeysData] = useState<HotKeysData>({
    mostRelevant: [],
    allInSeeker: [],
    allFields: []
  });
  const [historyRequirementData, setHistoryRequirementData] = useState<RequirementCardData | null>(null);
  const [historyFunctionListData, setHistoryFunctionListData] = useState<FunctionListData[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const { showToast } = useToast();
  
  // 使用SSE数据hook获取实时数据（新搜索时使用）
  // 注意：这里使用初始的searchId，避免使用finalSearchId导致无限循环
  const sseData = useSSEData({ 
    query: isNewSearch ? query : '', 
    searchId: isNewSearch ? searchId : '' 
  });

  // isNewSearch现在在初始化时就从URL参数获取了正确的值，不需要useEffect
  // 添加调试日志
  useEffect(() => {
    console.log('isNewSearch initialized:', { isNewSearch, searchId, currentUrl: window.location.search });
  }, [isNewSearch, searchId]);
  
  // 从后端API获取历史数据（仅当确认为历史查询时）
  useEffect(() => {
    console.log('History data useEffect triggered:', { isNewSearch, searchId, query });
    
    const fetchHistoryData = async () => {
      try {
        console.log('Starting to fetch history data for searchId:', searchId);
        setHistoryLoading(true);
        setHistoryError(null);
        
        const response = await api.get(`${API_ENDPOINTS.HISTORY}/${searchId}`);
        
        if (!response.ok) {
          // 特殊处理404错误
          if (response.status === 404) {
            const errorMessage = '搜索记录不存在或已被删除';
            setHistoryError(errorMessage);
            setHistoryLoading(false); // 停止加载状态
            showToast({
              message: "记录未找到：该搜索记录不存在或已被删除，请返回历史记录页面查看其他记录。",
              type: "error"
            });
            return; // 直接返回，不再重试
          }
          
          // 其他HTTP错误
          throw new Error(`请求失败: HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('History data fetched successfully:', data);
        
        // 如果历史数据包含原始查询，更新query状态
        if (data.query && data.query.trim()) {
          setQuery(data.query);
        }
        
        // 使用安全的数据处理方法
        const processedData = SearchResultProcessor.safeGetSearchResultData(data);
        
        setHistorySearchSteps(processedData.logicSteps);
        setHistoryCompetitorData(processedData.competitors);
        setHistoryFigureData(processedData.figures);
        setHistoryHotKeysData(processedData.hotKeysData);
        setHistoryRequirementData(processedData.requirementCard);
        setHistoryFunctionListData(processedData.functionList);
        
      } catch (err) {
        console.error('Error fetching history data:', err);
        const errorMessage = err instanceof Error ? err.message : '加载数据失败';
        setHistoryError(errorMessage);
        showToast({
          message: "加载错误：无法加载搜索结果，请检查网络连接或稍后重试。",
          type: "error"
        });
      } finally {
        setHistoryLoading(false);
      }
    };

    // 只有当不是新搜索时才调用历史数据接口
    if (!isNewSearch && searchId) {
      console.log('Conditions met, calling fetchHistoryData');
      fetchHistoryData();
    } else {
      console.log('Conditions not met for fetching history data:', { isNewSearch, searchId });
    }
  }, [isNewSearch, searchId]);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 根据查询类型选择使用的数据
  const loading = isNewSearch ? sseData.loading : historyLoading;
  const searchSteps = isNewSearch ? sseData.logicSteps : historySearchSteps;
  const competitorData = isNewSearch ? sseData.competitors : historyCompetitorData;
  const figureData = isNewSearch ? sseData.figures : historyFigureData;
  const hotKeysData = isNewSearch ? sseData.hotKeysData : historyHotKeysData;
  const requirementData = isNewSearch ? sseData.requirementCard : historyRequirementData;
  const functionListData = isNewSearch ? sseData.functionList : historyFunctionListData;
  const error = isNewSearch ? sseData.error : historyError;



  // 导出MVP.md文件的处理函数
  const handleExportMVP = async () => {
    if (isExporting) return;
    
    // 获取正确的searchId：新搜索时使用finalSearchId，历史查询时使用原始searchId
    const exportSearchId = isNewSearch ? sseData.finalSearchId : searchId;
    
    // 触发导出开始埋点
    trackEvent(ANALYTICS_EVENTS.EXPORT_START, {
      export_type: 'prd',
      search_id: exportSearchId,
      query: query,
      page: 'search_results'
    });
    
    setIsExporting(true);
    try {
      const response = await api.get(API_ENDPOINTS.CHAT.DOWNLOAD(exportSearchId), {
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
      a.download = `PRD.md`;
      document.body.appendChild(a);
      a.click();
      
      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // 触发导出成功埋点
      trackEvent(ANALYTICS_EVENTS.EXPORT_SUCCESS, {
        export_type: 'prd',
        search_id: exportSearchId,
        query: query,
        file_name: `PRD.md`,
        page: 'search_results'
      });
      
    } catch (error) {
      console.error('导出PRD文件失败:', error);
      showToast({
        message: "Export Error: Failed to export PRD file. Please try again.",
        type: "error"
      });
      
      // 触发导出失败埋点
      trackEvent(ANALYTICS_EVENTS.EXPORT_FAILED, {
        export_type: 'prd',
        search_id: exportSearchId,
        query: query,
        error_message: error instanceof Error ? error.message : 'Unknown error',
        page: 'search_results'
      });
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
          <span className="sm:hidden">Back</span>
          <span className="hidden sm:inline">Back to History</span>
        </span>
      </Link>

      {/* 导出MVP.md按钮 - 仅在数据加载完成时显示 */}
      {!loading && (
        <div className="fixed top-6 right-6 z-50">
          <div className="relative group">
            <button
              onClick={handleExportMVP}
              disabled={isExporting}
              className={`transition-all cursor-pointer duration-300 ${
                isScrolled 
                  ? 'bg-green-500/90 backdrop-blur-sm shadow-lg border border-green-400/40' 
                  : 'bg-green-500/80 backdrop-blur-sm shadow-md border border-green-400/30'
              } text-white hover:bg-green-600/95 flex items-center px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl`}
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

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 pt-20">
        <div className="space-y-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2 text-neutral-900 dark:text-white">Competitor Analysis</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Results for: {query}</p>
          {loading && (
            <div className="flex items-center mt-2 text-neutral-600 dark:text-neutral-400">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing data...
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    {error.includes('404') || error.includes('不存在') ? '记录未找到' : '加载错误'}
                  </h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                  {(error.includes('404') || error.includes('不存在')) && (
                    <div className="mt-3">
                      <Link 
                        href="/history" 
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-800/30 border border-red-300 dark:border-red-700 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                      >
                        <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        返回历史记录
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 只有在没有404错误时才显示内容组件 */}
        {!error || (!error.includes('404') && !error.includes('不存在')) ? (
          <>
            {/* 搜索逻辑思考链部分 */}
            <SearchLogic 
              searchSteps={searchSteps} 
              loading={loading} 
              query={query} 
              searchLogicRef={searchLogicRef}
              onPrint={() => handlePrintModule('search-logic', 'Search Processing Logic')}
            />

            {/* 主要竞争对手卡片部分 */}
            <CompetitorCards 
              competitorData={competitorData} 
              loading={loading} 
              competitorsRef={competitorsRef}
              onPrint={() => handlePrintModule('competitors', 'Main Competitors')}
            />

            {/* 需求热度标签排行榜部分 */}
            <TrendingSearches 
              hotKeysData={hotKeysData} 
              loading={loading} 
              trendingSearchesRef={trendingSearchesRef}
              onPrint={() => handlePrintModule('trending-searches', 'Trending Searches (Monthly)')}
            />

            {/* 竞争对手数据表格部分 */}
            <CompetitorTable 
              competitorData={competitorData} 
              loading={loading} 
              tableRef={tableRef}
              onPrint={() => handlePrintModule('table', 'Competitor Table')}
            />

            {/* 分析图片部分 */}
            <FigureCards 
              figureData={figureData} 
              loading={loading} 
              figuresRef={figuresRef}
              onPrint={() => handlePrintModule('figures', 'Analysis Figures')}
            />

            {/* 产品需求卡片部分 */}
            <RequirementCard 
              requirementData={requirementData} 
              loading={loading} 
              requirementRef={requirementRef}
              onPrint={() => handlePrintModule('requirement-card', 'Finalized Requirement Card')}
            />

            {/* 功能清单部分 */}
            <FunctionList 
              functionData={functionListData} 
              loading={loading} 
              functionListRef={functionListRef}
              onPrint={() => handlePrintModule('function-list', 'Function List')}
            />

            {/* MVP 策略推荐部分 - 已隐藏 */}
            {/* <MVPStrategy loading={loading} insightsRef={insightsRef} /> */}

            {/* PMF 分析部分 */}
            <PMFAnalysis 
              loading={loading} 
              recommendationsRef={recommendationsRef}
              onPrint={() => handlePrintModule('recommendations', 'Product-Market Fit (PMF) Analysis')}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-neutral-500 dark:text-neutral-400">
              <svg className="mx-auto h-12 w-12 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">无法显示搜索结果</p>
              <p className="text-sm mt-1">请返回历史记录页面查看其他搜索记录</p>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}