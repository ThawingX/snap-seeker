"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { 
  LabelInputContainer, 
  BottomGradient, 
  PrimaryButton, 
  SocialButton 
} from "@/components/ui/form-utils";

/**
 * 登录表单组件
 * 用户登录界面，包含邮箱密码登录和第三方登录选项
 */
export default function LoginForm() {
  /**
   * 处理表单提交
   * @param e 表单提交事件
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login form submitted");
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none rounded-b-xl bg-white p-4 md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome Back
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Login to your SnapSeeker account to continue
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* 邮箱输入区域 */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="your.email@example.com" type="email" />
        </LabelInputContainer>
        
        {/* 密码输入区域 */}
        <LabelInputContainer className="mb-8">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>

        {/* 记住我和忘记密码 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="text-cyan-500 hover:text-cyan-400">
              Forgot your password?
            </a>
          </div>
        </div>

        {/* 登录按钮 */}
        <PrimaryButton type="submit">
          Log in &rarr;
        </PrimaryButton>

        {/* 分隔线 */}
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        {/* 第三方登录选项 */}
        <div className="flex flex-col space-y-4">
          <SocialButton>
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Login with GitHub
            </span>
          </SocialButton>
          
          <SocialButton>
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Login with Google
            </span>
          </SocialButton>
        </div>
      </form>
    </div>
  );
} 