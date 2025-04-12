"use client";
import { animate, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Utility function to render logo from CDN URL
export const renderLogoFromCDN = (url: string, alt: string = "Logo", className: string = "h-6 w-6") => {
  if (!url) return null;
  
  try {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="relative w-full h-full flex items-center justify-center bg-white dark:bg-neutral-800 rounded-md p-2">
          <img 
            src={url} 
            alt={alt} 
            className="w-4/5 h-4/5 object-contain"
            style={{ maxWidth: '80%', maxHeight: '80%' }}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering image from CDN:", error);
    return (
      <div className={cn("flex items-center justify-center bg-neutral-200 dark:bg-neutral-700 rounded-full", className)}>
        <span className="text-neutral-500 dark:text-neutral-300 text-sm font-medium">
          {alt.substring(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }
};

export interface HistoryCardProps {
  title: string;
  description: string;
  date: string;
  category?: string | string[];
  logoUrl?: string;
  logoAlt?: string;
}

export function HistoryCard({ 
  title, 
  description, 
  date, 
  category = "Search",
  logoUrl,
  logoAlt
}: HistoryCardProps) {
  // Convert category to array if it's a string
  const categories = typeof category === 'string' 
    ? category.split('｜').filter(Boolean) 
    : Array.isArray(category) ? category : [category];
  
  // Store visible categories in state to maintain them after initial render
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const tagsContainerRef = React.useRef<HTMLDivElement>(null);
  const calculatedRef = React.useRef(false);
  
  // 使用useCallback缓存计算函数，避免重复创建
  const calculateVisibleTags = React.useCallback(() => {
    const containerRef = tagsContainerRef.current;
    if (!containerRef || !document.body) return;
    
    const containerWidth = containerRef.clientWidth;
    if (containerWidth === 0) return; // 容器宽度为0时不进行计算
    
    let totalWidth = 0;
    let visibleCount = 0;
    
    // 临时容器来测量标签，不影响UI
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.display = 'flex';
    tempContainer.style.width = `${containerWidth}px`;
    document.body.appendChild(tempContainer);
    
    try {
      // 临时span来测量每个标签的宽度
      categories.forEach((cat) => {
        const tempSpan = document.createElement('span');
        tempSpan.className = 'bg-neutral-100 px-2 py-1 rounded text-xs whitespace-nowrap mr-2 mb-2';
        tempSpan.textContent = cat;
        tempContainer.appendChild(tempSpan);
        
        const spanWidth = tempSpan.offsetWidth + 8; // 8px为外边距
        if (totalWidth + spanWidth <= containerWidth) {
          totalWidth += spanWidth;
          visibleCount++;
        }
      });
      
      // 避免无限循环：仅当新的计算结果不同时才更新
      const newVisibleCategories = categories.slice(0, visibleCount);
      setVisibleCategories(newVisibleCategories);
      setHasMore(visibleCount < categories.length);
      calculatedRef.current = true;
    } finally {
      // 确保临时容器被移除
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
    }
  }, [categories]);
  
  // 使用useEffect注册事件监听器并初始计算
  useEffect(() => {
    // 初始计算，仅在组件挂载后进行
    if (!calculatedRef.current) {
      // 使用setTimeout确保DOM已完全渲染
      const timer = setTimeout(() => {
        calculateVisibleTags();
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      calculateVisibleTags();
    };
    
    // 窗口大小变化时重新计算
    window.addEventListener('resize', handleResize);
    
    // 清理函数移除事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateVisibleTags]);
  
  return (
    <Card>
      <div className="flex flex-col h-full">
        <CardSkeletonContainer>
          <Skeleton logoUrl={logoUrl} logoAlt={logoAlt || title} />
        </CardSkeletonContainer>
        
        <CardTitle>{title}</CardTitle>
        
        <div className="min-h-[60px]">
          <CardDescription>{description}</CardDescription>
        </div>
        
        <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="text-xs text-neutral-500 mb-3">
            {date}
          </div>
          <div ref={tagsContainerRef} className="flex flex-nowrap overflow-hidden h-[28px]">
            {visibleCategories.map((cat, index) => (
              <span 
                key={index}
                className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded text-xs text-neutral-600 dark:text-neutral-300 whitespace-nowrap mr-2"
              >
                {cat}
              </span>
            ))}
            {hasMore && (
              <span className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded text-xs text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                +{categories.length - visibleCategories.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

const Skeleton = ({ logoUrl, logoAlt }: { logoUrl?: string; logoAlt?: string }) => {
  const scale = [1, 1.1, 1];
  const transform = ["translateY(0px)", "translateY(-4px)", "translateY(0px)"];
  const sequence = [
    [
      ".circle-1",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-2",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-3",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-4",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-5",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
  ];

  useEffect(() => {
    animate(sequence, {
      // @ts-ignore
      repeat: Infinity,
      repeatDelay: 1,
    });
  }, []);
  
  // 常用服务的图标URLs 
  const defaultLogos = {
    logo1: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/openai.svg",
    logo2: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/github.svg",
    logo3: logoUrl || "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/google.svg",
    logo4: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/microsoftbing.svg",
    logo5: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/notion.svg",
  };
  
  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <div className="flex flex-row shrink-0 justify-center items-center gap-2">
        <Container className="h-8 w-8 circle-1">
          <div className="h-4 w-4">
            <img src={defaultLogos.logo1} alt="OpenAI" className="w-full h-full dark:invert" />
          </div>
        </Container>
        <Container className="h-12 w-12 circle-2">
          <div className="h-6 w-6">
            <img src={defaultLogos.logo2} alt="GitHub" className="w-full h-full dark:invert" />
          </div>
        </Container>
        <Container className="circle-3">
          <div className="h-8 w-8">
            <img src={defaultLogos.logo3} alt={logoAlt || "Google"} className="w-full h-full dark:invert" />
          </div>
        </Container>
        <Container className="h-12 w-12 circle-4">
          <div className="h-6 w-6">
            <img src={defaultLogos.logo4} alt="Bing" className="w-full h-full dark:invert" />
          </div>
        </Container>
        <Container className="h-8 w-8 circle-5">
          <div className="h-4 w-4">
            <img src={defaultLogos.logo5} alt="Notion" className="w-full h-full dark:invert" />
          </div>
        </Container>
      </div>

      <div className="h-40 w-px absolute m-auto z-40 bg-gradient-to-b  animate-move">
        <div className="w-10 h-32 top-1/2 -translate-y-1/2 absolute -left-10">
          <Sparkles />
        </div>
      </div>
    </div>
  );
};

const Sparkles = () => {
  const randomMove = () => Math.random() * 2 - 1;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();
  return (
    <div className="absolute inset-0">
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: random() * 2 + 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: `2px`,
            height: `2px`,
            borderRadius: "50%",
            zIndex: 1,
          }}
          className="inline-block bg-black dark:bg-white"
        ></motion.span>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "w-full p-6 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group h-full flex flex-col",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-sm font-normal text-neutral-600 dark:text-neutral-400 line-clamp-3",
        className
      )}
    >
      {children}
    </p>
  );
};

export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        "h-[160px] rounded-xl z-40 mb-3",
        className,
        showGradient &&
          "bg-neutral-300 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
      )}
    >
      {children}
    </div>
  );
};

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `h-16 w-16 rounded-full flex items-center justify-center bg-white dark:bg-neutral-800 
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]`,
        className
      )}
    >
      {children}
    </div>
  );
}; 