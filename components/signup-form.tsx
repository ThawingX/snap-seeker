"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  IconBrandGoogle,
} from "@tabler/icons-react";
import { 
  LabelInputContainer, 
  PrimaryButton, 
  SocialButton 
} from "@/components/ui/form-utils";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";

/**
 * 注册表单组件
 * 用户注册界面，包含基本信息输入和第三方注册选项
 */
export default function SignupForm() {
  const { showToast } = useToast();
  const { register, loading } = useAuth();
  
  // 表单状态
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    invitationCode: '',
    agreeToTerms: false
  });

  /**
   * 处理输入变化
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  /**
   * 处理表单提交
   * @param e 表单提交事件
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.invitationCode) {
      showToast({
        message: "Please fill in all required fields",
        type: "error",
        duration: 3000
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast({
        message: "Passwords do not match",
        type: "error",
        duration: 3000
      });
      return;
    }

    if (!formData.agreeToTerms) {
      showToast({
        message: "Please agree to the Terms of Service and Privacy Policy",
        type: "error",
        duration: 3000
      });
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        invitation_code: formData.invitationCode
      });
      
      showToast({
        message: "Registration successful! Welcome to SnapSeeker!",
        type: "success",
        duration: 3000
      });
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : "Registration failed",
        type: "error",
        duration: 5000
      });
    }
  };

  /**
   * 处理Google注册
   */
  const handleGoogleSignup = async () => {
    try {
      // 这里需要集成Google Sign-In SDK
      // 暂时显示提示信息
      showToast({
        message: "Google signup integration is in progress. Please use email signup for now.",
        type: "info",
        duration: 5000
      });
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : "Google signup failed",
        type: "error",
        duration: 5000
      });
    }
  };

  /**
   * 处理社交登录
   */
  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      handleGoogleSignup();
    } else {
      showToast({
        message: `${provider} sign up is not implemented yet. Please check back later.`,
        type: "info",
        duration: 5000
      });
    }
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
            <Input 
              id="firstname" 
              name="firstName"
              placeholder="Tyler" 
              type="text" 
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={loading}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input 
              id="lastname" 
              name="lastName"
              placeholder="Durden" 
              type="text" 
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={loading}
            />
          </LabelInputContainer>
        </div>
        
        {/* 邮箱输入区域 */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address *</Label>
          <Input 
            id="email" 
            name="email"
            placeholder="your.email@example.com" 
            type="email" 
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </LabelInputContainer>
        
        {/* 密码输入区域 */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password *</Label>
          <Input 
            id="password" 
            name="password"
            placeholder="••••••••" 
            type="password" 
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </LabelInputContainer>
        
        {/* 确认密码输入区域 */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="confirmpassword">Confirm Password *</Label>
          <Input
            id="confirmpassword"
            name="confirmPassword"
            placeholder="••••••••"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </LabelInputContainer>

        {/* 邀请码输入区域 */}
        <LabelInputContainer className="mb-8">
          <Label htmlFor="invitationcode">Invitation Code *</Label>
          <Input
            id="invitationcode"
            name="invitationCode"
            placeholder="Enter your invitation code"
            type="text"
            value={formData.invitationCode}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </LabelInputContainer>

        {/* 服务条款同意选项 */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="terms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            disabled={loading}
            className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
            required
          />
          <label
            htmlFor="terms"
            className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
          >
            I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-400">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-400">Privacy Policy</a> *
          </label>
        </div>

        {/* 注册按钮 */}
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"} &rarr;
        </PrimaryButton>

        {/* 分隔线 */}
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        {/* 第三方注册选项 */}
        <div className="flex flex-col space-y-4">
          <SocialButton onClick={() => handleSocialLogin("Google")}>
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