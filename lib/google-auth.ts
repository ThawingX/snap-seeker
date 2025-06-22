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
  invitationCode?: string | null;
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
      reject(new Error('Login service temporarily unavailable, please try again later'));
      return;
    }

    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
      reject(new Error('Login service temporarily unavailable, please try again later'));
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
 * 检查Google服务是否已初始化
 */
const isGoogleServicesInitialized = (): boolean => {
  return !!(window.google?.accounts?.id && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID');
};

/**
 * 使用弹窗窗口进行Google OAuth登录（备用方案）
 */
const signInWithGooglePopup = (invitationCode: string | null = null): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
      reject(new Error('Login service temporarily unavailable, please try again later'));
      return;
    }

    let isCompleted = false; // 添加完成标志

    // 构建OAuth URL
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth/google/callback`,
      response_type: 'id_token token',
      scope: 'openid email profile',
      nonce: Math.random().toString(36).substring(2, 15),
      state: invitationCode || '',
    });

    const authUrl = `https://accounts.google.com/oauth/v2/auth?${params.toString()}`;

    // 打开弹窗窗口
    const popup = window.open(
      authUrl,
      'google-auth',
      'width=500,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
    );

    if (!popup) {
      reject(new Error('Failed to open popup window. Please allow popups for this site.'));
      return;
    }

    // 监听弹窗消息
    const messageHandler = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        isCompleted = true; // 标记为已完成
        try {
          // 使用ID Token进行服务端认证
          const loginResult = await authenticateWithServer(event.data.idToken, invitationCode);
          
          // 解析用户信息
          const userInfo = parseJWT(event.data.idToken);
          
          resolve({
            token: loginResult.token,
            user: loginResult.user || userInfo,
            message: loginResult.message,
          });
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Failed to authenticate with Google'));
        } finally {
          window.removeEventListener('message', messageHandler);
          popup.close();
        }
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        isCompleted = true; // 标记为已完成
        window.removeEventListener('message', messageHandler);
        popup.close();
        reject(new Error(event.data.error || 'Google authentication failed'));
      }
    };

    window.addEventListener('message', messageHandler);

    // 检查弹窗是否被关闭
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
        // 只有在未完成认证的情况下才认为是取消
        if (!isCompleted) {
          reject(new Error('Google sign-in was cancelled'));
        }
      }
    }, 1000);

    // 设置超时
    setTimeout(() => {
      clearInterval(checkClosed);
      window.removeEventListener('message', messageHandler);
      if (!popup.closed) {
        popup.close();
      }
      if (!isCompleted) {
        reject(new Error('Google sign-in timeout'));
      }
    }, 60000); // 增加到60秒超时
  });
};

/**
 * 使用Google Identity Services进行登录
 * 获取Google ID Token并调用服务端API进行认证
 * 如果服务未初始化，自动使用弹窗方式登录
 */
export const signInWithGoogle = async (invitationCode: string | null = null): Promise<LoginResponse> => {
  if (typeof window === 'undefined') {
    throw new Error('Login service temporarily unavailable, please try again later');
  }

  // 检查Google服务是否已初始化
  if (!isGoogleServicesInitialized()) {
    console.log('Google Identity Services not initialized, using popup method');
    return signInWithGooglePopup(invitationCode);
  }

  // 使用Google Identity Services
  return new Promise((resolve, reject) => {
    let isResolved = false; // 防止重复resolve/reject
    let timeoutId: NodeJS.Timeout;

    // 安全的resolve函数
    const safeResolve = (result: LoginResponse) => {
      if (!isResolved) {
        isResolved = true;
        if (timeoutId) clearTimeout(timeoutId);
        resolve(result);
      }
    };

    // 安全的reject函数
    const safeReject = (error: Error) => {
      if (!isResolved) {
        isResolved = true;
        if (timeoutId) clearTimeout(timeoutId);
        reject(error);
      }
    };

    // 设置登录回调
    const handleCredentialResponse = async (response: GoogleAuthResponse) => {
      try {
        if (!response.credential) {
          throw new Error('Login failed, please try again');
        }

        // 解析JWT token获取用户信息
        const userInfo = parseJWT(response.credential);
        
        // 调用服务端API进行认证
        const loginResult = await authenticateWithServer(response.credential, invitationCode);
        
        safeResolve({
          token: loginResult.token,
          user: loginResult.user || userInfo,
          message: loginResult.message,
        });
      } catch (error) {
        safeReject(error instanceof Error ? error : new Error('Failed to authenticate with Google'));
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
      // 只有在还没有resolved的情况下才处理notification
      if (isResolved) return;
      
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // 如果弹窗没有显示，尝试使用弹窗方式登录
        console.log('Google Identity Services popup not displayed, falling back to popup method');
        signInWithGooglePopup(invitationCode)
          .then(safeResolve)
          .catch(safeReject);
      } else if (notification.isDismissedMoment()) {
        // 不要立即抛出错误，因为dismissed可能在正常登录流程中也会触发
        // 让超时机制来处理真正的取消情况
        console.log('Google sign-in popup dismissed, waiting for potential credential response');
      }
    });

    // 设置超时
    timeoutId = setTimeout(() => {
      safeReject(new Error('Google sign-in timeout'));
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
 * 处理Google认证token，返回用户信息但不调用服务端API
 * 服务端认证将由AuthContext统一处理
 */
export const authenticateWithServer = async (
  googleIdToken: string,
  invitationCode: string | null = null
): Promise<LoginResponse> => {
  try {
    // 解析JWT token获取用户信息
    const user = parseJWT(googleIdToken);
    
    if (!user) {
      throw new Error('Invalid Google ID token');
    }

    // 返回token和用户信息，让上层调用者处理服务端认证
    return {
      token: googleIdToken,
      user: user,
      message: 'Google authentication successful'
    };
  } catch (error) {
    console.error('Google authentication error:', error);
    throw error instanceof Error ? error : new Error('Google authentication failed');
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
    // 静默处理服务端渲染情况
    return;
  }

  if (!window.google?.accounts?.id) {
    // 静默处理Google服务未初始化情况
    return;
  }

  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
    // 静默处理配置问题
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

  // 检查Google服务是否已初始化
  if (!isGoogleServicesInitialized()) {
    // 如果Google服务未初始化，创建一个备用按钮
    element.innerHTML = '';
    const fallbackButton = document.createElement('button');
    fallbackButton.className = 'gsi-material-button';
    fallbackButton.style.cssText = `
      height: 40px;
      border-radius: 4px;
      border: 1px solid #dadce0;
      background-color: #fff;
      color: #3c4043;
      cursor: pointer;
      font-family: 'Roboto', sans-serif;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.25px;
      line-height: 16px;
      padding: 0 12px;
      text-align: center;
      vertical-align: middle;
      width: ${config.width}px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    `;
    
    // 添加Google图标
    const icon = document.createElement('div');
    icon.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    `;
    
    const text = document.createElement('span');
    text.textContent = config.text === 'signin_with' ? 'Sign in with Google' : 
                      config.text === 'signup_with' ? 'Sign up with Google' :
                      config.text === 'continue_with' ? 'Continue with Google' : 'Sign in';
    
    fallbackButton.appendChild(icon);
    fallbackButton.appendChild(text);
    
    // 添加点击事件处理
    fallbackButton.addEventListener('click', async () => {
      try {
        if (config.click_listener) {
          config.click_listener();
          return;
        }
        
        // 使用弹窗方式登录
        const result = await signInWithGooglePopup(invitationCode);
        
        // 触发成功事件
        const event = new CustomEvent('googleSignInSuccess', {
          detail: {
            token: result.token,
            user: result.user,
            message: result.message,
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
    });
    
    element.appendChild(fallbackButton);
    return;
  }

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
    return 'Login service temporarily unavailable, please try again later';
  }
  
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
    return 'Login service temporarily unavailable, please try again later';
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
    // 静默处理认证回调错误
    window.opener?.postMessage({
      type: 'GOOGLE_AUTH_ERROR',
      error: 'Login failed, please try again'
    }, window.location.origin);
    window.close();
  }
};

// 简化版本不需要Google Identity Services的类型声明