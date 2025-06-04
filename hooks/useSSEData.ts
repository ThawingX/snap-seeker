"use client";
import { useState, useEffect, useRef } from "react";
import { ENV } from '@/lib/env';
import { normalizeSSEData } from '@/lib/utils';
import { addSearchToHistory } from "@/lib/searchHistory";
import { useToast } from "@/components/ui/toast";
import { SSEDataProcessor, SSEProcessingContext } from '@/lib/sse-data-strategies';
import { CompetitorData, HotKeysData, SearchStep } from '@/types/competitor';

interface UseSSEDataProps {
  query: string;
  searchId: string;
}

interface UseSSEDataReturn {
  loading: boolean;
  logicSteps: SearchStep[];
  competitors: CompetitorData[];
  hotKeysData: HotKeysData;
  error: string | null;
}

/**
 * SSE数据获取自定义Hook
 * 处理服务器发送事件的数据流
 */
export const useSSEData = ({ query, searchId }: UseSSEDataProps): UseSSEDataReturn => {
  const [loading, setLoading] = useState(true);
  const [logicSteps, setLogicSteps] = useState<SearchStep[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [hotKeysData, setHotKeysData] = useState<HotKeysData>({
    mostRelevant: [],
    allInSeeker: [],
    allFields: []
  });
  const [error, setError] = useState<string | null>(null);
  
  const { showToast } = useToast();
  const intervalIdRef = useRef<number | null>(null);
  const processor = useRef(new SSEDataProcessor());

  useEffect(() => {
    if (!searchId || !query) return;

    // 检查是否已有缓存数据
    const cachedData = localStorage.getItem(`searchData_${searchId}`);
    if (cachedData) {
      try {
        const { logicSteps: cachedSteps, competitors: cachedCompetitors, hotKeysData: cachedHotKeys } = JSON.parse(cachedData);
        if (cachedSteps && cachedCompetitors) {
          setLogicSteps(cachedSteps);
          setCompetitors(cachedCompetitors);
          if (cachedHotKeys) {
            setHotKeysData(cachedHotKeys);
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error parsing cached data:', err);
        // 如果解析缓存数据出错，继续执行获取新数据
      }
    }

    let abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setLogicSteps([]);
        setCompetitors([]);
        setHotKeysData({
          mostRelevant: [],
          allInSeeker: [],
          allFields: []
        });
        setError(null);

        const response = await fetch(ENV.TARGET_CHAT_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
          },
          body: JSON.stringify({ query, searchId }),
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is not readable');
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let lastDataTime = Date.now();
        const streamTimeout = 15000; // 15 seconds
        let hasReceivedCompetitors = false;
        
        // 创建处理上下文
        let currentLogicSteps: SearchStep[] = [];
        let currentCompetitors: CompetitorData[] = [];
        let currentHotKeysData: HotKeysData = {
          mostRelevant: [],
          allInSeeker: [],
          allFields: []
        };
        let hasValidId = false;
        let validSearchId = searchId;

        const context: SSEProcessingContext = {
          currentLogicSteps,
          currentCompetitors,
          currentHotKeysData,
          setLogicSteps: (steps) => {
            currentLogicSteps = steps;
            setLogicSteps(steps);
          },
          setCompetitors: (comps) => {
            currentCompetitors = comps;
            setCompetitors(comps);
          },
          setHotKeysData: (data) => {
            currentHotKeysData = data;
            setHotKeysData(data);
          },
          setLoading,
          validSearchId,
          hasValidId,
          showToast,
          addSearchToHistory,
          query
        };

        // 设置超时监控
        intervalIdRef.current = window.setInterval(() => {
          const currentTime = Date.now();
          if ((currentTime - lastDataTime > streamTimeout) && hasReceivedCompetitors) {
            console.log("Stream processing timed out, sending end signal");
            setLoading(false);

            // 保存数据到localStorage
            const dataToStore = {
              logicSteps: currentLogicSteps,
              competitors: currentCompetitors,
              hotKeysData: currentHotKeysData
            };
            localStorage.setItem(`searchData_${validSearchId}`, JSON.stringify(dataToStore));

            if (intervalIdRef.current !== null) {
              clearInterval(intervalIdRef.current);
              intervalIdRef.current = null;
            }
          }
        }, 1000);

        const processChunk = async () => {
          try {
            const { done, value } = await reader.read();

            if (done) {
              // 存储完整的数据到localStorage
              const dataToStore = {
                logicSteps: currentLogicSteps,
                competitors: currentCompetitors,
                hotKeysData: currentHotKeysData
              };
              localStorage.setItem(`searchData_${validSearchId}`, JSON.stringify(dataToStore));
              setLoading(false);

              if (intervalIdRef.current !== null) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
              }
              return;
            }

            // 更新最后数据时间
            lastDataTime = Date.now();

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            // 处理每一行
            for (const line of lines) {
              if (line.trim() === '') continue;

              try {
                const normalizedLine = normalizeSSEData(line);

                if (normalizedLine.startsWith('data:')) {
                  const jsonString = normalizedLine.substring(5).trim();
                  const jsonData = JSON.parse(jsonString);

                  // 更新上下文中的状态
                  context.validSearchId = validSearchId;
                  context.hasValidId = hasValidId;
                  context.currentLogicSteps = currentLogicSteps;
                  context.currentCompetitors = currentCompetitors;
                  context.currentHotKeysData = currentHotKeysData;

                  // 检查是否需要标记已接收到竞争对手数据
                  if (jsonData.step === 'Main Competitors') {
                    hasReceivedCompetitors = true;
                  }

                  // 使用策略模式处理数据
                  const shouldEnd = processor.current.process(jsonData, context);
                  
                  // 更新本地变量
                  validSearchId = context.validSearchId;
                  hasValidId = context.hasValidId;
                  currentLogicSteps = context.currentLogicSteps;
                  currentCompetitors = context.currentCompetitors;
                  currentHotKeysData = context.currentHotKeysData;

                  if (shouldEnd) {
                    return; // 结束处理
                  }
                }
              } catch (err) {
                console.error('Error parsing SSE data:', err, line);
                // 继续处理下一行，不让单个解析错误中断整个流程
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
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [query, searchId]);

  return {
    loading,
    logicSteps,
    competitors,
    hotKeysData,
    error
  };
};