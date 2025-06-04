"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";

interface FloatingTag {
  id: string;
  text: string;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  clickCount: number;
  rotation: number;
}

interface FloatingTagsProps {
  tags: string[];
  onTagSelected: (tag: string) => void;
  maxTags?: number;
  searchBarRef?: React.RefObject<HTMLDivElement | null>;
  onShowMessage?: (message: string) => void;
}

const colors = [
  "from-blue-400 to-purple-600",
  "from-green-400 to-blue-500", 
  "from-yellow-400 to-orange-500",
  "from-pink-400 to-red-500",
  "from-indigo-400 to-blue-600",
  "from-purple-400 to-pink-500",
  "from-cyan-400 to-teal-500",
  "from-emerald-400 to-green-500"
];

export const FloatingTags: React.FC<FloatingTagsProps> = ({ 
  tags, 
  onTagSelected, 
  maxTags = 25,
  searchBarRef,
  onShowMessage
}) => {
  const [floatingTags, setFloatingTags] = useState<FloatingTag[]>([]);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [searchBarBounds, setSearchBarBounds] = useState({ top: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // 监听容器尺寸变化和搜索框位置
  useEffect(() => {
    const updateSizes = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
      
      if (searchBarRef?.current) {
        const searchRect = searchBarRef.current.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect) {
          setSearchBarBounds({
            top: searchRect.top - containerRect.top,
            height: searchRect.height
          });
        }
      }
    };

    // 初始化尺寸
    updateSizes();

    // 监听窗口变化
    window.addEventListener('resize', updateSizes);
    
    // 使用 ResizeObserver 监听容器大小变化
    const resizeObserver = new ResizeObserver(updateSizes);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateSizes);
      resizeObserver.disconnect();
    };
  }, [searchBarRef]);

  // 创建初始标签 - 全屏显示，但避开搜索框和标题区域
  const createTag = useCallback((text: string, index: number, laneIndex?: number): FloatingTag => {
    const safeWidth = Math.max(containerSize.width, 800);
    const safeHeight = Math.max(containerSize.height, 600);
    
    // 全屏显示范围，但避开标题区域
    const titleAreaBottom = safeHeight * 0.25; // 标题区域大约占25%高度
    const startY = Math.max(titleAreaBottom, 120); // 从标题下方开始
    const endY = safeHeight - 60; // 到底部，留一些边距
    
    let y;
    
    // 如果指定了道路索引，使用道路系统避免堆叠
    if (laneIndex !== undefined) {
      const laneCount = 8; // 将可用空间分为8条道路
      const availableHeight = endY - startY;
      const laneHeight = availableHeight / laneCount;
      const actualLaneIndex = laneIndex % laneCount;
      
      // 在指定道路内随机选择位置，留出一些缓冲空间
      const laneStart = startY + (actualLaneIndex * laneHeight) + (laneHeight * 0.1);
      const laneEnd = startY + ((actualLaneIndex + 1) * laneHeight) - (laneHeight * 0.1);
      y = laneStart + Math.random() * (laneEnd - laneStart);
    } else {
      // 如果没有指定道路，使用原来的随机方式
      y = startY + Math.random() * (endY - startY);
    }
    
    // 如果标签会与搜索框重叠，则调整位置
    if (searchBarBounds.top > 0) {
      const searchTop = searchBarBounds.top - 50; // 搜索框上方50px
      const searchBottom = searchBarBounds.top + searchBarBounds.height + 50; // 搜索框下方50px
      
      // 如果随机位置在搜索框区域内，重新分配到搜索框上方或下方
      if (y >= searchTop && y <= searchBottom) {
        // 随机选择放在搜索框上方还是下方
        if (Math.random() > 0.5 && searchTop > startY + 100) {
          // 放在搜索框上方（但在标题下方）
          y = Math.max(startY, searchTop - 100) + Math.random() * Math.max(searchTop - startY - 100, 50);
        } else if (searchBottom < endY - 100) {
          // 放在搜索框下方
          y = searchBottom + Math.random() * (endY - searchBottom - 100);
        } else {
          // 如果空间不够，放在搜索框上方
          y = Math.max(startY, searchTop - 100) + Math.random() * Math.max(searchTop - startY - 100, 50);
        }
      }
    }
    
    return {
      id: `${text}-${index}-${Math.random().toString(36).substring(2, 9)}`,
      text,
      x: safeWidth + Math.random() * 300, // 从更远的右边开始
      y: Math.max(startY, Math.min(y, endY)), // 确保在范围内
      speed: 0.3 + Math.random() * 0.8, // 稍微降低速度，更平滑
      size: 0.75 + Math.random() * 0.35, // 稍微减小尺寸范围
      color: colors[Math.floor(Math.random() * colors.length)],
      clickCount: 0,
      rotation: Math.random() * 6 - 3 // -3到3度的轻微旋转
    };
  }, [containerSize, searchBarBounds]);

  // 初始化标签 - 分批连续创建，而非一次性创建
  useEffect(() => {
    if (tags.length === 0 || containerSize.width === 0 || containerSize.height === 0) return;
    
    // 清空现有标签
    setFloatingTags([]);
    
    // 分批创建标签的函数
    let tagIndex = 0;
    let laneIndex = 0; // 用于道路分配的索引
    const batchSize = 3; // 每批创建3个标签
    const createInterval = 800; // 每800ms创建一批
    
    const createBatch = () => {
      const newTags: FloatingTag[] = [];
      const currentBatchSize = Math.min(batchSize, maxTags - tagIndex);
      
      for (let i = 0; i < currentBatchSize; i++) {
        const randomTag = tags[Math.floor(Math.random() * tags.length)];
        // 为每个标签指定不同的道路，避免堆叠
        const delayedTag = createTag(randomTag, tagIndex + i, laneIndex + i);
        // 给每个标签一个额外的初始 x 偏移，让它们不同时出现
        delayedTag.x = delayedTag.x + (i * 200); // 增加间距到200px
        newTags.push(delayedTag);
      }
      
      setFloatingTags(prev => [...prev, ...newTags]);
      tagIndex += currentBatchSize;
      laneIndex += currentBatchSize; // 更新道路索引
      
      // 如果还没有创建完所有标签，继续创建下一批
      if (tagIndex < maxTags) {
        setTimeout(createBatch, createInterval);
      }
    };
    
    // 开始创建第一批
    setTimeout(createBatch, 500); // 延迟500ms开始，让页面先渲染
  }, [tags, maxTags, createTag, containerSize, searchBarBounds]);

  // 动画循环 - 全屏移动
  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;

    const animate = () => {
      setFloatingTags(prevTags => 
        prevTags.map(tag => {
          // 如果标签被悬停，则不移动
          if (hoveredTag === tag.text) {
            return tag;
          }
          
          let newX = tag.x - tag.speed;
          let newY = tag.y;
          let newRotation = tag.rotation;
          
          // 如果标签移出左边界，重新从右边进入
          if (newX < -200) {
            const safeHeight = Math.max(containerSize.height, 600);
            const titleAreaBottom = safeHeight * 0.25; // 标题区域大约占25%高度
            const startY = Math.max(titleAreaBottom, 120); // 从标题下方开始
            const endY = safeHeight - 60;
            
            newX = containerSize.width + 200 + Math.random() * 300;
            
            // 重新进入时也使用道路系统，保持间距
            const laneCount = 8;
            const availableHeight = endY - startY;
            const laneHeight = availableHeight / laneCount;
            const randomLane = Math.floor(Math.random() * laneCount);
            const laneStart = startY + (randomLane * laneHeight) + (laneHeight * 0.1);
            const laneEnd = startY + ((randomLane + 1) * laneHeight) - (laneHeight * 0.1);
            newY = laneStart + Math.random() * (laneEnd - laneStart);
            
            // 如果有搜索框，避开搜索框区域
            if (searchBarBounds.top > 0) {
              const searchTop = searchBarBounds.top - 50;
              const searchBottom = searchBarBounds.top + searchBarBounds.height + 50;
              
              if (newY >= searchTop && newY <= searchBottom) {
                if (Math.random() > 0.5 && searchTop > startY + 100) {
                  newY = Math.max(startY, searchTop - 100) + Math.random() * Math.max(searchTop - startY - 100, 50);
                } else if (searchBottom < endY - 100) {
                  newY = searchBottom + Math.random() * (endY - searchBottom - 100);
                } else {
                  newY = Math.max(startY, searchTop - 100) + Math.random() * Math.max(searchTop - startY - 100, 50);
                }
              }
            }
            
            newY = Math.max(startY, Math.min(newY, endY));
            newRotation = Math.random() * 6 - 3;
          }
          
          return { 
            ...tag, 
            x: newX, 
            y: newY, 
            rotation: newRotation 
          };
        })
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [containerSize, searchBarBounds, hoveredTag]);

  const handleTagClick = (tag: FloatingTag) => {
    // 单击直接添加到搜索框
    onTagSelected(tag.text);
    
    // 显示成功提示
    if (onShowMessage) {
      onShowMessage("Tag added to search");
    }
  };

  const handleMouseEnter = (tagText: string) => {
    setHoveredTag(tagText);
  };

  const handleMouseLeave = () => {
    setHoveredTag(null);
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 50 }}
    >
      {floatingTags.map(tag => (
        <div
          key={tag.id}
          className="absolute pointer-events-auto cursor-pointer transform transition-all duration-300 hover:scale-110 hover:rotate-1"
          style={{
            left: `${tag.x}px`,
            top: `${tag.y}px`,
            fontSize: `${tag.size}rem`,
            transform: `rotate(${tag.rotation}deg)`,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
          }}
          onClick={() => handleTagClick(tag)}
          onMouseEnter={() => handleMouseEnter(tag.text)}
          onMouseLeave={handleMouseLeave}
        >
          <span 
            className={`inline-block px-3 py-1.5 rounded-full text-white font-medium bg-gradient-to-r ${tag.color} 
              opacity-70 hover:opacity-90 
              ${hoveredTag === tag.text ? 'shadow-2xl scale-110' : ''}
              transition-all duration-300 shadow-lg backdrop-blur-sm border border-white border-opacity-20
              hover:shadow-xl hover:border-opacity-40`}
          >
            #{tag.text}
          </span>
        </div>
      ))}
    </div>
  );
};