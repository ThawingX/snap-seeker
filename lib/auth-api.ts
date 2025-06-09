/**
 * Authentication API utilities
 * Handles all authentication-related API calls
 */

import { ENV } from './env';

// API base URL for authentication
const AUTH_API_BASE = ENV.API_BASE_URL || 'https://api.snapsnap.site';

// Token storage key
const TOKEN_STORAGE_KEY = 'snap_seeker_token';

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
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
};

/**
 * Get token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
  return null;
};

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

/**
 * Get authorization headers
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Register new user
 */
export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await fetch(`${AUTH_API_BASE}/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

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

  const response = await fetch(`${AUTH_API_BASE}/auth/login/token`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'Login failed');
  }

  return response.json();
};

/**
 * Login with Google
 */
export const loginWithGoogle = async (data: GoogleLoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${AUTH_API_BASE}/auth/login/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'Google login failed');
  }

  return response.json();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Make authenticated API request
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const headers = {
    ...options.headers,
    ...getAuthHeaders(),
  };

  return fetch(url, {
    ...options,
    headers,
  });
};