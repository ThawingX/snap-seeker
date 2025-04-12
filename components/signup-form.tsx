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
  PrimaryButton, 
  SocialButton 
} from "@/components/ui/form-utils";

/**
 * 注册表单组件
 * 用户注册界面，包含基本信息输入和第三方注册选项
 */
export default function SignupForm() {
  /**
   * 处理表单提交
   * @param e 表单提交事件
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  
  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none rounded-b-xl bg-white p-4 md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Create an Account
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Sign up to get started with SnapSeeker
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* 姓名输入区域 */}
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" placeholder="Tyler" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Durden" type="text" />
          </LabelInputContainer>
        </div>
        
        {/* 邮箱输入区域 */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="your.email@example.com" type="email" />
        </LabelInputContainer>
        
        {/* 密码输入区域 */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>
        
        {/* 确认密码输入区域 */}
        <LabelInputContainer className="mb-8">
          <Label htmlFor="confirmpassword">Confirm Password</Label>
          <Input
            id="confirmpassword"
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>

        {/* 服务条款同意选项 */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="terms"
            className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
          />
          <label
            htmlFor="terms"
            className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
          >
            I agree to the <a href="#" className="text-cyan-500 hover:text-cyan-400">Terms of Service</a> and <a href="#" className="text-cyan-500 hover:text-cyan-400">Privacy Policy</a>
          </label>
        </div>

        {/* 注册按钮 */}
        <PrimaryButton type="submit">
          Sign up &rarr;
        </PrimaryButton>

        {/* 分隔线 */}
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        {/* 第三方注册选项 */}
        <div className="flex flex-col space-y-4">
          <SocialButton>
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Continue with GitHub
            </span>
          </SocialButton>
          
          <SocialButton>
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Continue with Google
            </span>
          </SocialButton>
        </div>
      </form>
    </div>
  );
} 