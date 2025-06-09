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
 * 触发Google登录弹窗
 */
export const signInWithGoogle = (): Promise<GoogleAuthResponse> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google Sign-In can only be used in browser'));
      return;
    }

    if (!window.google?.accounts?.id) {
      reject(new Error('Google Identity Services not initialized'));
      return;
    }

    // 设置回调函数
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        try {
          // 解析JWT token获取用户信息
          const payload = parseJWT(response.credential);
          const user: GoogleUser = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
          };
          
          resolve({
            credential: response.credential,
            user,
          });
        } catch (error) {
          reject(new Error('Failed to parse Google response'));
        }
      },
    });

    // 显示登录弹窗
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // 如果弹窗没有显示，尝试使用按钮方式
        window.google.accounts.id.renderButton(
          document.createElement('div'),
          {
            theme: 'outline',
            size: 'large',
            type: 'standard',
          }
        );
      }
    });
  });
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