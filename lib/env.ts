/**
 * Environment configuration
 * This file centralizes environment-specific settings
 */

// Make sure NEXT_PUBLIC variables are accessible on both client and server
export const ENV = {
  // Environment type
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // API URLs
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  TARGET_CHAT_API_URL: 'https://35.209.49.134:8000/api/chat',
  
  // Feature flags
  ENABLE_PROXY_CHAT: process.env.NODE_ENV === 'development',
};

/**
 * Checks if the proxy chat feature is enabled
 * This is only available in development environment
 */
export function isProxyChatEnabled(): boolean {
  return ENV.ENABLE_PROXY_CHAT;
} 