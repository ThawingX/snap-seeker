"use client";
import React, { useState, useEffect, useRef } from "react";
import { BackgroundBeamsWithCollision } from "../ui/background-beams-with-collision";
import { SearchBar, SearchBarRef } from "./SearchBar";
import ColourfulText from "../ui/colourful-text";
import { FloatingTags } from "../ui/floating-tags";
import { useToast } from "../ui/toast";

// 从后端获取热门标签的函数
const fetchHotTags = async (): Promise<string[]> => {
  try {
    let response;

    // 生产环境 - 使用直接API
    response = await fetch('https://api.snapsnap.site/api/hot_keys', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });


    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();

    // 假设后端返回的数据格式为 { tags: string[] } 或者直接是 string[]
    // 根据实际后端接口调整数据提取逻辑
    if (Array.isArray(data)) {
      return data;
    } else if (data.tags && Array.isArray(data.tags)) {
      return data.tags;
    } else {
      throw new Error('Invalid data format from API');
    }
  } catch (error) {
    console.error('Failed to fetch hot tags from API:', error);

    // 如果 API 调用失败，返回默认标签作为后备
    return [
      "AI工具", "SaaS平台", "移动应用", "电商平台", "社交网络",
      "在线教育", "金融科技", "健康医疗", "智能家居", "区块链",
      "云计算", "大数据", "物联网", "虚拟现实", "机器学习",
      "网络安全", "自动化", "用户体验", "敏捷开发", "微服务",
      "DevOps", "API集成", "数据分析", "人工智能", "创业项目",
      "产品设计", "市场营销", "客户管理", "项目管理", "团队协作"
    ];
  }
};

export const Dashboard = () => {
  const [hotTags, setHotTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchBarRef = useRef<SearchBarRef>(null);
  const searchBarContainerRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // 获取热门标签
  useEffect(() => {
    const loadHotTags = async () => {
      setIsLoading(true);
      const tags = await fetchHotTags();
      setHotTags(tags);
      setIsLoading(false);
    };

    loadHotTags();
  }, []);

  // 处理标签选择
  const handleTagSelected = (tag: string) => {
    if (searchBarRef.current) {
      searchBarRef.current.addTag(tag);
    }
  };

  // 处理消息显示
  const handleShowMessage = (message: string) => {
    showToast({
      message,
      type: "info",
      duration: 2500
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2 p-4 md:p-10 relative overflow-hidden">

        {/* 背景层 - 最底层，放大尺寸 */}
        <div className="flex max-w-5xl flex-col items-center justify-center w-full relative" style={{ zIndex: 1 }}>
          <BackgroundBeamsWithCollision className="flex flex-col items-center justify-center rounded-3xl shadow-lg bg-opacity-60 backdrop-blur-sm scale-110">
            {/* 占位空间，保持布局 */}
            <div className="relative z-10 w-full max-w-3xl px-8 py-32">
            </div>
          </BackgroundBeamsWithCollision>
        </div>

        {/* 弹幕标签层 - 在背景之上 */}
        {!isLoading && hotTags.length > 0 && (
          <div className="absolute inset-0" style={{ zIndex: 50 }}>
            <FloatingTags
              tags={hotTags}
              onTagSelected={handleTagSelected}
              maxTags={35}
              searchBarRef={searchBarContainerRef}
              onShowMessage={handleShowMessage}
            />
          </div>
        )}

        {/* 标题和搜索框层 - 在弹幕之上，垂直排列 */}
        <div ref={searchBarContainerRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-6 flex flex-col items-center space-y-8" style={{ zIndex: 100 }}>
          {/* 标题 */}
          <h1 className="text-4xl md:text-4xl font-bold text-center text-black dark:text-white">
            Get Your <ColourfulText text="MVP" /> Right. Find Your <ColourfulText text="PMF" /> Fast.
          </h1>
          
          {/* 搜索框 */}
          <div className="w-full">
            <SearchBar ref={searchBarRef} />
          </div>
        </div>

        {/* 提示文本 - 在弹幕之上 */}
        {!isLoading && hotTags.length > 0 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" style={{ zIndex: 200 }}>
            <div className="flex items-center space-x-2 text-sm text-neutral-400 bg-black bg-opacity-40 px-4 py-2 rounded-full backdrop-blur-md border border-neutral-700">
              <span className="text-lg">💡</span>
              <span>Click floating tags to add to search</span>
            </div>
          </div>
        )}

        {/* 加载状态 - 最顶层 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 300 }}>
            <div className="flex items-center space-x-3 text-neutral-400 bg-black bg-opacity-50 px-6 py-3 rounded-full backdrop-blur-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
              <span className="text-sm">正在加载热门标签...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 