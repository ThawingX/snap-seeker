"use client";
import React, { useState, useEffect, useRef } from "react";
import { BackgroundBeamsWithCollision } from "../ui/background-beams-with-collision";
import { SearchBar, SearchBarRef } from "./SearchBar";
import { Cover } from "../ui/cover";
import ColourfulText from "../ui/colourful-text";
import { FloatingTags } from "../ui/floating-tags";
import { useToast } from "../ui/toast";
import Link from "next/link";

// 模拟从后端获取热门标签的函数
const fetchHotTags = async (): Promise<string[]> => {
  // 这里应该是真实的 API 调用
  // 目前使用模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        "AI工具", "SaaS平台", "移动应用", "电商平台", "社交网络",
        "在线教育", "金融科技", "健康医疗", "智能家居", "区块链",
        "云计算", "大数据", "物联网", "虚拟现实", "机器学习",
        "网络安全", "自动化", "用户体验", "敏捷开发", "微服务",
        "DevOps", "API集成", "数据分析", "人工智能", "创业项目",
        "产品设计", "市场营销", "客户管理", "项目管理", "团队协作"
      ]);
    }, 1000);
  });
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
      try {
        setIsLoading(true);
        const tags = await fetchHotTags();
        setHotTags(tags);
      } catch (error) {
        console.error('Failed to fetch hot tags:', error);
        // 如果获取失败，使用默认标签
        setHotTags([
          "AI工具", "SaaS平台", "移动应用", "电商平台", "社交网络",
          "在线教育", "金融科技", "健康医疗", "智能家居", "区块链"
        ]);
      } finally {
        setIsLoading(false);
      }
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
        {/* 弹幕标签层 - 在背景层，限制在searchBar上方 */}
        {!isLoading && hotTags.length > 0 && (
          <div className="absolute inset-0" style={{ zIndex: 1 }}>
            <FloatingTags 
              tags={hotTags} 
              onTagSelected={handleTagSelected}
              maxTags={25}
              searchBarRef={searchBarContainerRef}
              onShowMessage={handleShowMessage}
            />
          </div>
        )}
        
        {/* 主要内容层 */}
        <div className="flex max-w-4xl flex-col items-center justify-center w-full relative" style={{ zIndex: 10 }}>
          <BackgroundBeamsWithCollision className="flex flex-col items-center justify-center rounded-3xl shadow-lg bg-opacity-60 backdrop-blur-sm">
            <h1 className="text-4xl md:text-4xl font-bold text-center mt-16 mb-12 relative z-10 text-black dark:text-white">
              Get Your <ColourfulText text="MVP" /> Right. Find Your <ColourfulText text="PMF" /> Fast. 
            </h1>

            <div ref={searchBarContainerRef} className="relative z-10 w-full max-w-2xl px-6 mb-16">
              <SearchBar ref={searchBarRef} />
            </div>
          </BackgroundBeamsWithCollision>
        </div>
        
        {/* 提示文本 */}
        {!isLoading && hotTags.length > 0 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center space-x-2 text-sm text-neutral-400 bg-black bg-opacity-40 px-4 py-2 rounded-full backdrop-blur-md border border-neutral-700">
              <span className="text-lg">💡</span>
              <span>Click floating tags once for hint, twice to add to search</span>
            </div>
          </div>
        )}
        
        {/* 加载状态 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
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