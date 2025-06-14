/**
 * Authentication API utilities
 * Handles all authentication-related API calls
 */

import { API_ENDPOINTS, api, publicApi, tokenManager } from './api';

/**
 * Interface for login request
 */
export interface LoginRequest {
  username: string; // 用户邮箱
  password: string;
}

/**
 * Interface for register request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  invitation_code: string;
}

/**
 * Interface for Google login request
 */
export interface GoogleLoginRequest {
  google_id_token: string;
  invitation_code?: string | null;
}

/**
 * Interface for authentication response
 */
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

/**
 * Store token in localStorage
 */
export const storeToken = (token: string): void => {
  tokenManager.setToken(token);
};

/**
 * Get token from localStorage (deprecated - use tokenManager.getToken instead)
 * @deprecated Use tokenManager.getToken() from './api'
 */
export const getToken = (): string | null => {
  return tokenManager.getToken();
};

/**
 * Remove token from localStorage (deprecated - use tokenManager.removeToken instead)
 * @deprecated Use tokenManager.removeToken() from './api'
 */
export const removeToken = (): void => {
  tokenManager.removeToken();
};

/**
 * Get authorization headers (deprecated - use api methods with automatic auth instead)
 * @deprecated Use api.get/post/put/delete methods which automatically add auth headers
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = tokenManager.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Register new user
 */
export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await publicApi.post(API_ENDPOINTS.AUTH.REGISTER, data);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'Registration failed');
  }

  return response.json();
};

/**
 * Login with email and password
 */
export const loginWithPassword = async (data: LoginRequest): Promise<AuthResponse> => {
  const formData = new FormData();
  formData.append('username', data.username);
  formData.append('password', data.password);

  // For FormData, we need to use fetch directly without JSON headers
  const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'Login failed');
  }

  const result = await response.json();
  
  // Save token after successful login
  if (result.access_token) {
    tokenManager.setToken(result.access_token);
  }

  return result;
};

/**
 * Login with Google
 */
export const loginWithGoogle = async (data: GoogleLoginRequest): Promise<AuthResponse> => {
  const response = await publicApi.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, data);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'Google login failed');
  }

  const result = await response.json();
  
  // Save token after successful login
  if (result.access_token) {
    tokenManager.setToken(result.access_token);
  }

  return result;
};

/**
 * Check if user is authenticated (deprecated - use tokenManager.isAuthenticated instead)
 * @deprecated Use tokenManager.isAuthenticated() from './api'
 */
export const isAuthenticated = (): boolean => {
  return tokenManager.isAuthenticated();
};

/**
 * Make authenticated API request (deprecated - use api methods instead)
 * @deprecated Use api.get/post/put/delete methods which automatically handle authentication
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  return api.get(url, options);
};