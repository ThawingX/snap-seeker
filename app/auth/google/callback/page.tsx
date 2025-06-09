'use client';

import { useEffect } from 'react';
import { handleGoogleAuthCallback } from '@/lib/google-auth';

/**
 * Google OAuth回调页面
 * 处理Google认证后的重定向
 */
export default function GoogleAuthCallbackPage() {
  useEffect(() => {
    // 处理Google认证回调
    handleGoogleAuthCallback();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        </div>
        <p className="text-gray-600">Processing Google authentication...</p>
      </div>
    </div>
  );
}