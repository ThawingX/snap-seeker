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
import { rememberMeManager } from "@/lib/api";

/**
 * 登录表单组件
 * 用户登录界面，包含邮箱密码登录和第三方登录选项
 */
export default function LoginForm() {
  const { showToast } = useToast();
  const { login, loginGoogle, loading } = useAuth();
  const [isGoogleAuthReady, setIsGoogleAuthReady] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  // 表单状态
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // 初始化Google认证和恢复remember me状态
  useEffect(() => {
    const initGoogleAuth = async () => {
      try {
        await initializeGoogleAuth();
        setIsGoogleAuthReady(true);
      } catch (error) {
        // 静默处理Google认证初始化失败
      }
    };

    // 恢复保存的账号密码
    const restoreSavedCredentials = () => {
      const savedCredentials = rememberMeManager.getSavedCredentials();
      if (savedCredentials) {
        setFormData(prev => ({
          ...prev,
          email: savedCredentials.email,
          password: savedCredentials.password,
          rememberMe: true
        }));
      }
    };

    initGoogleAuth();
    restoreSavedCredentials();
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
      
      // 处理 remember me 功能
      if (formData.rememberMe) {
        // 保存账号密码到 localStorage
        rememberMeManager.saveCredentials(formData.email, formData.password);
      } else {
        // 清除保存的账号密码
        rememberMeManager.clearCredentials();
      }
      
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
          message: reason || "Login service temporarily unavailable, please try again later",
          type: "error",
          duration: 8000
        });
        return;
      }

      setIsGoogleLoading(true);

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
      // 不显示技术性错误信息给用户
      showToast({
        message: "Login failed, please try again",
        type: "error",
        duration: 5000
      });
    } finally {
      setIsGoogleLoading(false);
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
    <div className="glass-card mx-auto w-full max-w-md rounded-none rounded-b-xl p-4 md:p-8 transition-glass">
      <h2 className="text-xl font-bold text-foreground">
        Welcome Back
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
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
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-foreground"
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
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* 第三方登录选项 */}
        <div className="flex flex-col space-y-4">
          <SocialButton 
            onClick={() => handleSocialLogin("Google")}
            disabled={isGoogleLoading || loading}
          >
            {isGoogleLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                <span className="text-sm text-foreground">
                  Connecting to Google...
                </span>
              </>
            ) : (
              <>
                <IconBrandGoogle className="h-4 w-4 text-foreground" />
                <span className="text-sm text-foreground">
                  Login with Google
                </span>
              </>
            )}
          </SocialButton>
        </div>
      </form>
    </div>
  );
}