/**
 * SSE数据处理策略模式
 * 用于处理不同类型的SSE响应数据
 */

import { CompetitorData, DemandTag } from '@/types/competitor';
import { FigureData } from '@/components/figure/FigureCards';
import { RequirementCardData } from '@/components/requirement/RequirementCard';

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
  setLogicSteps: (steps: { title: string; description: string }[]) => void;
  setCompetitors: (competitors: CompetitorData[]) => void;
  setFigures: (figures: FigureData[]) => void;
  setHotKeysData: (data: any) => void;
  setRequirementCard: (data: RequirementCardData | null) => void;
  setLoading: (loading: boolean) => void;
  validSearchId: string;
  hasValidId: boolean;
  showToast: (options: { message: string; type?: "info" | "success" | "warning" | "error"; duration?: number }) => void;
  addSearchToHistory: (query: string, searchId: string) => void;
  query: string;
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
      plainPoints: cardContent.pain_points_addressed,
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
          plainPoints: sourceData.painPoints || sourceData.plainPoints || '',
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