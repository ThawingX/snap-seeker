"use client";
import React from "react";
import { cn } from "@/lib/utils";

/**
 * 按钮底部渐变效果组件
 * 用于在按钮悬停时显示底部渐变效果，增强用户交互体验
 */
export const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

/**
 * 标签和输入框容器组件
 * 用于统一表单字段的布局和样式
 */
export const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

/**
 * 主要按钮组件
 * 统一的主要操作按钮，包含渐变背景和悬停效果
 */
export const PrimaryButton = ({
  children,
  type = "button",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-cyan-500 to-cyan-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:from-cyan-600 dark:to-cyan-700",
        className
      )}
      type={type}
      {...props}
    >
      {children}
      <BottomGradient />
    </button>
  );
};

/**
 * 社交登录按钮组件
 * 用于第三方登录选项，统一样式和交互
 */
export const SocialButton = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]",
        className
      )}
      type="button"
      {...props}
    >
      {children}
      <BottomGradient />
    </button>
  );
}; 