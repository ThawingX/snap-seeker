"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SignupForm from "@/components/signup-form";
import LoginForm from "@/components/login-form";
import { IconArrowLeft } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "signup");

  // Update isLogin state when mode changes
  useEffect(() => {
    setIsLogin(mode !== "signup");
  }, [mode]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 dark:from-neutral-950 dark:to-neutral-900">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center text-cyan-500 hover:text-cyan-600 transition duration-200">
          <IconArrowLeft className="h-5 w-5 mr-1" />
          <span>Back to Home</span>
        </Link>
      </div>
      
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          {/* Form toggle */}
          <div className="bg-white dark:bg-black rounded-t-xl p-3 flex justify-center space-x-4 border-b border-neutral-200 dark:border-neutral-800">
            <button 
              onClick={() => setIsLogin(true)}
              className={`py-2 px-4 rounded-md transition-all ${
                isLogin 
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-medium' 
                  : 'text-neutral-500'
              }`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`py-2 px-4 rounded-md transition-all ${
                !isLogin 
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-medium' 
                  : 'text-neutral-500'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          {/* Form display */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <LoginForm />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SignupForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 