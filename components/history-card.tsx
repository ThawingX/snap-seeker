"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  CardTitle,
  CardDescription,
  CardSkeletonContainer,
} from "@/components/ui/card-components";
import { calculateVisibleTags, formatCategories } from "@/lib/tag-utils";
import { cn } from "@/lib/utils";
import { trackHistoryCardClick } from '@/lib/analytics';

export interface HistoryCardProps {
  title: string;
  description: string;
  date: string;
  category?: string | string[];
  logoUrl?: string;
  logoAlt?: string;
  id?: string;
}

// 文本截断工具函数，确保卡片描述显示省略号
const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * 历史记录卡片组件
 * 展示历史搜索记录，包含标题、描述、日期和分类标签
 */
export function HistoryCard({ 
  title, 
  description, 
  date, 
  category = "Search",
  logoUrl,
  logoAlt,
  id = "-1"
}: HistoryCardProps) {
  // 将分类转换为数组
  const categories = formatCategories(category);
  // 截断描述文本
  const truncatedDescription = truncateText(description);
  
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const calculatedRef = useRef(false);
  
  /**
   * 更新可见标签
   * 基于容器宽度计算并更新可见标签
   */
  const updateVisibleTags = () => {
    const containerRef = tagsContainerRef.current;
    if (!containerRef) return;
    
    const containerWidth = containerRef.clientWidth;
    if (containerWidth === 0) return;
    
    const { visibleCategories: newVisibleCategories, hasMore: newHasMore } = 
      calculateVisibleTags(categories, containerWidth);
    
    setVisibleCategories(newVisibleCategories);
    setHasMore(newHasMore);
    calculatedRef.current = true;
  };
  
  // 组件挂载后初始计算
  useEffect(() => {
    if (!calculatedRef.current) {
      const timer = setTimeout(updateVisibleTags, 0);
      return () => clearTimeout(timer);
    }
  }, []);
  
  // 监听窗口大小变化
  useEffect(() => {
    window.addEventListener('resize', updateVisibleTags);
    return () => {
      window.removeEventListener('resize', updateVisibleTags);
    };
  }, []);
  
  const handleCardClick = () => {
    trackHistoryCardClick({
      search_query: title,
      search_id: id,
      created_at: date,
      categories: categories
    });
  };

  return (
    <Link href={`/results?id=${id}`} className="block" onClick={handleCardClick}>
      <motion.div
        className="group/card relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 p-5 transition duration-200 dark:border-neutral-800 dark:bg-neutral-900 
                 hover:border-neutral-300 hover:shadow-md dark:hover:border-neutral-700 transform hover:-translate-y-1 text-neutral-900 dark:text-neutral-100"
        style={{
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.4, 
          ease: "easeInOut"
        }}
      >
        <div className="flex flex-col h-full">
          <CardSkeletonContainer>
            <Skeleton logoUrl={logoUrl} logoAlt={logoAlt || title} />
          </CardSkeletonContainer>
          
          <CardTitle>{title}</CardTitle>
          
          <div className="min-h-[60px]">
            <CardDescription>{truncatedDescription}</CardDescription>
          </div>
          
          <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
              {date}
            </div>
            <div ref={tagsContainerRef} className="flex flex-nowrap overflow-hidden h-[28px]">
              {visibleCategories.filter(cat => cat != null).map((cat, index) => (
                <span 
                  key={index}
                  className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded text-xs text-neutral-700 dark:text-neutral-300 whitespace-nowrap mr-2"
                >
                  {cat}
                </span>
              ))}
              {hasMore && (
                <span className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded text-xs text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                  +{categories.length - visibleCategories.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      
    </Link>
  );
}

/**
 * 骨架屏动画组件
 * 用于卡片加载时显示的动画效果
 */
const Skeleton = ({ logoUrl, logoAlt }: { logoUrl?: string; logoAlt?: string }) => {
  // 定义动画参数
  const pulseAnimation = {
    scale: [1, 1.1, 1],
    y: [0, -4, 0],
  };
  
  // 动画时间设置
  const transition = {
    duration: 2,
    ease: "easeInOut",
    repeat: Infinity,
    repeatDelay: 0.5
  };
  
  // 常用服务的图标URLs 
  const defaultLogos = {
    logo1: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/openai.svg",
    logo2: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/github.svg",
    logo3: logoUrl || "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/google.svg",
    logo4: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/microsoftbing.svg",
    logo5: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/notion.svg",
  };

  const Container = ({
    className,
    children,
    delay = 0
  }: {
    className?: string;
    children: React.ReactNode;
    delay?: number;
  }) => {
    return (
      <motion.div
        className={cn(
          `h-16 w-16 rounded-full flex items-center justify-center bg-neutral-50 dark:bg-neutral-800 
          shadow-[0px_0px_8px_0px_rgba(0,0,0,0.1)_inset,0px_4px_12px_-4px_rgba(0,0,0,0.1)] 
          dark:shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]`,
          className
        )}
        animate={pulseAnimation}
        transition={{
          ...transition,
          delay: delay
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <div className="flex flex-row shrink-0 justify-center items-center gap-2">
        <Container className="h-8 w-8" delay={0}>
          <div className="h-4 w-4 flex items-center justify-center">
            <img src={defaultLogos.logo1} alt="OpenAI" className="w-full h-full dark:invert" />
          </div>
        </Container>
        <Container className="h-12 w-12" delay={0.2}>
          <div className="h-6 w-6 flex items-center justify-center">
            <img src={defaultLogos.logo2} alt="GitHub" className="w-full h-full dark:invert" />
          </div>
        </Container>
        <Container className="h-16 w-16" delay={0.4}>
          <div className="h-8 w-8 flex items-center justify-center">
            <img src={defaultLogos.logo3} alt={logoAlt || "Google"} className="w-full h-full dark:invert" />
          </div>
        </Container>
        <Container className="h-12 w-12" delay={0.6}>
          <div className="h-6 w-6 flex items-center justify-center">
            <img src={defaultLogos.logo4} alt="Bing" className="w-full h-full dark:invert" />
          </div>
        </Container>
        <Container className="h-8 w-8" delay={0.8}>
          <div className="h-4 w-4 flex items-center justify-center">
            <img src={defaultLogos.logo5} alt="Notion" className="w-full h-full dark:invert" />
          </div>
        </Container>
      </div>

      <motion.div 
        className="h-40 w-px absolute m-auto z-40 bg-gradient-to-b"
        animate={{ 
          opacity: [0.2, 1, 0.2],
          height: ["60%", "80%", "60%"]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-10 h-32 top-1/2 -translate-y-1/2 absolute -left-10">
          <Sparkles />
        </div>
      </motion.div>
    </div>
  );
};

/**
 * 闪光效果组件
 * 添加微妙的视觉效果，提升UI质感
 */
const Sparkles = () => {
  const randomMove = () => Math.random() * 2 - 1;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();

  return (
    <div className="relative flex">
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          className="mx-[1px] inline-block h-1.5 w-px bg-neutral-200 dark:bg-neutral-700"
          style={{ height: Math.max(5, random() * 15) }}
          animate={{
            translateY: [0, randomMove(), randomMove(), 0],
            opacity: [0, randomOpacity(), randomOpacity(), 0],
          }}
          transition={{
            duration: random() * 3 + 2,
            repeat: Infinity,
            delay: random() * 3,
          }}
        />
      ))}
    </div>
  );
};