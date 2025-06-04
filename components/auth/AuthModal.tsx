"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/login-form";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const { showToast } = useToast();

  // 当props中的initialMode变化时，更新内部state
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  // 防止模态框打开时页面滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 阻止点击内部元素时关闭模态框
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // 处理注册表单提交
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent(ANALYTICS_EVENTS.CREATE_ACCOUNT_CLICK, {
      signup_method: 'form'
    });
    showToast({
      message: "Sign up is not allow yet.Please contact with developer!",
      type: "info",
      duration: 5000
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-md w-full rounded-xl overflow-hidden shadow-xl"
            onClick={handleModalClick}
          >
            {/* 关闭按钮 */}
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 z-10"
            >
              <X className="h-5 w-5 text-neutral-500" />
            </button>

            {/* 模态框头部 */}
            <div className="bg-gradient-to-br from-cyan-400 to-teal-500 p-8 text-white">
              <h1 className="text-2xl font-bold">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="mt-2 text-sm opacity-80">
                {mode === "login" 
                  ? "Log in to your account to continue" 
                  : "Sign up for a free account to get started"}
              </p>
            </div>

            {/* 切换登录/注册模式的标签 */}
            <div className="flex">
              <button
                className={`w-1/2 py-3 text-center font-medium ${
                  mode === "login"
                  ? "bg-white dark:bg-black text-neutral-900 dark:text-white"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                }`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                className={`w-1/2 py-3 text-center font-medium ${
                  mode === "signup"
                  ? "bg-white dark:bg-black text-neutral-900 dark:text-white"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                }`}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </div>

            {/* 登录或注册表单 */}
            {mode === "login" ? (
              <LoginForm />
            ) : (
              <div className="shadow-input mx-auto w-full max-w-md rounded-none rounded-b-xl bg-white p-4 md:p-8 dark:bg-black">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                  Create Your Account
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                  Join SnapSeeker today to discover more insights
                </p>

                <form className="my-8" onSubmit={handleSignupSubmit}>
                  {/* 示例注册表单内容 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-neutral-900"
                      placeholder="Your name" 
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-neutral-900"
                      placeholder="your.email@example.com" 
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-neutral-900"
                      placeholder="•••••••••" 
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Create Account
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}