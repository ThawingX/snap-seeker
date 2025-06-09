/**
 * Google Authentication utilities
 * Handles Google Sign-In integration
 */

// Google Client ID - 需要在环境变量中配置
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

/**
 * Google用户信息接口
 */
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

/**
 * Google登录响应接口
 */
export interface GoogleAuthResponse {
  credential: string; // JWT token from Google
  user: GoogleUser;
}

/**
 * 服务端登录请求接口
 */
export interface LoginRequest {
  google_id_token: string;
  invitation_code: string | null;
}

/**
 * 服务端登录响应接口
 */
export interface LoginResponse {
  token: string;
  user: GoogleUser;
  message?: string;
}

/**
 * 初始化Google Sign-In
 * 需要在应用启动时调用
 */
export const initializeGoogleAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google Auth can only be initialized in browser'));
      return;
    }

    if (!GOOGLE_CLIENT_ID) {
      reject(new Error('Google Client ID is not configured'));
      return;
    }

    // 检查Google Identity Services是否已加载
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: () => {}, // 这里会在实际使用时设置
        use_fedcm_for_prompt: false, // 禁用FedCM以避免CORS和网络错误
      });
      resolve();
    } else {
      // 动态加载Google Identity Services
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: () => {}, // 这里会在实际使用时设置
            use_fedcm_for_prompt: false, // 禁用FedCM以避免CORS和网络错误
          });
          resolve();
        } else {
          reject(new Error('Failed to load Google Identity Services'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services script'));
      };
      
      document.head.appendChild(script);
    }
  });
};

/**
 * 触发Google登录弹窗并完成服务端认证
 */
export const signInWithGoogle = (invitationCode: string | null = null): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google Sign-In can only be used in browser'));
      return;
    }

    if (!window.google?.accounts?.id) {
      reject(new Error('Google Identity Services not initialized'));
      return;
    }

    let isResolved = false;
    const timeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        reject(new Error('Google Sign-In timeout. Please try again.'));
      }
    }, 30000); // 30 second timeout

    // 设置回调函数
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        if (isResolved) return;
        
        try {
          clearTimeout(timeout);
          isResolved = true;
          
          // 解析JWT token获取用户信息
          const payload = parseJWT(response.credential);
          const user: GoogleUser = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
          };
          
          // 调用服务端API进行认证
          const loginResult = await authenticateWithServer(response.credential, invitationCode);
          
          resolve({
            token: loginResult.token,
            user: loginResult.user || user,
            message: loginResult.message,
          });
        } catch (error) {
          if (!isResolved) {
            isResolved = true;
            clearTimeout(timeout);
            reject(error instanceof Error ? error : new Error('Failed to authenticate with Google'));
          }
        }
      },
      cancel_on_tap_outside: false,
      auto_select: false,
      use_fedcm_for_prompt: false, // 禁用FedCM以避免CORS和网络错误
    });

    // 显示登录弹窗
    try {
      window.google.accounts.id.prompt((notification: any) => {
        if (isResolved) return;
        
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // 如果弹窗没有显示，提供手动触发选项
          console.warn('Google Sign-In prompt not displayed:', notification.getNotDisplayedReason());
          if (!isResolved) {
            clearTimeout(timeout);
            isResolved = true;
            reject(new Error('Google Sign-In popup was blocked or not displayed. Please check your popup blocker settings.'));
          }
        }
      });
    } catch (error) {
      if (!isResolved) {
        clearTimeout(timeout);
        isResolved = true;
        reject(new Error('Failed to show Google Sign-In prompt. Please try again.'));
      }
    }
  });
};

/**
 * 调用服务端API进行Google认证
 */
export const authenticateWithServer = async (
  googleIdToken: string,
  invitationCode: string | null = null
): Promise<LoginResponse> => {
  try {
    // 使用正确的API基础URL
    const API_BASE_URL = 'https://api.snapsnap.site';
    
    const requestBody: LoginRequest = {
      google_id_token: googleIdToken,
      invitation_code: invitationCode,
    };

    const response = await fetch(`${API_BASE_URL}/auth/login/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        errorData.error || 
        `Authentication failed: ${response.status} ${response.statusText}`
      );
    }

    const data: LoginResponse = await response.json();
    
    // 验证响应数据
    if (!data.token) {
      throw new Error('Invalid response: missing token');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred during authentication');
  }
};

/**
 * 渲染Google登录按钮
 */
export const renderGoogleSignInButton = (
  element: HTMLElement,
  invitationCode: string | null = null,
  options: {
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    type?: 'standard' | 'icon';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    logo_alignment?: 'left' | 'center';
    width?: string;
    locale?: string;
  } = {}
): void => {
  if (typeof window === 'undefined') {
    throw new Error('Google Sign-In button can only be rendered in browser');
  }

  if (!window.google?.accounts?.id) {
    throw new Error('Google Identity Services not initialized');
  }

  // 设置默认选项
  const defaultOptions = {
    theme: 'outline' as const,
    size: 'large' as const,
    type: 'standard' as const,
    shape: 'rectangular' as const,
    text: 'signin_with' as const,
    logo_alignment: 'left' as const,
    width: '100%',
    locale: 'en',
  };

  const buttonOptions = { ...defaultOptions, ...options };

  // 初始化Google Identity Services
  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: async (response: any) => {
      try {
        // 解析JWT token获取用户信息
        const payload = parseJWT(response.credential);
        const user: GoogleUser = {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
        };
        
        // 调用服务端API进行认证
        const loginResult = await authenticateWithServer(response.credential, invitationCode);
        
        // 触发成功事件
        const successEvent = new CustomEvent('googleSignInSuccess', {
          detail: {
            token: loginResult.token,
            user: loginResult.user || user,
            message: loginResult.message,
          },
        });
        window.dispatchEvent(successEvent);
      } catch (error) {
        console.error('Google Sign-In error:', error);
        // 触发错误事件
        const errorEvent = new CustomEvent('googleSignInError', {
          detail: {
            error: error instanceof Error ? error.message : 'Google sign-in failed',
            originalError: error,
          },
        });
        window.dispatchEvent(errorEvent);
      }
    },
    cancel_on_tap_outside: false,
    auto_select: false,
    use_fedcm_for_prompt: false, // Disable FedCM to avoid abort errors
  });

  // 渲染按钮
  try {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.renderButton(element, buttonOptions);
    }
  } catch (error) {
    console.error('Failed to render Google Sign-In button:', error);
    // 触发错误事件
    const errorEvent = new CustomEvent('googleSignInError', {
      detail: {
        error: 'Failed to render Google Sign-In button',
        originalError: error,
      },
    });
    window.dispatchEvent(errorEvent);
  }
};

/**
 * 解析JWT token
 */
function parseJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error('Invalid JWT token');
  }
}

/**
 * 检查Google Auth是否可用
 */
export const isGoogleAuthAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         !!window.google?.accounts?.id && 
         !!GOOGLE_CLIENT_ID;
};

/**
 * 获取Google Auth不可用的详细原因
 */
export const getGoogleAuthUnavailableReason = (): string => {
  if (typeof window === 'undefined') {
    return 'Google Auth can only be used in browser environment';
  }
  
  if (!GOOGLE_CLIENT_ID) {
    return 'Google Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env.local file';
  }
  
  if (!window.google?.accounts?.id) {
    return 'Google Identity Services not loaded. Please ensure the Google script is loaded properly';
  }
  
  return 'Google Auth is available';
};

// 扩展Window接口以包含Google类型
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}