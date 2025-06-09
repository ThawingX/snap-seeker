"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/login-form";
import SignupForm from "@/components/signup-form";
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
              <SignupForm />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}