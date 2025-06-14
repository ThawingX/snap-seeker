/**
 * Environment configuration
 * This file centralizes environment-specific settings
 */

// Environment detection
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// API base URLs for different environments
const DEV_API_BASE = 'http://35.209.49.134:8020';
const PROD_API_BASE = 'https://api.snapsnap.site';

// Select API base URL based on environment
const API_BASE_URL = IS_DEVELOPMENT ? DEV_API_BASE : PROD_API_BASE;

// Make sure NEXT_PUBLIC variables are accessible on both client and server
export const ENV = {
  // Environment type
  IS_DEVELOPMENT,

  // API URLs - automatically switch based on environment
  API_BASE_URL,
  TARGET_CHAT_API_URL: `${API_BASE_URL}/api/chat`,

  // Development and production URLs for reference
  DEV_API_BASE,
  PROD_API_BASE,

  // Feature flags
  ENABLE_PROXY_CHAT: IS_DEVELOPMENT,
};
