"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  IconBrandGoogle,
} from "@tabler/icons-react";
import { 
  LabelInputContainer, 
  BottomGradient, 
  PrimaryButton, 
  SocialButton 
} from "@/components/ui/form-utils";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { initializeGoogleAuth, signInWithGoogle, isGoogleAuthAvailable, getGoogleAuthUnavailableReason } from "@/lib/google-auth";
import type { LoginResponse } from "@/lib/google-auth";

/**
 * 登录表单组件
 * 用户登录界面，包含邮箱密码登录和第三方登录选项
 */
export default function LoginForm() {
  const { showToast } = useToast();
  const { login, loginGoogle, loading } = useAuth();
  const [isGoogleAuthReady, setIsGoogleAuthReady] = useState(false);
  
  // 表单状态
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // 初始化Google认证
  useEffect(() => {
    const initGoogleAuth = async () => {
      try {
        await initializeGoogleAuth();
        setIsGoogleAuthReady(true);
      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
      }
    };

    initGoogleAuth();
  }, []);

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
    
    if (!formData.email || !formData.password) {
      showToast({
        message: "Please fill in all required fields",
        type: "error",
        duration: 3000
      });
      return;
    }

    try {
      await login({
        username: formData.email, // API expects username field
        password: formData.password
      });
      
      showToast({
        message: "Login successful!",
        type: "success",
        duration: 3000
      });
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : "Login failed",
        type: "error",
        duration: 5000
      });
    }
  };

  /**
   * 处理Google登录
   */
  const handleGoogleLogin = async () => {
    try {
      if (!isGoogleAuthReady || !isGoogleAuthAvailable()) {
        const reason = getGoogleAuthUnavailableReason();
        showToast({
          message: reason || "Google authentication is not available",
          type: "error",
          duration: 8000
        });
        return;
      }

      // 使用Google Sign-In
      const result: LoginResponse = await signInWithGoogle();
      
      // 调用AuthContext的loginGoogle方法
      await loginGoogle({
        google_id_token: result.token,
        invitation_code: null
      });

      showToast({
        message: `Welcome back, ${result.user.name}!`,
        type: "success",
        duration: 3000
      });
    } catch (error) {
      console.error('Google login error:', error);
      showToast({
        message: error instanceof Error ? error.message : "Google login failed",
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
      handleGoogleLogin();
    } else {
      showToast({
        message: `${provider} login is not implemented yet. Please check back later.`,
        type: "info",
        duration: 5000
      });
    }
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
        <LabelInputContainer className="mb-8">
          <Label htmlFor="password">Password</Label>
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

        {/* 记住我和忘记密码 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              disabled={loading}
              className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>
        </div>

        {/* 登录按钮 */}
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"} &rarr;
        </PrimaryButton>

        {/* 分隔线 */}
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        {/* 第三方登录选项 */}
        <div className="flex flex-col space-y-4">
          <SocialButton onClick={() => handleSocialLogin("Google")}>
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