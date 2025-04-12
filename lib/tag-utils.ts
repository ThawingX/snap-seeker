/**
 * 标签计算工具函数
 * 提供处理和计算标签显示相关的工具函数
 */

/**
 * 计算可见标签数量
 * 根据容器宽度和标签列表计算可显示的最大标签数量
 * 
 * @param categories 标签数组
 * @param containerWidth 容器宽度
 * @returns 对象包含可见标签数组和是否有更多标签的标志
 */
export const calculateVisibleTags = (
  categories: string[],
  containerWidth: number
): { visibleCategories: string[]; hasMore: boolean } => {
  if (containerWidth === 0 || !categories.length) {
    return { visibleCategories: [], hasMore: false };
  }

  // 在文档中创建临时容器来测量标签
  let totalWidth = 0;
  let visibleCount = 0;

  // 临时元素用于计算宽度
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.visibility = 'hidden';
  tempContainer.style.display = 'flex';
  tempContainer.style.width = `${containerWidth}px`;
  document.body.appendChild(tempContainer);

  try {
    // 计算每个标签的宽度
    for (const category of categories) {
      const tempSpan = document.createElement('span');
      tempSpan.className = 'bg-neutral-100 px-2 py-1 rounded text-xs whitespace-nowrap mr-2 mb-2';
      tempSpan.textContent = category;
      tempContainer.appendChild(tempSpan);

      const spanWidth = tempSpan.offsetWidth + 8; // 8px为外边距
      if (totalWidth + spanWidth <= containerWidth) {
        totalWidth += spanWidth;
        visibleCount++;
      } else {
        break; // 如果超出容器宽度，停止计算
      }
    }

    // 返回可见标签和是否有更多标签
    return {
      visibleCategories: categories.slice(0, visibleCount),
      hasMore: visibleCount < categories.length
    };
  } finally {
    // 确保临时容器被移除
    if (document.body.contains(tempContainer)) {
      document.body.removeChild(tempContainer);
    }
  }
};

/**
 * 格式化分类数据
 * 将字符串或数组格式的分类转换为统一的数组格式
 * 
 * @param category 分类数据，可以是字符串或数组
 * @returns 标准化后的分类数组
 */
export const formatCategories = (category: string | string[] | undefined): string[] => {
  if (!category) return ["默认分类"];
  
  if (typeof category === 'string') {
    return category.split('｜').filter(Boolean);
  }
  
  return Array.isArray(category) ? category : [category];
}; 