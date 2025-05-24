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
  searchBarRef?: React.RefObject<HTMLDivElement>;
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
  const [clickedTag, setClickedTag] = useState<string | null>(null);
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

  // 创建初始标签 - 限制在searchBar上方区域
  const createTag = useCallback((text: string, index: number): FloatingTag => {
    const safeWidth = Math.max(containerSize.width, 800);
    
    // 计算可用高度 - 只在searchBar上方区域
    const availableHeight = Math.max(searchBarBounds.top - 100, 200); // 至少200px
    const startY = 80; // 从80px开始，避免覆盖标题
    const endY = startY + availableHeight;
    
    return {
      id: `${text}-${index}-${Date.now()}`,
      text,
      x: safeWidth + Math.random() * 300, // 从更远的右边开始
      y: startY + Math.random() * (endY - startY),
      speed: 0.3 + Math.random() * 0.8, // 稍微降低速度，更平滑
      size: 0.75 + Math.random() * 0.35, // 稍微减小尺寸范围
      color: colors[Math.floor(Math.random() * colors.length)],
      clickCount: 0,
      rotation: Math.random() * 6 - 3 // -3到3度的轻微旋转
    };
  }, [containerSize, searchBarBounds]);

  // 初始化标签 - 只在容器尺寸和搜索框位置确定后执行
  useEffect(() => {
    if (tags.length === 0 || containerSize.width === 0 || containerSize.height === 0 || searchBarBounds.top === 0) return;
    
    const initialTags: FloatingTag[] = [];
    for (let i = 0; i < maxTags; i++) {
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      initialTags.push(createTag(randomTag, i));
    }
    setFloatingTags(initialTags);
  }, [tags, maxTags, createTag, containerSize, searchBarBounds]);

  // 动画循环 - 改进平滑度
  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0 || searchBarBounds.top === 0) return;

    const animate = () => {
      setFloatingTags(prevTags => 
        prevTags.map(tag => {
          let newX = tag.x - tag.speed;
          let newY = tag.y;
          let newRotation = tag.rotation;
          
          // 如果标签移出左边界，重新从右边进入
          if (newX < -200) {
            const availableHeight = Math.max(searchBarBounds.top - 100, 200);
            const startY = 80;
            const endY = startY + availableHeight;
            
            newX = containerSize.width + 200 + Math.random() * 300;
            newY = startY + Math.random() * (endY - startY);
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
  }, [containerSize, searchBarBounds]);

  const handleTagClick = (tag: FloatingTag) => {
    if (clickedTag === tag.text) {
      // 第二次点击同一个标签，添加到搜索
      onTagSelected(tag.text);
      setClickedTag(null);
    } else {
      // 第一次点击，显示消息提示
      setClickedTag(tag.text);
      if (onShowMessage) {
        onShowMessage("Click again to add to search");
      }
      
      // 3秒后自动清除选中状态
      setTimeout(() => {
        setClickedTag(null);
      }, 3000);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
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
        >
          <span 
            className={`inline-block px-3 py-1.5 rounded-full text-white font-medium bg-gradient-to-r ${tag.color} 
              ${clickedTag === tag.text ? 'opacity-95 scale-105' : 'opacity-70 hover:opacity-90'} 
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