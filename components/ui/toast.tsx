"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number;
  onClose?: () => void;
}

export const Toast = ({ 
  message, 
  type = "info", 
  duration = 3000, 
  onClose 
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // 根据类型设置背景色
  const bgColors = {
    info: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  // 自动关闭提示
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-[10000] flex items-center px-4 py-3 rounded-lg shadow-lg ${bgColors[type]} text-white max-w-md`}
        >
          <span className="flex-grow">{message}</span>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="ml-4 p-1 rounded-full hover:bg-white/20"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 提示上下文和Hook
export const ToastContext = React.createContext<{
  showToast: (props: ToastProps) => void;
  hideToast: () => void;
}>({
  showToast: () => {},
  hideToast: () => {},
});

export const useToast = () => React.useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastProps, setToastProps] = useState<ToastProps | null>(null);

  const showToast = (props: ToastProps) => {
    setToastProps(props);
  };

  const hideToast = () => {
    setToastProps(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toastProps && (
        <Toast {...toastProps} onClose={hideToast} />
      )}
    </ToastContext.Provider>
  );
};