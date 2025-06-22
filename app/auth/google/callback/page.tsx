'use client';

import { useEffect } from 'react';
import { handleGoogleAuthCallback } from '@/lib/google-auth';

/**
 * Google OAuth callback page
 * Handles popup login callback, parses URL parameters and sends messages to parent window
 */
export default function GoogleAuthCallbackPage() {
  useEffect(() => {
    // Handle Google authentication callback
    handleGoogleAuthCallback();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="mb-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        </div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Processing login...
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Please wait, completing the login process
        </p>
      </div>
    </div>
  );
}