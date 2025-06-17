/**
 * User API utilities
 * Handles user-related API calls
 */

import { API_ENDPOINTS, api } from './api';

/**
 * Interface for user info response
 */
export interface UserInfoResponse {
  isActive: boolean;
  // 可以根据实际API响应添加更多字段
  id?: string;
  email?: string;
  name?: string;
}

/**
 * Interface for activation request
 */
export interface ActivationRequest {
  invitation_code: string;
}

/**
 * Interface for activation response
 */
export interface ActivationResponse {
  success?: boolean;
  message?: string;
  // 可以根据实际API响应添加更多字段
}

/**
 * Get user information including activation status
 */
export const getUserInfo = async (): Promise<UserInfoResponse> => {
  const response = await api.get(API_ENDPOINTS.USER_INFO);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'Failed to fetch user info');
  }

  return response.json();
};

/**
 * Activate user account with invitation code
 */
export const activateAccount = async (data: ActivationRequest): Promise<ActivationResponse> => {
  const response = await api.post(API_ENDPOINTS.AUTH.ACTIVATE, data);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'Activation failed');
  }

  return response.json();
};

/**
 * Check if user account is activated
 * This is a convenience function that calls getUserInfo and returns only the activation status
 */
export const checkActivationStatus = async (): Promise<boolean> => {
  try {
    const userInfo = await getUserInfo();
    return userInfo.isActive;
  } catch (error) {
    console.error('Failed to check activation status:', error);
    // 如果获取用户信息失败，假设用户未激活
    return false;
  }
};