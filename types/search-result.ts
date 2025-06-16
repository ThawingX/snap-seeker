/**
 * 搜索结果相关的类型定义
 * 统一SSE和历史接口的数据结构
 */

import { CompetitorData, HotKeysData, SearchStep } from './competitor';
import { FigureData } from '@/components/figure/FigureCards';
import { RequirementCardData } from '@/components/requirement/RequirementCard';
import { FunctionListData } from '@/components/function/FunctionList';
import { SearchHistoryItem } from '@/lib/searchHistory';

/**
 * 搜索结果数据结构
 * 包含所有搜索分析的核心数据
 */
export interface SearchResultData {
  logicSteps: SearchStep[];
  competitors: CompetitorData[];
  figures: FigureData[];
  hotKeysData: HotKeysData;
  requirementCard: RequirementCardData | null;
  functionList: FunctionListData[];
}

/**
 * 历史接口返回的数据结构
 * 包含查询信息和搜索结果
 */
export interface HistoryApiResponse {
  id: string;
  query: string;
  timestamp: string;
  description?: string;
  category?: string;
  logoUrl?: string;
  results: SearchResultData;
}

/**
 * 历史列表项接口
 * 继承SearchHistoryItem并扩展搜索结果
 */
export interface HistoryItemWithResults extends SearchHistoryItem {
  results?: SearchResultData;
}

/**
 * 完整的搜索数据结构（包含查询和结果）
 * 用于本地存储和数据传递
 */
export interface CompleteSearchData {
  query: string;
  results: SearchResultData;
  timestamp: string;
}

/**
 * 初始化搜索结果状态数据
 * 提供默认的空状态
 */
export const createInitialResultsState = (): SearchResultData => ({
  logicSteps: [],
  competitors: [],
  figures: [],
  hotKeysData: {
    mostRelevant: [],
    allInSeeker: [],
    allFields: []
  },
  requirementCard: null,
  functionList: []
});

/**
 * 数据处理工具函数
 * 统一处理来自不同接口的数据
 */
export class SearchResultProcessor {
  /**
   * 处理历史接口返回的数据
   * @param apiResponse 历史接口返回的原始数据
   * @returns 标准化的搜索结果数据
   */
  static processHistoryApiResponse(apiResponse: any): SearchResultData {
    // 处理不同的数据结构格式
    const results = apiResponse?.results || apiResponse;
    
    return {
      logicSteps: Array.isArray(results?.logicSteps) ? results.logicSteps.map((step: any) => {
        // 处理历史数据格式：{step: "step", messageContent: "..."}
        if (step.messageContent && !step.title && !step.description) {
          const content = step.messageContent.trim();
          // 使用正则表达式提取markdown标题
          const titleMatch = content.match(/^\s*##\s*(.+?)\n/);
          const title = titleMatch ? titleMatch[1].trim() : `Analysis Step`;
          // 提取标题后的描述内容
          const description = titleMatch 
            ? content.replace(/^\s*##\s*.+?\n/, '').trim()
            : content;
          
          return {
            title,
            description
          };
        }
        // 如果已经是正确格式，直接返回
        if (step.title && step.description) {
          return step;
        }
        // 兜底处理
        return {
          title: step.title || step.step || 'Analysis Step',
          description: step.description || step.messageContent || 'Processing...'
        };
      }) : [],
      competitors: Array.isArray(results?.competitors) 
        ? results.competitors.filter((competitor: any) => 
            competitor && 
            (competitor.name || competitor.slogan || competitor.relevance || 
             (Array.isArray(competitor.targetUser) && competitor.targetUser.some((user: any) => user.trim())) ||
             (Array.isArray(competitor.keyFeatures) && competitor.keyFeatures.some((feature: any) => feature.trim()))
            )
          )
        : [],
      figures: Array.isArray(results?.figures) 
         ? results.figures.filter((figure: any) => figure && figure.content && figure.content.trim())
         : [],
      hotKeysData: results?.hotKeysData && typeof results.hotKeysData === 'object' ? {
        mostRelevant: Array.isArray(results.hotKeysData.mostRelevant) 
          ? results.hotKeysData.mostRelevant 
          : (typeof results.hotKeysData.mostRelevant === 'object' && results.hotKeysData.mostRelevant !== null)
            ? Object.entries(results.hotKeysData.mostRelevant).map(([tag, searchCount]) => ({
                tag,
                searchCount: typeof searchCount === 'number' ? searchCount : 0,
                trend: 'stable' as const
              }))
            : [],
        allInSeeker: Array.isArray(results.hotKeysData.allInSeeker) 
          ? results.hotKeysData.allInSeeker 
          : (typeof results.hotKeysData.allInSeeker === 'object' && results.hotKeysData.allInSeeker !== null)
            ? Object.entries(results.hotKeysData.allInSeeker).map(([tag, searchCount]) => ({
                tag,
                searchCount: typeof searchCount === 'number' ? searchCount : 0,
                trend: 'stable' as const
              }))
            : [],
        allFields: Array.isArray(results.hotKeysData.allFields) 
          ? results.hotKeysData.allFields 
          : (typeof results.hotKeysData.allFields === 'object' && results.hotKeysData.allFields !== null)
            ? Object.entries(results.hotKeysData.allFields).map(([tag, searchCount]) => ({
                tag,
                searchCount: typeof searchCount === 'number' ? searchCount : 0,
                trend: 'stable' as const
              }))
            : []
      } : {
        mostRelevant: [],
        allInSeeker: [],
        allFields: []
      },
      requirementCard: results?.requirementCard && (
         results.requirementCard.userStory?.trim() ||
         results.requirementCard.slogan?.trim() ||
         results.requirementCard.targetUser?.trim() ||
         results.requirementCard.painPoints?.trim() ||
         (Array.isArray(results.requirementCard.usp) && results.requirementCard.usp.some((item: any) => item?.trim())) ||
         results.requirementCard.revenueModel?.trim()
       ) ? results.requirementCard : null,
        functionList: Array.isArray(results?.functionList) ? results.functionList : []
    };
  }

  /**
   * 验证搜索结果数据的完整性
   * @param data 搜索结果数据
   * @returns 是否为有效数据
   */
  static validateSearchResultData(data: any): data is SearchResultData {
    try {
      return (
        data &&
        typeof data === 'object' &&
        Array.isArray(data.logicSteps) &&
        Array.isArray(data.competitors) &&
        Array.isArray(data.figures) &&
        data.hotKeysData &&
        typeof data.hotKeysData === 'object' &&
        Array.isArray(data.hotKeysData.mostRelevant) &&
        Array.isArray(data.hotKeysData.allInSeeker) &&
        Array.isArray(data.hotKeysData.allFields) &&
        Array.isArray(data.functionList)
      );
    } catch (error) {
      console.error('Error validating search result data:', error);
      return false;
    }
  }

  /**
   * 合并搜索结果数据
   * @param existing 现有数据
   * @param incoming 新数据
   * @returns 合并后的数据
   */
  static mergeSearchResultData(
    existing: SearchResultData,
    incoming: Partial<SearchResultData>
  ): SearchResultData {
    return {
      logicSteps: incoming.logicSteps || existing.logicSteps,
      competitors: incoming.competitors || existing.competitors,
      figures: incoming.figures || existing.figures,
      hotKeysData: incoming.hotKeysData || existing.hotKeysData,
      requirementCard: incoming.requirementCard !== undefined ? incoming.requirementCard : existing.requirementCard,
      functionList: incoming.functionList || existing.functionList
    };
  }

  /**
   * 安全地获取搜索结果数据
   * @param data 原始数据
   * @returns 安全的搜索结果数据
   */
  static safeGetSearchResultData(data: any): SearchResultData {
    const processed = this.processHistoryApiResponse(data);
    return this.validateSearchResultData(processed) ? processed : createInitialResultsState();
  }

  /**
   * 格式化历史项数据
   * @param item 历史项数据
   * @returns 格式化后的历史项
   */
  static formatHistoryItem(item: any): HistoryItemWithResults {
    return {
      id: item.id || '',
      query: item.query || '',
      description: item.description || '',
      timestamp: item.timestamp || new Date().toISOString(),
      category: item.category || 'general',
      logoUrl: item.logoUrl,
      results: item.results ? this.safeGetSearchResultData(item) : undefined
    };
  }
}