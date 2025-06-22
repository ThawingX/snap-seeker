"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ENV } from '@/lib/env';
import { normalizeSSEData } from '@/lib/utils';
// addSearchToHistory 已移除，历史记录现在通过API管理
import { useToast } from "@/components/ui/toast";
import { SSEDataProcessor, SSEProcessingContext } from '@/lib/sse-data-strategies';
import { CompetitorData, HotKeysData, SearchStep } from '@/types/competitor';
import { FigureData } from '@/components/figure/FigureCards';
import { RequirementCardData } from '@/components/requirement/RequirementCard';
import { FunctionListData } from '@/components/function/FunctionList';
import { SearchResultData, CompleteSearchData, createInitialResultsState } from '@/types/search-result';
import { tokenManager, setGlobalAuthErrorHandler } from '@/lib/api';

interface UseSSEDataProps {
  query: string;
  searchId: string;
}

interface UseSSEDataReturn {
  loading: boolean;
  logicSteps: SearchStep[];
  competitors: CompetitorData[];
  figures: FigureData[];
  hotKeysData: HotKeysData;
  requirementCard: RequirementCardData | null;
  functionList: FunctionListData[];
  error: string | null;
  finalSearchId: string; // 添加finalSearchId字段，返回最终使用的searchId（后端返回的或初始的）
}

// 搜索结果数据结构已移至 @/types/search-result

// 初始化函数已移至 @/types/search-result

// localStorage相关函数已移除，不再在本地存储搜索结果数据

/**
 * 创建SSE处理上下文
 * @param currentResults 当前搜索结果数据
 * @param setters 状态设置函数集合
 * @param searchId 搜索ID
 * @param query 搜索查询
 * @param showToast 提示函数
 * @returns SSE处理上下文
 */
const createSSEContext = (
  currentResults: SearchResultData,
  setters: {
    setLogicSteps: (steps: SearchStep[]) => void;
    setCompetitors: (competitors: CompetitorData[]) => void;
    setFigures: (figures: FigureData[]) => void;
    setHotKeysData: (data: HotKeysData) => void;
    setRequirementCard: (data: RequirementCardData | null) => void;
    setFunctionList: (data: FunctionListData[]) => void;
    setLoading: (loading: boolean) => void;
  },
  searchId: string,
  query: string,
  showToast: any,
  router: any,
  setFinalSearchId: (id: string) => void
): SSEProcessingContext => {
  // 创建一个可变的上下文对象，允许validSearchId被动态更新
  const context: SSEProcessingContext = {
    currentLogicSteps: currentResults.logicSteps,
    currentCompetitors: currentResults.competitors,
    currentFigures: currentResults.figures,
    currentHotKeysData: currentResults.hotKeysData,
    currentRequirementCard: currentResults.requirementCard,
    currentFunctionList: currentResults.functionList,
    setLogicSteps: (steps) => {
      currentResults.logicSteps = steps;
      setters.setLogicSteps(steps);
    },
    setCompetitors: (comps) => {
      currentResults.competitors = comps;
      setters.setCompetitors(comps);
    },
    setFigures: (figs) => {
      currentResults.figures = figs;
      setters.setFigures(figs);
    },
    setHotKeysData: (data) => {
      currentResults.hotKeysData = data;
      setters.setHotKeysData(data);
    },
    setRequirementCard: (data) => {
      currentResults.requirementCard = data;
      setters.setRequirementCard(data);
    },
    setFunctionList: (data: FunctionListData[]) => {
      currentResults.functionList = data;
      context.currentFunctionList = data; // 同步更新context中的currentFunctionList
      setters.setFunctionList(data);
    },
    setLoading: setters.setLoading,
    validSearchId: searchId, // 初始值使用传入的searchId
    hasValidId: false, // 初始为false，等待后端返回真实的id
    showToast,
    query,
    searchId,
    updateURL: (newSearchId: string) => {
      // 更新浏览器URL，使用replace避免在历史记录中创建新条目
      router.replace(`/results?id=${newSearchId}`);
    },
    updateURLWithSearchId: (newSearchId: string) => {
      // 更新浏览器URL中的searchId，但保留isNew参数
      const currentUrl = new URL(window.location.href);
      const isNew = currentUrl.searchParams.get('isNew');
      if (isNew === 'true') {
        router.replace(`/results?id=${newSearchId}&isNew=true`);
      } else {
        router.replace(`/results?id=${newSearchId}`);
      }
    },
    setFinalSearchId
  };
  
  return context;
};

/**
 * 设置超时监控
 * @param intervalIdRef 定时器引用
 * @param lastDataTimeRef 最后数据时间引用
 * @param hasReceivedCompetitorsRef 是否已接收竞争对手数据引用
 * @param context SSE处理上下文
 * @param validSearchId 有效搜索ID
 * @param query 搜索查询
 * @param setLoading 设置加载状态函数
 * @param streamTimeout 流超时时间（毫秒）
 */
const setupTimeoutMonitor = (
  intervalIdRef: React.MutableRefObject<number | null>,
  lastDataTimeRef: React.MutableRefObject<number>,
  hasReceivedCompetitorsRef: React.MutableRefObject<boolean>,
  context: SSEProcessingContext,
  validSearchId: string,
  query: string,
  setLoading: (loading: boolean) => void,
  streamTimeout: number = 15000
) => {
  intervalIdRef.current = window.setInterval(() => {
    const currentTime = Date.now();
    if ((currentTime - lastDataTimeRef.current > streamTimeout) && hasReceivedCompetitorsRef.current) {
      console.log("Stream processing timed out, sending end signal");
      setLoading(false);
      // 保存当前数据并结束流，使用context中的最新数据和动态searchId
      const latestResults: SearchResultData = {
        logicSteps: context.currentLogicSteps,
        competitors: context.currentCompetitors,
        figures: context.currentFigures,
        hotKeysData: context.currentHotKeysData,
        requirementCard: context.currentRequirementCard,
        functionList: context.currentFunctionList
      };
      // 使用context中的validSearchId，这个值可能已经被后端返回的id更新了
      const finalSearchId = context.hasValidId ? context.validSearchId : validSearchId;
      // localStorage保存已移除，不再在本地存储搜索结果数据
      // 历史记录现在通过API管理，不再需要客户端添加
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }
  }, 1000);
};

// 清理超时监控
const clearTimeoutMonitor = (intervalIdRef: React.MutableRefObject<number | null>) => {
  if (intervalIdRef.current !== null) {
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
  }
};

// 处理SSE数据行
const processSSELine = (
  line: string,
  processor: SSEDataProcessor,
  context: SSEProcessingContext,
  hasReceivedCompetitorsRef: React.MutableRefObject<boolean>,
  searchId: string,
  query: string
): boolean => {
  if (line.trim() === '') return false;

  try {
    const normalizedLine = normalizeSSEData(line);
    
    if (normalizedLine.startsWith('data:')) {
      const jsonString = normalizedLine.substring(5).trim();
      
      // 添加更详细的JSON解析错误处理
      let jsonData;
      try {
        jsonData = JSON.parse(jsonString);
      } catch (parseErr) {
        console.error('JSON parse error details:', {
          error: parseErr,
          originalLine: line.substring(0, 200) + (line.length > 200 ? '...' : ''),
          normalizedLine: normalizedLine.substring(0, 200) + (normalizedLine.length > 200 ? '...' : ''),
          jsonString: jsonString.substring(0, 200) + (jsonString.length > 200 ? '...' : '')
        });
        
        // 尝试手动修复常见的JSON问题
        try {
          let fixedJson = jsonString
            .replace(/'/g, '"')  // 单引号转双引号
            .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')  // 给属性名加引号
            .replace(/,\s*([}\]])/g, '$1')  // 移除尾随逗号
            .replace(/\n/g, ' ')  // 移除换行符
            .replace(/\r/g, ' ')  // 移除回车符
            .replace(/\t/g, ' ')  // 移除制表符
            .replace(/\s+/g, ' ');  // 合并多个空格
          
          jsonData = JSON.parse(fixedJson);
          console.log('Successfully fixed JSON:', fixedJson.substring(0, 100) + '...');
        } catch (fixErr) {
          console.error('Failed to fix JSON:', fixErr);
          return false;
        }
      }

      // 检查是否需要标记已接收到竞争对手数据
      if (jsonData.step === 'Main Competitors') {
        hasReceivedCompetitorsRef.current = true;
      }

      // 使用策略模式处理数据
      const processed = processor.process(jsonData, context);
      
      // 每次成功处理数据后立即持久化
      if (processed) {
        const currentResults: SearchResultData = {
          logicSteps: context.currentLogicSteps,
          competitors: context.currentCompetitors,
          figures: context.currentFigures,
          hotKeysData: context.currentHotKeysData,
          requirementCard: context.currentRequirementCard,
          functionList: context.currentFunctionList
        };
        
        // localStorage保存已移除，不再在本地存储搜索结果数据
        console.log(`Data processed: ${jsonData.step}`);
      }
      
      return processed;
    }
  } catch (err) {
    console.error('Error processing SSE line:', {
      error: err,
      line: line.substring(0, 200) + (line.length > 200 ? '...' : '')
    });
  }
  
  return false;
};

/**
 * 创建流处理函数
 * @param reader 流读取器
 * @param decoder 文本解码器
 * @param processor SSE数据处理器
 * @param context SSE处理上下文
 * @param currentResults 当前搜索结果数据
 * @param validSearchId 有效搜索ID
 * @param query 搜索查询
 * @param lastDataTimeRef 最后数据时间引用
 * @param hasReceivedCompetitorsRef 是否已接收竞争对手数据引用
 * @param intervalIdRef 定时器引用
 * @param setLoading 设置加载状态函数
 * @param setError 设置错误状态函数
 * @returns 异步流处理函数
 */
const createStreamProcessor = (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder,
  processor: SSEDataProcessor,
  context: SSEProcessingContext,
  currentResults: SearchResultData,
  validSearchId: string,
  query: string,
  lastDataTimeRef: React.MutableRefObject<number>,
  hasReceivedCompetitorsRef: React.MutableRefObject<boolean>,
  intervalIdRef: React.MutableRefObject<number | null>,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) => {
  return async () => {
    try {
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // 使用context中的最新数据进行保存，使用动态的searchId
          const latestResults: SearchResultData = {
            logicSteps: context.currentLogicSteps,
            competitors: context.currentCompetitors,
            figures: context.currentFigures,
            hotKeysData: context.currentHotKeysData,
            requirementCard: context.currentRequirementCard,
            functionList: context.currentFunctionList
          };
          const finalSearchId = context.hasValidId ? context.validSearchId : validSearchId;
          // localStorage保存已移除，不再在本地存储搜索结果数据
          // 历史记录现在通过API管理，不再需要客户端添加
          setLoading(false);
          clearTimeoutMonitor(intervalIdRef);
          return;
        }

        // 更新最后数据时间
        lastDataTimeRef.current = Date.now();

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        // 处理每一行
        for (const line of lines) {
          const shouldEnd = processSSELine(line, processor, context, hasReceivedCompetitorsRef, validSearchId, query);
          if (shouldEnd) {
            // 在流结束时保存数据，使用context中的最新数据和动态searchId
            const latestResults: SearchResultData = {
              logicSteps: context.currentLogicSteps,
              competitors: context.currentCompetitors,
              figures: context.currentFigures,
              hotKeysData: context.currentHotKeysData,
              requirementCard: context.currentRequirementCard,
              functionList: context.currentFunctionList
            };
            const finalSearchId = context.hasValidId ? context.validSearchId : validSearchId;
            // localStorage保存已移除，不再在本地存储搜索结果数据
            // 历史记录现在通过API管理，不再需要客户端添加
            setLoading(false);
            clearTimeoutMonitor(intervalIdRef);
            return;
          }
        }
      }
    } catch (error) {
      // 在任何异常情况下都保存当前数据，使用context中的最新数据和动态searchId
      const latestResults: SearchResultData = {
        logicSteps: context.currentLogicSteps,
        competitors: context.currentCompetitors,
        figures: context.currentFigures,
        hotKeysData: context.currentHotKeysData,
        requirementCard: context.currentRequirementCard,
        functionList: context.currentFunctionList
      };
      const finalSearchId = context.hasValidId ? context.validSearchId : validSearchId;
      // localStorage保存已移除，不再在本地存储搜索结果数据
      // 历史记录现在通过API管理，不再需要客户端添加
      setLoading(false);
      clearTimeoutMonitor(intervalIdRef);
      
      // 检查是否是 AbortError（组件卸载导致的中断）
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Stream processing aborted');
        return;
      }
      
      console.error('Error processing stream chunk:', error);
      setError('Error processing response data. Please try again.');
    }
  };
};

/**
 * SSE数据获取自定义Hook
 * 处理服务器发送事件的数据流，统一管理搜索数据存储
 */
export const useSSEData = ({ query, searchId }: UseSSEDataProps): UseSSEDataReturn => {
  const initialResults = createInitialResultsState();
  const [loading, setLoading] = useState(true);
  const [logicSteps, setLogicSteps] = useState<SearchStep[]>(initialResults.logicSteps);
  const [competitors, setCompetitors] = useState<CompetitorData[]>(initialResults.competitors);
  const [figures, setFigures] = useState<FigureData[]>(initialResults.figures);
  const [hotKeysData, setHotKeysData] = useState<HotKeysData>(initialResults.hotKeysData);
  const [requirementCard, setRequirementCard] = useState<RequirementCardData | null>(initialResults.requirementCard);
  const [functionList, setFunctionList] = useState<FunctionListData[]>(initialResults.functionList);
  const [error, setError] = useState<string | null>(null);
  const [finalSearchId, setFinalSearchId] = useState<string>(searchId); // 跟踪最终使用的searchId
  
  const { showToast } = useToast();
  const router = useRouter();
  const intervalIdRef = useRef<number | null>(null);
  const lastDataTimeRef = useRef<number>(Date.now());
  const hasReceivedCompetitorsRef = useRef<boolean>(false);
  const processor = useRef(new SSEDataProcessor());
  
  // 添加 ref 来保存最新的状态数据
  const latestDataRef = useRef<SearchResultData>(initialResults);
  
  // 每次状态更新时同步到 ref
  useEffect(() => {
    latestDataRef.current = {
      logicSteps,
      competitors,
      figures,
      hotKeysData,
      requirementCard,
      functionList
    };
  }, [logicSteps, competitors, figures, hotKeysData, requirementCard, functionList]);

  useEffect(() => {
    if (!searchId || !query) return;

    // localStorage加载已移除，不再从本地加载搜索结果数据
    // 直接进行新的搜索请求
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        // 重置状态 - 只在确实需要重新获取数据时执行
        const resetResults = createInitialResultsState();
        setLoading(true);
        setLogicSteps(resetResults.logicSteps);
        setCompetitors(resetResults.competitors);
        setFigures(resetResults.figures);
        setHotKeysData(resetResults.hotKeysData);
        setRequirementCard(resetResults.requirementCard);
        setFunctionList(resetResults.functionList);
        setError(null);

        // 发起请求
        const token = tokenManager.getToken();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        };
        
        // 添加Authorization header如果token存在
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(ENV.TARGET_CHAT_API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify({ query, searchId }),
          signal: abortController.signal
        });
        console.log('SSE Response:', response);
        
        // Handle 401 Unauthorized responses
        if (response.status === 401) {
          // Clear the invalid token
          tokenManager.removeToken();
          throw new Error('Authentication failed');
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is not readable');
        }

        // 初始化处理数据
        const currentResults = createInitialResultsState();
        const setters = { setLogicSteps, setCompetitors, setFigures, setHotKeysData, setRequirementCard, setFunctionList, setLoading };
        const context = createSSEContext(currentResults, setters, searchId, query, showToast, router, setFinalSearchId);
        
        // 设置超时监控
        lastDataTimeRef.current = Date.now();
        hasReceivedCompetitorsRef.current = false;
        setupTimeoutMonitor(
          intervalIdRef,
          lastDataTimeRef,
          hasReceivedCompetitorsRef,
          context,
          searchId,
          query,
          setLoading
        );

        // 创建并启动流处理器
        const processStream = createStreamProcessor(
          reader,
          new TextDecoder(),
          processor.current,
          context,
          currentResults,
          searchId,
          query,
          lastDataTimeRef,
          hasReceivedCompetitorsRef,
          intervalIdRef,
          setLoading,
          setError
        );

        await processStream();

      } catch (err) {
        // 在fetchData异常时也保存当前数据
        const currentResults: SearchResultData = {
          logicSteps,
          competitors,
          figures,
          hotKeysData,
          requirementCard,
          functionList
        };
        // localStorage保存已移除，不再在本地存储搜索结果数据
        
        console.error('Error in SSE connection:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // localStorage保存已移除，不再在本地存储搜索结果数据
      
      abortController.abort();
      clearTimeoutMonitor(intervalIdRef);
    };
  }, [query, searchId]);

  return {
    loading,
    logicSteps,
    competitors,
    figures,
    hotKeysData,
    requirementCard,
    functionList,
    error,
    finalSearchId
  };
};