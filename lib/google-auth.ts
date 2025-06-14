/**
 * Google Authentication utilities
 * Handles Google Sign-In integration using Google Identity Services
 * Requires NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable
 */

// Google Identity Services declarations
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean; isDismissedMoment: () => boolean; }) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

// Google Client ID from environment variables
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Google User interface
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

// Google Auth Response interface
export interface GoogleAuthResponse {
  credential: string;
  select_by: string;
}

// Login request interface
export interface LoginRequest {
  google_id_token: string;
  invitationCode?: string;
}

// Login response interface
export interface LoginResponse {
  token: string;
  user: GoogleUser;
  message: string;
}

/**
 * 初始化Google认证服务
 * 加载Google Identity Services脚本并配置Client ID
 */
export const initializeGoogleAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google Auth can only be initialized in browser'));
      return;
    }

    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
      reject(new Error('Google Client ID not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env.local file'));
      return;
    }

    // 检查是否已经加载
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    // 动态加载Google Identity Services脚本
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      try {
        // 初始化Google Identity Services
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: () => {}, // 这里不设置全局回调，每个登录调用都会有自己的回调
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        resolve();
      } catch (error) {
        reject(new Error(`Failed to initialize Google Identity Services: ${error}`));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Identity Services script'));
    };
    
    document.head.appendChild(script);
  });
};

/**
 * 使用Google Identity Services进行登录
 * 获取Google ID Token并调用服务端API进行认证
 */
export const signInWithGoogle = (invitationCode: string | null = null): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google Sign-In can only be used in browser'));
      return;
    }

    if (!window.google?.accounts?.id) {
      reject(new Error('Google Identity Services not initialized. Please call initializeGoogleAuth() first.'));
      return;
    }

    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
      reject(new Error('Google Client ID not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env.local file'));
      return;
    }

    // 设置登录回调
    const handleCredentialResponse = async (response: GoogleAuthResponse) => {
      try {
        if (!response.credential) {
          throw new Error('No credential received from Google');
        }

        // 解析JWT token获取用户信息
        const userInfo = parseJWT(response.credential);
        
        // 调用服务端API进行认证
        const loginResult = await authenticateWithServer(response.credential, invitationCode);
        
        resolve({
          token: loginResult.token,
          user: loginResult.user || userInfo,
          message: loginResult.message,
        });
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to authenticate with Google'));
      }
    };

    // 重新初始化Google Identity Services以设置新的回调
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // 显示Google登录弹窗
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // 如果弹窗没有显示，可能是因为用户之前取消过
        // 这种情况下我们可以尝试使用按钮方式登录
        reject(new Error('Google sign-in popup was not displayed. Please try using the sign-in button.'));
      } else if (notification.isDismissedMoment()) {
        reject(new Error('Google sign-in was dismissed'));
      }
    });

    // 设置超时
    setTimeout(() => {
      reject(new Error('Google sign-in timeout'));
    }, 30000);
  });
};

/**
 * 解析JWT token获取用户信息
 */
const parseJWT = (token: string): GoogleUser => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    throw new Error('Failed to parse JWT token');
  }
};

/**
 * 调用服务端API进行Google认证
 */
export const authenticateWithServer = async (
  googleIdToken: string,
  invitationCode: string | null = null
): Promise<LoginResponse> => {
  try {
    // 使用统一的API管理系统
    const { API_ENDPOINTS, publicApi, tokenManager } = await import('./api');
    
    const requestBody: LoginRequest = {
      google_id_token: googleIdToken,
      invitation_code: invitationCode,
    };

    const response = await publicApi.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, requestBody);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Authentication failed');
    }

    const result = await response.json();
    
    // Save token after successful login
    if (result.access_token) {
      tokenManager.setToken(result.access_token);
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred during authentication');
  }
};

/**
 * 渲染Google登录按钮
 * 使用Google Identity Services的官方按钮渲染
 */
export const renderGoogleSignInButton = (
  element: HTMLElement,
  invitationCode: string | null = null,
  options: {
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: string;
    locale?: string;
    click_listener?: () => void;
  } = {}
): void => {
  if (typeof window === 'undefined') {
    console.warn('Google Sign-In button can only be rendered in browser');
    return;
  }

  if (!window.google?.accounts?.id) {
    console.error('Google Identity Services not initialized. Please call initializeGoogleAuth() first.');
    return;
  }

  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
    console.error('Google Client ID not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env.local file');
    return;
  }

  // 默认配置
  const config = {
    theme: options.theme || 'outline',
    size: options.size || 'large',
    text: options.text || 'signin_with',
    shape: options.shape || 'rectangular',
    logo_alignment: options.logo_alignment || 'left',
    width: options.width || '240',
    locale: options.locale || 'zh_CN',
    ...options
  };

  // 设置按钮点击回调
  const handleCredentialResponse = async (response: GoogleAuthResponse) => {
    try {
      if (config.click_listener) {
        config.click_listener();
        return;
      }

      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      // 解析JWT token获取用户信息
      const userInfo = parseJWT(response.credential);
      
      // 调用服务端API进行认证
      const loginResult = await authenticateWithServer(response.credential, invitationCode);
      
      // 触发自定义事件
      const event = new CustomEvent('googleSignInSuccess', {
        detail: {
          token: loginResult.token,
          user: loginResult.user || userInfo,
          message: loginResult.message,
        }
      });
      window.dispatchEvent(event);
    } catch (error) {
      // 触发错误事件
      const errorEvent = new CustomEvent('googleSignInError', {
        detail: { error: error instanceof Error ? error.message : 'Google sign-in failed' }
      });
      window.dispatchEvent(errorEvent);
    }
  };

  // 重新初始化Google Identity Services以设置新的回调
  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  // 清空容器
  element.innerHTML = '';

  // 渲染Google登录按钮
  window.google.accounts.id.renderButton(element, {
    theme: config.theme,
    size: config.size,
    text: config.text,
    shape: config.shape,
    logo_alignment: config.logo_alignment,
    width: config.width,
    locale: config.locale,
  });
};



/**
 * 检查Google Auth是否可用
 */
export const isGoogleAuthAvailable = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
    return false;
  }
  
  return true;
};

/**
 * 获取Google Auth不可用的原因
 */
export const getGoogleAuthUnavailableReason = (): string | null => {
  if (typeof window === 'undefined') {
    return 'Not running in browser environment';
  }
  
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
    return 'Google Client ID not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env.local file';
  }
  
  if (!window.google?.accounts?.id) {
    return 'Google Identity Services not loaded. Please call initializeGoogleAuth() first';
  }
  
  return null;
};

/**
 * 创建Google OAuth回调页面
 * 需要在 /auth/google/callback 路由中使用
 */
export const handleGoogleAuthCallback = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // 从URL hash中提取token信息
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    
    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');
    const error = params.get('error');
    
    if (error) {
      // 发送错误消息给父窗口
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_ERROR',
        error: error
      }, window.location.origin);
    } else if (accessToken && idToken) {
      // 发送成功消息给父窗口
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_SUCCESS',
        accessToken,
        idToken
      }, window.location.origin);
    } else {
      // 发送错误消息
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_ERROR',
        error: 'No tokens received from Google'
      }, window.location.origin);
    }
    
    // 关闭弹窗
    window.close();
  } catch (error) {
    console.error('Error handling Google auth callback:', error);
    window.opener?.postMessage({
      type: 'GOOGLE_AUTH_ERROR',
      error: 'Failed to process authentication callback'
    }, window.location.origin);
    window.close();
  }
};

// 简化版本不需要Google Identity Services的类型声明