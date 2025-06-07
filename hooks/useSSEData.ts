"use client";
import { useState, useEffect, useRef } from "react";
import { ENV } from '@/lib/env';
import { normalizeSSEData } from '@/lib/utils';
import { addSearchToHistory } from "@/lib/searchHistory";
import { useToast } from "@/components/ui/toast";
import { SSEDataProcessor, SSEProcessingContext } from '@/lib/sse-data-strategies';
import { CompetitorData, HotKeysData, SearchStep } from '@/types/competitor';
import { FigureData } from '@/components/figure/FigureCards';

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
  error: string | null;
}

// 初始化状态数据
const createInitialState = () => ({
  logicSteps: [],
  competitors: [],
  figures: [],
  hotKeysData: {
    mostRelevant: [],
    allInSeeker: [],
    allFields: []
  }
});

// 尝试从缓存加载数据
const loadCachedData = (searchId: string) => {
  try {
    const cachedData = localStorage.getItem(`searchData_${searchId}`);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      if (parsed.logicSteps && parsed.competitors) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error parsing cached data:', err);
  }
  return null;
};

// 保存数据到缓存
const saveDataToCache = (searchId: string, data: any) => {
  try {
    localStorage.setItem(`searchData_${searchId}`, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving data to cache:', err);
  }
};

// 创建SSE处理上下文
const createSSEContext = (
  initialData: any,
  setters: any,
  searchId: string,
  query: string,
  showToast: any
): SSEProcessingContext => ({
  currentLogicSteps: initialData.logicSteps,
  currentCompetitors: initialData.competitors,
  currentFigures: initialData.figures,
  currentHotKeysData: initialData.hotKeysData,
  setLogicSteps: (steps) => {
    initialData.logicSteps = steps;
    setters.setLogicSteps(steps);
  },
  setCompetitors: (comps) => {
    initialData.competitors = comps;
    setters.setCompetitors(comps);
  },
  setFigures: (figs) => {
    initialData.figures = figs;
    setters.setFigures(figs);
  },
  setHotKeysData: (data) => {
    initialData.hotKeysData = data;
    setters.setHotKeysData(data);
  },
  setLoading: setters.setLoading,
  validSearchId: searchId,
  hasValidId: false,
  showToast,
  addSearchToHistory,
  query
});

// 设置超时监控
const setupTimeoutMonitor = (
  intervalIdRef: React.MutableRefObject<number | null>,
  lastDataTimeRef: React.MutableRefObject<number>,
  hasReceivedCompetitorsRef: React.MutableRefObject<boolean>,
  currentData: any,
  validSearchId: string,
  setLoading: (loading: boolean) => void,
  streamTimeout: number = 15000
) => {
  intervalIdRef.current = window.setInterval(() => {
    const currentTime = Date.now();
    if ((currentTime - lastDataTimeRef.current > streamTimeout) && hasReceivedCompetitorsRef.current) {
      console.log("Stream processing timed out, sending end signal");
      setLoading(false);
      saveDataToCache(validSearchId, currentData);
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
  hasReceivedCompetitorsRef: React.MutableRefObject<boolean>
): boolean => {
  if (line.trim() === '') return false;

  try {
    const normalizedLine = normalizeSSEData(line);
    
    if (normalizedLine.startsWith('data:')) {
      const jsonString = normalizedLine.substring(5).trim();
      const jsonData = JSON.parse(jsonString);

      // 检查是否需要标记已接收到竞争对手数据
      if (jsonData.step === 'Main Competitors') {
        hasReceivedCompetitorsRef.current = true;
      }

      // 使用策略模式处理数据
      return processor.process(jsonData, context);
    }
  } catch (err) {
    console.error('Error parsing SSE data:', err, line);
  }
  
  return false;
};

// 创建流处理函数
const createStreamProcessor = (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder,
  processor: SSEDataProcessor,
  context: SSEProcessingContext,
  currentData: any,
  validSearchId: string,
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
          saveDataToCache(validSearchId, currentData);
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
          console.log(lines)
          const shouldEnd = processSSELine(line, processor, context, hasReceivedCompetitorsRef);
          if (shouldEnd) {
            return;
          }
        }
      }
    } catch (error) {
      // 检查是否是 AbortError（组件卸载导致的中断）
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Stream processing aborted');
        return;
      }
      
      console.error('Error processing stream chunk:', error);
      setError('Error processing response data. Please try again.');
      setLoading(false);
    }
  };
};

/**
 * SSE数据获取自定义Hook
 * 处理服务器发送事件的数据流
 */
export const useSSEData = ({ query, searchId }: UseSSEDataProps): UseSSEDataReturn => {
  const initialState = createInitialState();
  const [loading, setLoading] = useState(true);
  const [logicSteps, setLogicSteps] = useState<SearchStep[]>(initialState.logicSteps);
  const [competitors, setCompetitors] = useState<CompetitorData[]>(initialState.competitors);
  const [figures, setFigures] = useState<FigureData[]>(initialState.figures);
  const [hotKeysData, setHotKeysData] = useState<HotKeysData>(initialState.hotKeysData);
  const [error, setError] = useState<string | null>(null);
  
  const { showToast } = useToast();
  const intervalIdRef = useRef<number | null>(null);
  const lastDataTimeRef = useRef<number>(Date.now());
  const hasReceivedCompetitorsRef = useRef<boolean>(false);
  const processor = useRef(new SSEDataProcessor());

  useEffect(() => {
    if (!searchId || !query) return;

    // 尝试加载缓存数据
    const cachedData = loadCachedData(searchId);
    if (cachedData) {
      setLogicSteps(cachedData.logicSteps);
      setCompetitors(cachedData.competitors);
      if (cachedData.figures) setFigures(cachedData.figures);
      if (cachedData.hotKeysData) setHotKeysData(cachedData.hotKeysData);
      setLoading(false);
      return;
    }

    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        // 重置状态
        const resetState = createInitialState();
        setLoading(true);
        setLogicSteps(resetState.logicSteps);
        setCompetitors(resetState.competitors);
        setFigures(resetState.figures);
        setHotKeysData(resetState.hotKeysData);
        setError(null);

        // 发起请求
        const response = await fetch(ENV.TARGET_CHAT_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
          },
          body: JSON.stringify({ query, searchId }),
          signal: abortController.signal
        });
        console.log(response)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is not readable');
        }

        // 初始化处理数据
        const currentData = createInitialState();
        const setters = { setLogicSteps, setCompetitors, setFigures, setHotKeysData, setLoading };
        const context = createSSEContext(currentData, setters, searchId, query, showToast);
        
        // 设置超时监控
        lastDataTimeRef.current = Date.now();
        hasReceivedCompetitorsRef.current = false;
        setupTimeoutMonitor(
          intervalIdRef,
          lastDataTimeRef,
          hasReceivedCompetitorsRef,
          currentData,
          searchId,
          setLoading
        );

        // 创建并启动流处理器
        const processStream = createStreamProcessor(
          reader,
          new TextDecoder(),
          processor.current,
          context,
          currentData,
          searchId,
          lastDataTimeRef,
          hasReceivedCompetitorsRef,
          intervalIdRef,
          setLoading,
          setError
        );

        await processStream();


      } catch (err) {
        console.error('Error in SSE connection:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchData();

    return () => {
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
    error
  };
};