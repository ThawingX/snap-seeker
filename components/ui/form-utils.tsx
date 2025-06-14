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
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-primary to-transparent" />
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
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
 * 统一的主要操作按钮，包含毛玻璃效果和渐变背景
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
        "group/btn relative block h-10 w-full rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed",
        "bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 hover:border-primary/40",
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
 * Sign Up 专用按钮组件
 * 具有区别于背景的特殊颜色和毛玻璃效果
 */
export const SignUpButton = ({
  children,
  type = "button",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "group/btn relative block h-12 w-full rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed",
        "bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 hover:border-primary/40",
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
 * 用于第三方登录选项，统一样式和交互，采用毛玻璃效果
 */
export const SocialButton = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "group/btn relative flex h-10 w-full items-center justify-center space-x-2 rounded-lg glass-card transition-glass px-4 font-medium text-secondary-foreground hover:shadow-lg border-2 border-border/50 hover:border-primary/50",
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