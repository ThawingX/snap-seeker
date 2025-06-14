"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";
import { 
  isAuthenticated as checkAuthStatus, 
  removeToken, 
  storeToken,
  loginWithPassword,
  loginWithGoogle,
  registerUser,
  logoutUser,
  type LoginRequest,
  type GoogleLoginRequest,
  type RegisterRequest
} from "@/lib/auth-api";
import { setGlobalAuthErrorHandler } from "@/lib/api";

// 定义用户信息类型
interface User {
  id: string;
  email: string;
  name?: string;
}

// 定义上下文类型
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  showAuthModal: (mode?: "login" | "signup") => void;
  hideAuthModal: () => void;
  login: (data: LoginRequest) => Promise<void>;
  loginGoogle: (data: GoogleLoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
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
  const router = useRouter();
  
  // 认证状态
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 模态框状态
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

  // 初始化时检查认证状态
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = checkAuthStatus();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };
    
    checkAuth();
    
    // 设置全局认证错误处理器
    setGlobalAuthErrorHandler(() => {
      // 清除认证状态
      setIsAuthenticated(false);
      setUser(null);
      // 显示登录模态框
      showAuthModal("login");
    });
  }, []);

  // 显示认证模态框
  const showAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // 隐藏认证模态框
  const hideAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // 处理登录成功后的待处理搜索
  const handlePendingSearch = () => {
    try {
      const pendingSearchData = sessionStorage.getItem('pendingSearch');
      if (pendingSearchData) {
        const { query, timestamp } = JSON.parse(pendingSearchData);
        
        // 检查数据是否过期（30分钟）
        const now = Date.now();
        const maxAge = 30 * 60 * 1000; // 30分钟
        
        if (now - timestamp < maxAge && query) {
          // 清除待处理的搜索数据
          sessionStorage.removeItem('pendingSearch');
          
          // 生成临时ID并执行搜索
          const tempId = crypto.randomUUID();
          
          // 跳转到搜索结果页面，通过URL参数传递查询和ID
          router.push(`/results?id=${tempId}&query=${encodeURIComponent(query)}&isNew=true`);
        } else {
          // 数据过期，清除
          sessionStorage.removeItem('pendingSearch');
        }
      }
    } catch (error) {
      console.error('Error handling pending search:', error);
      sessionStorage.removeItem('pendingSearch');
    }
  };

  // 邮箱密码登录
  const login = async (data: LoginRequest) => {
    setLoading(true);
    try {
      const response = await loginWithPassword(data);
      storeToken(response.access_token);
      setIsAuthenticated(true);
      if (response.user) {
        setUser(response.user);
      }
      hideAuthModal();
      
      // 处理待处理的搜索
      handlePendingSearch();
    } catch (error) {
      throw error; // 让调用者处理错误
    } finally {
      setLoading(false);
    }
  };

  // Google登录
  const loginGoogle = async (data: GoogleLoginRequest) => {
    setLoading(true);
    try {
      const response = await loginWithGoogle(data);
      storeToken(response.access_token);
      setIsAuthenticated(true);
      if (response.user) {
        setUser(response.user);
      }
      hideAuthModal();
      
      // 处理待处理的搜索
      handlePendingSearch();
    } catch (error) {
      throw error; // 让调用者处理错误
    } finally {
      setLoading(false);
    }
  };

  // 注册
  const register = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      const response = await registerUser(data);
      storeToken(response.access_token);
      setIsAuthenticated(true);
      if (response.user) {
        setUser(response.user);
      }
      hideAuthModal();
      
      // 处理待处理的搜索
      handlePendingSearch();
    } catch (error) {
      throw error; // 让调用者处理错误
    } finally {
      setLoading(false);
    }
  };

  // 退出登录
  const logout = async () => {
    try {
      await logoutUser();
      // API调用成功后更新状态
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      // 即使API调用失败，也清除本地状态
      console.error('Logout API failed:', error);
      removeToken();
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // 提供上下文值
  const value = {
    isAuthenticated,
    user,
    showAuthModal,
    hideAuthModal,
    login,
    loginGoogle,
    register,
    logout,
    loading,
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