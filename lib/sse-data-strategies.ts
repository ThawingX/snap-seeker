/**
 * SSE数据处理策略模式
 * 用于处理不同类型的SSE响应数据
 */

import { CompetitorData, DemandTag } from '@/types/competitor';
import { FigureData } from '@/components/figure/FigureCards';
import { RequirementCardData } from '@/components/requirement/RequirementCard';
import { FunctionListData } from '@/components/function/FunctionList';

/**
 * SSE数据处理策略接口
 */
export interface SSEDataStrategy {
  canHandle(step: string): boolean;
  process(data: any, context: SSEProcessingContext): void;
}

/**
 * SSE处理上下文
 */
export interface SSEProcessingContext {
  currentLogicSteps: { title: string; description: string }[];
  currentCompetitors: CompetitorData[];
  currentFigures: FigureData[];
  currentHotKeysData: {
    mostRelevant: DemandTag[];
    allInSeeker: DemandTag[];
    allFields: DemandTag[];
  };
  currentRequirementCard: RequirementCardData | null;
  currentFunctionList: FunctionListData[];
  setLogicSteps: (steps: { title: string; description: string }[]) => void;
  setCompetitors: (competitors: CompetitorData[]) => void;
  setFigures: (figures: FigureData[]) => void;
  setHotKeysData: (data: any) => void;
  setRequirementCard: (data: RequirementCardData | null) => void;
  setFunctionList: (data: FunctionListData[]) => void;
  setLoading: (loading: boolean) => void;
  validSearchId: string;
  hasValidId: boolean;
  showToast: (options: { message: string; type?: "info" | "success" | "warning" | "error"; duration?: number }) => void;
  updateURL: (newSearchId: string) => void;
  updateURLWithSearchId: (newSearchId: string) => void;
  setFinalSearchId: (id: string) => void;
  query: string;
  searchId: string;
}

/**
 * 聊天ID处理策略
 */
export class ChatIdStrategy implements SSEDataStrategy {
  canHandle(step: string): boolean {
    return step === 'chatID';
  }

  process(data: any, context: SSEProcessingContext): void {
    if (data.content && data.content.trim() !== '') {
      context.validSearchId = data.content;
      context.hasValidId = true;
      // 立即更新浏览器URL中的searchId，但保留isNew参数
      context.updateURLWithSearchId(data.content);
      // 更新finalSearchId状态，供组件使用
      context.setFinalSearchId(data.content);
      // 注意：不在这里保存数据和添加历史记录，而是在流结束时统一处理
      // 这样确保所有数据都已经处理完成后再保存和添加历史记录
    }
  }
}

/**
 * 步骤处理策略
 */
export class StepStrategy implements SSEDataStrategy {
  canHandle(step: string): boolean {
    return step === 'step';
  }

  process(data: any, context: SSEProcessingContext): void {
    const content = data.messageContent;
    const titleMatch = content.match(/## (.+?)\n/);
    const title = titleMatch ? titleMatch[1] : 'Step';
    const description = content.replace(/## .+?\n/, '').trim();

    context.currentLogicSteps = [...context.currentLogicSteps, { title, description }];
    context.setLogicSteps(context.currentLogicSteps);
  }
}

/**
 * 热门关键词处理策略
 */
export class HotKeysStrategy implements SSEDataStrategy {
  canHandle(step: string): boolean {
    return step === 'Hot Keys';
  }

  process(data: any, context: SSEProcessingContext): void {
    const hotKeysType = data.type;
    const hotKeys = data.hot_keys;

    if (hotKeys && typeof hotKeys === 'object') {
      const convertedTags = this.convertHotKeysToTags(hotKeys);

      if (hotKeysType === 'Most Relevant') {
        context.currentHotKeysData.mostRelevant = convertedTags;
      } else if (hotKeysType === 'All in Seeker') {
        context.currentHotKeysData.allInSeeker = convertedTags;
      } else if (hotKeysType === 'All Fields') {
        context.currentHotKeysData.allFields = convertedTags;
      }

      context.setHotKeysData({ ...context.currentHotKeysData });
    }
  }

  private convertHotKeysToTags(hotKeys: Record<string, number>): DemandTag[] {
    return Object.entries(hotKeys).map(([key, searchCount]) => ({
      tag: key,
      searchCount: searchCount,
      trend: searchCount > 15000 ? 'hot' : searchCount > 10000 ? 'rising' : 'stable' as const
    }));
  }
}

/**
 * 竞争对手处理策略
 */
export class CompetitorsStrategy implements SSEDataStrategy {
  canHandle(step: string): boolean {
    return step === 'Main Competitors';
  }

  process(data: any, context: SSEProcessingContext): void {
    const cardIndex = data.card_index;
    const cardContent = data.card_content;

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
      painPoints: cardContent.pain_points_addressed,
      keyFeatures: cardContent.key_features,
      potentialWeaknesses: cardContent.potential_weaknesses,
      revenueModel: revenueModel
    };

    context.currentCompetitors = [...context.currentCompetitors];
    context.currentCompetitors[cardIndex] = newCompetitor;
    context.setCompetitors(context.currentCompetitors);
  }
}

/**
 * 图片处理策略
 */
export class FigureStrategy implements SSEDataStrategy {
  canHandle(step: string): boolean {
    return step === 'figure';
  }

  process(data: any, context: SSEProcessingContext): void {
    const figureIndex = data.figureIndex;
    const content = data.content;

    const newFigure: FigureData = {
      step: data.step,
      figureIndex: figureIndex,
      content: content
    };

    // 按照figureIndex排序插入
    const updatedFigures = [...context.currentFigures];
    const existingIndex = updatedFigures.findIndex(f => f.figureIndex === figureIndex);

    if (existingIndex >= 0) {
      updatedFigures[existingIndex] = newFigure;
    } else {
      updatedFigures.push(newFigure);
      updatedFigures.sort((a, b) => a.figureIndex - b.figureIndex);
    }

    context.currentFigures = updatedFigures;
    context.setFigures(updatedFigures);
  }
}

/**
 * 完成处理策略
 */
export class DoneStrategy implements SSEDataStrategy {
  canHandle(step: string): boolean {
    return step === 'Done';
  }

  process(data: any, context: SSEProcessingContext): void {
    console.log('收到结束信号，流处理完成');

    // 检查是否需要显示提示信息
    if (!context.hasValidId) {
      context.showToast({
        message: '这次搜索将不会进行存储',
        type: 'warning',
        duration: 3000
      });
    }

    // 在流结束时更新浏览器URL，移除isNew参数
    if (context.hasValidId) {
      context.updateURL(context.validSearchId);
    }

    // 触发搜索完成埋点
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'search_complete',
        search_query: context.query,
        search_id: context.validSearchId || context.searchId,
        has_results: context.hasValidId
      });
    }

    // 注意：数据保存和历史记录添加已在useSSEData中统一处理
    // 这里只需要设置加载状态为false
    context.setLoading(false);
  }
}

/**
 * 需求卡片处理策略
 */
export class RequirementCardStrategy implements SSEDataStrategy {
  canHandle(step: string): boolean {
    return step === 'requirementCard';
  }

  process(data: any, context: SSEProcessingContext): void {
    // 处理两种可能的数据结构：data.content 或直接在 data 中
    const sourceData = data.content || data;
    
    if (sourceData) {
      try {
        const requirementData: RequirementCardData = {
          step: sourceData.step || 'requirementCard',
          userStory: sourceData.userStory || '',
          slogan: sourceData.slogan || '',
          targetUser: sourceData.targetUser || '',
          painPoints: sourceData.painPoints || sourceData.painPoints || '',
          usp: Array.isArray(sourceData.usp) ? sourceData.usp : [],
          revenueModel: sourceData.revenueModel || ''
        };

        context.setRequirementCard(requirementData);

        context.showToast({
          message: 'Product requirements generated successfully!',
          type: 'success',
          duration: 3000
        });
      } catch (error) {
        console.error('Error processing requirement card data:', error);
        context.showToast({
          message: 'Error processing requirement data',
          type: 'error',
          duration: 3000
        });
      }
    }
  }
}

/**
 * 功能清单处理策略
 */
export class FunctionListStrategy implements SSEDataStrategy {
  canHandle(step: string): boolean {
    return step === 'functionList';
  }

  process(sourceData: any, context: SSEProcessingContext): void {
    console.log('Processing function list data:', sourceData);
    
    try {
      // 创建功能清单数据
      const functionData: FunctionListData = {
        step: sourceData.step || 'functionList',
        type: sourceData.type || 'others',
        content: sourceData.content || {}
      };

      // 获取当前功能列表状态并更新
      const currentFunctionList = [...context.currentFunctionList];
      
      // 查找是否已存在相同类型的数据
      const existingIndex = currentFunctionList.findIndex(item => item.type === functionData.type);
      
      if (existingIndex >= 0) {
        // 如果已存在相同类型的数据，合并内容而不是替换
        const existingData = currentFunctionList[existingIndex];
        const mergedContent = { ...existingData.content };
        
        // 合并新内容到现有内容中
        Object.keys(functionData.content).forEach(key => {
          if (mergedContent[key]) {
            // 如果已存在该模块，合并功能列表并去重
            const existingFeatures = mergedContent[key] || [];
            const newFeatures = functionData.content[key] || [];
            mergedContent[key] = [...new Set([...existingFeatures, ...newFeatures])];
          } else {
            // 如果不存在该模块，直接添加
            mergedContent[key] = functionData.content[key];
          }
        });
        
        // 更新现有数据
        currentFunctionList[existingIndex] = {
          ...existingData,
          content: mergedContent
        };
      } else {
        // 如果不存在相同类型的数据，直接添加新数据
        currentFunctionList.push(functionData);
      }
      
      console.log('Updated function list:', currentFunctionList);
      context.setFunctionList(currentFunctionList);
      
      if (context.showToast) {
        context.showToast({
          message: `Function list updated: ${functionData.type}`,
          type: "info",
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error processing function list data:', error);
      if (context.showToast) {
        context.showToast({
          message: "Error processing function list data",
          type: "error",
          duration: 3000
        });
      }
    }
  }
}

/**
 * SSE数据处理器
 */
export class SSEDataProcessor {
  private strategies: SSEDataStrategy[] = [
    new ChatIdStrategy(),
    new StepStrategy(),
    new HotKeysStrategy(),
    new CompetitorsStrategy(),
    new FigureStrategy(),
    new RequirementCardStrategy(),
    new FunctionListStrategy(),
    new DoneStrategy()
  ];

  process(jsonData: any, context: SSEProcessingContext): boolean {
    // 处理兼容旧格式的ID
    if (jsonData.id && !context.hasValidId) {
      context.validSearchId = jsonData.id;
      context.hasValidId = true;
      // 注意：不在这里添加历史记录和保存数据，而是在流结束时统一处理
      // 这样确保所有数据都已经处理完成后再保存和添加历史记录
    }

    if (!jsonData.step) {
      return false;
    }

    // 检查是否需要标记已接收到竞争对手数据
    if (jsonData.step === 'Main Competitors') {
      // 这里可以添加额外的逻辑，比如设置hasReceivedCompetitors标志
    }

    // 查找合适的策略处理数据
    const strategy = this.strategies.find(s => s.canHandle(jsonData.step));
    if (strategy) {
      try {
        strategy.process(jsonData, context);
        return jsonData.step === 'Done'; // 返回是否应该结束处理
      } catch (error) {
        console.error(`Error processing step ${jsonData.step}:`, error);
        return false;
      }
    }

    return false;
  }
}