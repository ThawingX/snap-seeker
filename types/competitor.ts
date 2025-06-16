/**
 * 竞争对手分析相关的类型定义
 */

/**
 * 竞争对手数据接口
 * 定义了竞争对手分析中需要展示的数据结构
 */
export interface CompetitorData {
  id: string;
  name: string;
  slogan: string;
  relevance: string;
  traffic: string;
  targetUser: string[];
  painPoints: string[];
  keyFeatures: string[];
  potentialWeaknesses: string[];
  revenueModel: string;
}

/**
 * 竞争对手卡片数据接口
 * 来自SSE响应的卡片数据结构
 */
export interface CompetitorCardData {
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
 * 需求热度标签接口
 */
export interface DemandTag {
  tag: string;
  searchCount: number;
  trend: 'hot' | 'rising' | 'stable';
}

/**
 * 需求排行榜接口
 */
export interface DemandRanking {
  title: string | React.ReactNode;
  tags: DemandTag[];
}

/**
 * 搜索步骤接口
 */
export interface SearchStep {
  title: string;
  description: string;
}

/**
 * 热门关键词数据接口
 */
export interface HotKeysData {
  mostRelevant: DemandTag[];
  allInSeeker: DemandTag[];
  allFields: DemandTag[];
}