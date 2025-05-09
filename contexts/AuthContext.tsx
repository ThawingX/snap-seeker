"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import AuthModal from "@/components/auth/AuthModal";

// 定义上下文类型
interface AuthContextType {
  isAuthenticated: boolean;
  showAuthModal: (mode?: "login" | "signup") => void;
  hideAuthModal: () => void;
  logout: () => void;
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 提供一个钩子来使用上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// 身份验证提供者组件
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 认证状态
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 模态框状态
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

  // 显示认证模态框
  const showAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // 隐藏认证模态框
  const hideAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // 退出登录
  const logout = () => {
    setIsAuthenticated(false);
    // 这里可以添加其他注销逻辑
  };

  // 提供上下文值
  const value = {
    isAuthenticated,
    showAuthModal,
    hideAuthModal,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={hideAuthModal} 
        initialMode={authModalMode} 
      />
    </AuthContext.Provider>
  );
}; 