"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  IconBrandGoogle,
} from "@tabler/icons-react";
import { 
  LabelInputContainer, 
  PrimaryButton, 
  SocialButton,
  SignUpButton 
} from "@/components/ui/form-utils";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { initializeGoogleAuth, signInWithGoogle, isGoogleAuthAvailable, getGoogleAuthUnavailableReason } from "@/lib/google-auth";
import type { LoginResponse } from "@/lib/google-auth";
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

/**
 * 注册表单组件
 * 用户注册界面，包含基本信息输入和第三方注册选项
 */
export default function SignupForm() {
  const { showToast } = useToast();
  const { register, loginGoogle, loading } = useAuth();
  const [isGoogleAuthReady, setIsGoogleAuthReady] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  // 表单状态
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    invitationCode: '',
    agreeToTerms: false
  });

  // 初始化Google认证
  useEffect(() => {
    const initGoogleAuth = async () => {
      try {
        await initializeGoogleAuth();
        setIsGoogleAuthReady(true);
      } catch (error) {
        // 静默处理Google认证初始化失败
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
      // 触发GTM埋点事件 - Google注册按钮点击
      trackEvent(ANALYTICS_EVENTS.GOOGLE_LOGIN, {
        action: 'click',
        method: 'google',
        page: 'signup'
      });

      if (!isGoogleAuthReady || !isGoogleAuthAvailable()) {
        const reason = getGoogleAuthUnavailableReason();
        showToast({
          message: reason || "Registration service temporarily unavailable, please try again later",
          type: "error",
          duration: 8000
        });
        return;
      }

      setIsGoogleLoading(true);

      // 使用Google Sign-In，传入邀请码
      const result: LoginResponse = await signInWithGoogle(formData.invitationCode || null);
      
      // 调用AuthContext的loginGoogle方法（注册和登录使用同一个接口）
      await loginGoogle({
        google_id_token: result.token,
        invitation_code: formData.invitationCode || null
      });

      showToast({
        message: `Welcome, ${result.user.name}! Your account has been created.`,
        type: "success",
        duration: 3000
      });
    } catch (error) {
      // 不显示技术性错误信息给用户
      showToast({
        message: "Registration failed, please try again",
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
    <div className="glass-card mx-auto w-full max-w-md rounded-none rounded-b-xl p-4 md:p-8 transition-glass">
      <h2 className="text-xl font-bold text-foreground">
        Create an Account
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Sign up to get started with SnapSeeker
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
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
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            required
          />
          <label
            htmlFor="terms"
            className="ml-2 block text-sm text-foreground"
          >
            I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">Privacy Policy</a> *
          </label>
        </div>

        {/* 注册按钮 */}
        <SignUpButton type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"} &rarr;
        </SignUpButton>

        {/* 分隔线 */}
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* 第三方注册选项 */}
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
                  Continue with Google
                </span>
              </>
            )}
          </SocialButton>
        </div>
      </form>
    </div>
  );
}