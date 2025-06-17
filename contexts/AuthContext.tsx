"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";
import ActivationModal from "@/components/auth/ActivationModal";
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
import { tokenManager } from "@/lib/api";
import { getUserInfo, type UserInfoResponse } from "@/lib/user-api";
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
  isActivated: boolean;
  showAuthModal: (mode?: "login" | "signup") => void;
  hideAuthModal: () => void;
  login: (data: LoginRequest) => Promise<void>;
  loginGoogle: (data: GoogleLoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkUserActivation: () => Promise<void>;
  handleActivationSuccess: () => void;
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
  const [isActivated, setIsActivated] = useState(true); // 默认为true，避免未登录时显示激活弹窗
  const [loading, setLoading] = useState(true);
  
  // 模态框状态
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);

  // 检查用户激活状态
  const checkUserActivation = async () => {
    // 如果没有token，直接返回
    const token = tokenManager.getToken();
    if (!token) {
      setIsAuthenticated(false);
      setIsActivated(true); // 未登录时不需要检查激活状态
      return;
    }

    try {
      // 调用user-info接口验证token有效性并获取激活状态
      const userInfo = await getUserInfo();
      
      // token有效，设置认证状态
      setIsAuthenticated(true);
      setIsActivated(userInfo.isActive);
      
      // 如果用户未激活，显示激活模态框
      if (!userInfo.isActive) {
        setIsActivationModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to check user activation status:', error);
      // 如果获取用户信息失败（可能token无效），清除认证状态
      setIsAuthenticated(false);
      setIsActivated(true);
      // 清除无效token
      tokenManager.removeToken();
    }
  };

  // 处理激活成功
  const handleActivationSuccess = () => {
    setIsActivated(true);
    setIsActivationModalOpen(false);
  };

  // 初始化时检查认证状态
  useEffect(() => {
    const checkAuth = async () => {
      // 直接调用checkUserActivation，它会验证token有效性并设置认证状态
      await checkUserActivation();
      setLoading(false);
    };
    
    checkAuth();
    
    // 设置全局认证错误处理器
    setGlobalAuthErrorHandler(() => {
      // 清除认证状态
      setIsAuthenticated(false);
      setUser(null);
      setIsActivated(true); // 重置激活状态
      setIsActivationModalOpen(false); // 关闭激活弹窗
      // 显示登录模态框
      showAuthModal("login");
    });
  }, []);

  // 当认证状态变化时，检查激活状态
  useEffect(() => {
    if (isAuthenticated) {
      checkUserActivation();
    } else {
      setIsActivated(true);
      setIsActivationModalOpen(false);
    }
  }, [isAuthenticated]);

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
          
          // 将查询存储到sessionStorage中
          sessionStorage.setItem('currentSearch', JSON.stringify({
            query: query,
            timestamp: Date.now()
          }));
          
          // 跳转到搜索结果页面
          router.push(`/results?id=${tempId}&isNew=true`);
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
      
      // 检查激活状态
      await checkUserActivation();
      
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
      
      // 检查激活状态
      await checkUserActivation();
      
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
      
      // 检查激活状态
      await checkUserActivation();
      
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
      setIsActivated(true);
      setIsActivationModalOpen(false);
    } catch (error) {
      // 即使API调用失败，也清除本地状态
      console.error('Logout API failed:', error);
      removeToken();
      setIsAuthenticated(false);
      setUser(null);
      setIsActivated(true);
      setIsActivationModalOpen(false);
    }
  };

  // 提供上下文值
  const value = {
    isAuthenticated,
    user,
    isActivated,
    showAuthModal,
    hideAuthModal,
    login,
    loginGoogle,
    register,
    logout,
    checkUserActivation,
    handleActivationSuccess,
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
      <ActivationModal
        isOpen={isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
        onActivationSuccess={handleActivationSuccess}
      />
    </AuthContext.Provider>
  );
};