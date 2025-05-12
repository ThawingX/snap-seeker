// 搜索历史项的数据结构
export interface SearchHistoryItem {
  id: string;
  query: string;
  description: string;
  timestamp: string;
  category: string;
  logoUrl?: string;
}

// 本地存储键
const STORAGE_KEY = 'snapseeker_search_history';

// 获取搜索历史
export const getSearchHistory = (): SearchHistoryItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const historyJson = localStorage.getItem(STORAGE_KEY);
    if (!historyJson) return [];
    return JSON.parse(historyJson);
  } catch (error) {
    console.error('Failed to parse search history from localStorage:', error);
    return [];
  }
};

// 添加搜索记录
export const addSearchToHistory = (query: string, id?: string): void => {
  if (typeof window === 'undefined' || !query.trim()) return;

  try {
    const history = getSearchHistory();

    // 检查是否存在相同查询
    const existingIndex = history.findIndex(item => item.query.toLowerCase() === query.toLowerCase());

    // 如果存在，从历史记录中移除旧条目
    if (existingIndex !== -1) {
      history.splice(existingIndex, 1);
    }

    // 创建新的历史记录项
    const newItem: SearchHistoryItem = {
      id:id || '-1',
      query,
      description: generateDescription(query),
      timestamp: new Date().toISOString(),
      category: generateCategory(query),
      logoUrl: getRandomLogoUrl(),
    };

    // 添加到历史记录的开头
    history.unshift(newItem);

    // 限制历史记录数量（例如保留最新的20条）
    const limitedHistory = history.slice(0, 20);

    // 保存回localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Failed to save search to history:', error);
  }
};

// 清除所有搜索历史
export const clearSearchHistory = (): void => {
  if (typeof window === 'undefined') return;

  // 获取当前历史记录，以便删除每个单独的搜索数据
  const history = getSearchHistory();

  // 删除每个搜索ID对应的localStorage条目
  history.forEach(item => {
    localStorage.removeItem(item.id);
  });

  // 删除历史记录列表
  localStorage.removeItem(STORAGE_KEY);
};

// 最大描述长度
const MAX_DESCRIPTION_LENGTH = 100;

// 生成描述（英文版本）
const generateDescription = (query: string): string => {
  const description = `Explore market competition analysis, user needs, and business opportunities related to "${query}"`;

  // 限制描述长度
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return description.substring(0, MAX_DESCRIPTION_LENGTH) + '...';
  }

  return description;
};

// 生成分类（英文版本）
const generateCategory = (query: string): string => {
  const categories = [
    "Business｜Market Analysis｜Competition",
    "Technology｜Product｜Innovation",
    "Research｜Data｜Insights",
    "Marketing｜Users｜Growth"
  ];

  // 简单随机选择一个分类
  return categories[Math.floor(Math.random() * categories.length)];
};

// 获取随机Logo URL（简单实现）
const getRandomLogoUrl = (): string => {
  const logos = [
    "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/notion.svg",
    "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/github.svg",
    "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/google.svg",
    "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/buymeacoffee.svg",
    "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/tensorflow.svg"
  ];

  return logos[Math.floor(Math.random() * logos.length)];
}; 