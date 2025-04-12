"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

/**
 * 通用卡片组件
 * 用于展示各类卡片内容，提供统一的样式和动画效果
 */
export const Card = ({
  className,
  children,
  id = "1",
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) => {
  return (
    <motion.div
      layoutId={`card-container-${id}`}
      className={cn(
        "group/card relative overflow-hidden rounded-xl border border-neutral-200 bg-white transition duration-200 dark:border-neutral-800 dark:bg-neutral-950",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="p-5">{children}</div>
    </motion.div>
  );
};

/**
 * 卡片标题组件
 */
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
        "mb-2 text-base font-medium text-neutral-900 dark:text-neutral-100",
        className
      )}
    >
      {children}
    </h3>
  );
};

/**
 * 卡片描述组件
 */
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
        "line-clamp-3 text-sm font-normal text-neutral-500 dark:text-neutral-400",
        className
      )}
    >
      {children}
    </p>
  );
};

/**
 * 卡片骨架容器组件
 * 用于加载占位符和视觉效果
 */
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
        "relative mb-4 flex h-[160px] w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800",
        className
      )}
    >
      <div className="flex items-center justify-center w-full">
        {children}
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-neutral-50/30 to-neutral-50/30 dark:via-neutral-900/30 dark:to-neutral-900/30" />
      )}
    </div>
  );
};

/**
 * 渲染CDN图片的工具函数
 * 根据URL加载图片，如果失败则显示备用内容
 */
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