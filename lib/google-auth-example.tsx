/**
 * Google Authentication 使用示例
 * 展示如何在React组件中使用Google登录功能
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  initializeGoogleAuth,
  signInWithGoogle,
  renderGoogleSignInButton,
  isGoogleAuthAvailable,
  type LoginResponse,
} from './google-auth';

interface GoogleAuthExampleProps {
  invitationCode?: string | null;
  onLoginSuccess?: (result: LoginResponse) => void;
  onLoginError?: (error: string) => void;
}

export const GoogleAuthExample: React.FC<GoogleAuthExampleProps> = ({
  invitationCode = null,
  onLoginSuccess,
  onLoginError,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化Google Auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeGoogleAuth();
        setIsInitialized(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Google Auth';
        setError(errorMessage);
        console.error('Google Auth initialization failed:', err);
      }
    };

    initAuth();
  }, []);

  // 渲染Google登录按钮
  useEffect(() => {
    if (isInitialized && buttonRef.current && isGoogleAuthAvailable()) {
      try {
        renderGoogleSignInButton(buttonRef.current, invitationCode, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to render Google button';
        setError(errorMessage);
        console.error('Failed to render Google button:', err);
      }
    }
  }, [isInitialized, invitationCode]);

  // 监听Google登录事件
  useEffect(() => {
    const handleSignInSuccess = (event: CustomEvent) => {
      const result = event.detail as LoginResponse;
      console.log('Google Sign-In Success:', result);
      
      // 保存token到localStorage或状态管理
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      onLoginSuccess?.(result);
      setIsLoading(false);
    };

    const handleSignInError = (event: CustomEvent) => {
      const errorMessage = event.detail.error as string;
      console.error('Google Sign-In Error:', errorMessage);
      setError(errorMessage);
      onLoginError?.(errorMessage);
      setIsLoading(false);
    };

    window.addEventListener('googleSignInSuccess', handleSignInSuccess as EventListener);
    window.addEventListener('googleSignInError', handleSignInError as EventListener);

    return () => {
      window.removeEventListener('googleSignInSuccess', handleSignInSuccess as EventListener);
      window.removeEventListener('googleSignInError', handleSignInError as EventListener);
    };
  }, [onLoginSuccess, onLoginError]);

  // 手动触发登录（使用弹窗方式）
  const handleManualSignIn = async () => {
    if (!isGoogleAuthAvailable()) {
      setError('Google Auth is not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signInWithGoogle(invitationCode);
      console.log('Manual Sign-In Success:', result);
      
      // 保存token到localStorage或状态管理
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      onLoginSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      onLoginError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized && !error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Initializing Google Auth...</span>
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
          <span className="text-red-700 font-medium">Error:</span>
        </div>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Google登录按钮容器 */}
      <div className="flex flex-col items-center space-y-4">
        <div ref={buttonRef} className="w-full max-w-sm" />
        
        {/* 或者使用手动触发的按钮 */}
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-2">或者</div>
          <button
            onClick={handleManualSignIn}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                登录中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                使用弹窗登录
              </>
            )}
          </button>
        </div>
      </div>

      {/* 邀请码提示 */}
      {invitationCode && (
        <div className="text-sm text-gray-600 text-center">
          使用邀请码: <code className="bg-gray-100 px-2 py-1 rounded">{invitationCode}</code>
        </div>
      )}
    </div>
  );
};

// 使用示例
export const GoogleAuthUsageExample = () => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleLoginSuccess = (result: LoginResponse) => {
    setUser(result.user);
    setToken(result.token);
    alert(`登录成功！欢迎 ${result.user.name}`);
  };

  const handleLoginError = (error: string) => {
    alert(`登录失败: ${error}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  // 检查是否已登录
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (user && token) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <img
            src={user.picture || '/default-avatar.png'}
            alt={user.name}
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            欢迎, {user.name}!
          </h2>
          <p className="text-gray-600 mb-4">{user.email}</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            退出登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Google 登录示例
      </h2>
      <GoogleAuthExample
        invitationCode={null} // 或者传入实际的邀请码
        onLoginSuccess={handleLoginSuccess}
        onLoginError={handleLoginError}
      />
    </div>
  );
};