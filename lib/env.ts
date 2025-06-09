/**
 * Environment configuration
 * This file centralizes environment-specific settings
 */

// Make sure NEXT_PUBLIC variables are accessible on both client and server
export const ENV = {
  // Environment type
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',

  // API URLs
  API_BASE_URL: 'https://api.snapsnap.site',
  TARGET_CHAT_API_URL: 'https://api.snapsnap.site/api/chat',

  // Feature flags
  ENABLE_PROXY_CHAT: process.env.NODE_ENV === 'development',
};
