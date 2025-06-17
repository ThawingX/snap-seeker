"use client";
import React, { useState } from 'react';
import { X, Key, AlertCircle, CheckCircle } from 'lucide-react';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivationSuccess: () => void;
}

interface ActivationRequest {
  invitation_code: string;
}

interface ActivationResponse {
  success: boolean;
  message?: string;
}

const ActivationModal: React.FC<ActivationModalProps> = ({
  isOpen,
  onClose,
  onActivationSuccess,
}) => {
  const [invitationCode, setInvitationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitationCode.trim()) {
      setError('Please enter invitation code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 动态导入API模块以避免循环依赖
      const { api, API_ENDPOINTS } = await import('@/lib/api');
      
      const requestData: ActivationRequest = {
        invitation_code: invitationCode.trim(),
      };

      const response = await api.post(API_ENDPOINTS.AUTH.ACTIVATE, requestData);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Activation failed, please check if the invitation code is correct');
      }

      setSuccess(true);
      setTimeout(() => {
        onActivationSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Activation failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInvitationCode('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          disabled={loading}
        >
          <X className="h-5 w-5" />
        </button>

        {/* 标题 */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Key className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Account Activation
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please enter your invitation code to activate your account
          </p>
        </div>

        {/* 成功状态 */}
        {success && (
          <div className="mb-4 flex items-center justify-center rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <CheckCircle className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Activation successful! Redirecting...
            </span>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 flex items-center rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <AlertCircle className="mr-2 h-5 w-5 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
          </div>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="invitation-code"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Invitation Code
            </label>
            <input
              id="invitation-code"
              type="text"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
              placeholder="Enter invitation code"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 dark:disabled:bg-gray-800"
              disabled={loading || success}
              autoFocus
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
              disabled={loading || success || !invitationCode.trim()}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Activating...
                </div>
              ) : (
                'Activate Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivationModal;