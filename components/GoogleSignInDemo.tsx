'use client';

import React, { useEffect, useState } from 'react';
import { 
  initializeGoogleAuth, 
  renderGoogleSignInButton, 
  isGoogleAuthAvailable,
  getGoogleAuthUnavailableReason,
  type LoginResponse 
} from '../lib/google-auth';

interface GoogleSignInDemoProps {
  invitationCode?: string;
  onSuccess?: (result: LoginResponse) => void;
  onError?: (error: string) => void;
}

export default function GoogleSignInDemo({ 
  invitationCode, 
  onSuccess, 
  onError 
}: GoogleSignInDemoProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 检查Google Auth是否可用
        if (!isGoogleAuthAvailable()) {
          const reason = getGoogleAuthUnavailableReason();
          throw new Error(reason || 'Google Auth not available');
        }
        
        // 初始化Google认证
        await initializeGoogleAuth();
        setIsInitialized(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Google Auth';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [onError]);

  useEffect(() => {
    if (!isInitialized) return;

    // 监听Google登录成功事件
    const handleSuccess = (event: CustomEvent) => {
      const result = event.detail as LoginResponse;
      setUser(result.user);
      onSuccess?.(result);
    };

    // 监听Google登录失败事件
    const handleError = (event: CustomEvent) => {
      const errorMessage = event.detail.error;
      setError(errorMessage);
      onError?.(errorMessage);
    };

    window.addEventListener('googleSignInSuccess', handleSuccess as EventListener);
    window.addEventListener('googleSignInError', handleError as EventListener);

    return () => {
      window.removeEventListener('googleSignInSuccess', handleSuccess as EventListener);
      window.removeEventListener('googleSignInError', handleError as EventListener);
    };
  }, [isInitialized, onSuccess, onError]);

  useEffect(() => {
    if (!isInitialized) return;

    // 渲染Google登录按钮
    const buttonContainer = document.getElementById('google-signin-button');
    if (buttonContainer) {
      renderGoogleSignInButton(buttonContainer, null, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        width: '300',
        locale: 'zh_CN',
      });
    }
  }, [isInitialized]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">正在初始化Google登录...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <h3 className="text-red-800 font-medium">Google登录初始化失败</h3>
        </div>
        <p className="text-red-700 mt-1 text-sm">{error}</p>
        {error.includes('Client ID') && (
          <div className="mt-2 text-sm text-red-600">
            <p>请按以下步骤配置Google Client ID：</p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>访问 <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
              <li>创建或选择项目</li>
              <li>启用 Google Identity Services API</li>
              <li>创建OAuth 2.0客户端ID</li>
              <li>在.env.local文件中设置NEXT_PUBLIC_GOOGLE_CLIENT_ID</li>
            </ol>
          </div>
        )}
      </div>
    );
  }

  if (user) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          {user.picture && (
            <img 
              src={user.picture} 
              alt={user.name} 
              className="w-10 h-10 rounded-full mr-3"
            />
          )}
          <div>
            <h3 className="text-green-800 font-medium">登录成功</h3>
            <p className="text-green-700 text-sm">欢迎，{user.name}！</p>
            <p className="text-green-600 text-xs">{user.email}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Google登录</h2>
        <p className="text-gray-600 text-sm mb-4">
          点击下方按钮使用Google账户登录
        </p>
      </div>
      
      <div className="flex justify-center">
        <div id="google-signin-button"></div>
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        使用Google Identity Services进行安全登录
      </div>
    </div>
  );
}