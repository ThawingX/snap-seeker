/**
 * Unified API management
 * This file centralizes all API endpoints and provides a consistent interface
 */

import { ENV } from './env';

// Token storage key
const TOKEN_STORAGE_KEY = 'snap_seeker_token';
// Remember me credentials storage key
const REMEMBER_CREDENTIALS_KEY = 'snap_seeker_remember_credentials';

/**
 * Token management utilities
 */
export const tokenManager = {
  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return null;
  },

  // Set token to localStorage
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  },

  // Remove token from localStorage
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken();
  },
};

/**
 * Remember me credentials management
 */
export const rememberMeManager = {
  // Save credentials to localStorage
  saveCredentials: (email: string, password: string): void => {
    if (typeof window !== 'undefined') {
      const credentials = {
        email,
        password,
        timestamp: Date.now()
      };
      localStorage.setItem(REMEMBER_CREDENTIALS_KEY, JSON.stringify(credentials));
    }
  },

  // Get saved credentials from localStorage
  getSavedCredentials: (): { email: string; password: string } | null => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(REMEMBER_CREDENTIALS_KEY);
        if (saved) {
          const credentials = JSON.parse(saved);
          // Check if credentials are not too old (30 days)
          const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
          if (Date.now() - credentials.timestamp < thirtyDaysInMs) {
            return {
              email: credentials.email || '',
              password: credentials.password || ''
            };
          } else {
            // Remove expired credentials
            localStorage.removeItem(REMEMBER_CREDENTIALS_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to parse saved credentials:', error);
        localStorage.removeItem(REMEMBER_CREDENTIALS_KEY);
      }
    }
    return null;
  },

  // Clear saved credentials
  clearCredentials: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REMEMBER_CREDENTIALS_KEY);
    }
  },

  // Check if credentials are saved
  hasCredentials: (): boolean => {
    return !!rememberMeManager.getSavedCredentials();
  },
};

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    REGISTER: `${ENV.API_BASE_URL}/auth/register/`,
    LOGIN: `${ENV.API_BASE_URL}/auth/login/token`,
    GOOGLE_LOGIN: `${ENV.API_BASE_URL}/auth/login/google`,
    LOGOUT: `${ENV.API_BASE_URL}/auth/logout`,
    ACTIVATE: `${ENV.API_BASE_URL}/auth/activate`,
  },

  // Chat endpoints
  CHAT: {
    BASE: ENV.TARGET_CHAT_API_URL,
    DOWNLOAD: (exportId: string) => `${ENV.TARGET_CHAT_API_URL}/${exportId}/download`,
  },

  // Other endpoints
  HOT_KEYS: `${ENV.API_BASE_URL}/api/hot_keys`,
  CREDITS: `${ENV.API_BASE_URL}/api/credits`,
  HISTORY: `${ENV.API_BASE_URL}/api/history`,
  USER_INFO: `${ENV.API_BASE_URL}/api/user-info`,
};

/**
 * Global auth error handler
 * This function will be set by the AuthContext to handle 401 errors
 */
let globalAuthErrorHandler: (() => void) | null = null;

export const setGlobalAuthErrorHandler = (handler: () => void) => {
  globalAuthErrorHandler = handler;
};

/**
 * Common fetch wrapper with default configuration and automatic token handling
 */
export const apiRequest = async (
  url: string,
  options: RequestInit = {},
  requireAuth: boolean = true
): Promise<Response> => {
  const token = tokenManager.getToken();
  
  // If auth is required but no token exists, trigger auth error handler
  if (requireAuth && !token) {
    if (globalAuthErrorHandler) {
      globalAuthErrorHandler();
    }
    throw new Error('Authentication required');
  }
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if token exists and auth is required
  if (requireAuth && token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized responses
  if (response.status === 401) {
    // Clear the invalid token
    tokenManager.removeToken();
    
    // Trigger global auth error handler (show login modal)
    if (globalAuthErrorHandler) {
      globalAuthErrorHandler();
    }
    
    throw new Error('Authentication failed');
  }

  return response;
};

/**
 * API request methods with automatic authentication
 */
export const api = {
  // GET request with optional authentication
  get: (url: string, options?: RequestInit, requireAuth: boolean = true) =>
    apiRequest(url, { ...options, method: 'GET' }, requireAuth),

  // POST request with optional authentication
  post: (url: string, data?: any, options?: RequestInit, requireAuth: boolean = true) =>
    apiRequest(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, requireAuth),

  // PUT request with optional authentication
  put: (url: string, data?: any, options?: RequestInit, requireAuth: boolean = true) =>
    apiRequest(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, requireAuth),

  // DELETE request with optional authentication
  delete: (url: string, options?: RequestInit, requireAuth: boolean = true) =>
    apiRequest(url, { ...options, method: 'DELETE' }, requireAuth),
};

/**
 * API request methods without authentication (for public endpoints)
 */
export const publicApi = {
  get: (url: string, options?: RequestInit) =>
    apiRequest(url, { ...options, method: 'GET' }, false),

  post: (url: string, data?: any, options?: RequestInit) =>
    apiRequest(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, false),
};

/**
 * Environment information for debugging
 */
export const getApiInfo = () => ({
  environment: ENV.IS_DEVELOPMENT ? 'development' : 'production',
  baseUrl: ENV.API_BASE_URL,
  chatUrl: ENV.TARGET_CHAT_API_URL,
  devUrl: ENV.DEV_API_BASE,
  prodUrl: ENV.PROD_API_BASE,
});