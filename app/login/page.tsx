"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SignupForm from "@/components/signup-form";
import LoginForm from "@/components/login-form";
import { IconArrowLeft } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

function LoginContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "signup");

  // Update isLogin state when mode changes
  useEffect(() => {
    setIsLogin(mode !== "signup");
  }, [mode]);

  return (
    <>
      {/* Form toggle */}
      <div className="bg-card rounded-t-xl p-4 border-b border-border">
        <div className="flex rounded-lg bg-muted/30 p-1 max-w-xs mx-auto">
          <button 
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-3 px-4 text-center font-semibold rounded-md transition-all duration-300 ${
              isLogin 
                ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 border border-blue-500/30' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-3 px-4 text-center font-semibold rounded-md transition-all duration-300 ${
              !isLogin 
                ? 'bg-green-600 text-white shadow-lg hover:bg-green-700 border border-green-500/30' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            Sign Up
          </button>
        </div>
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
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-muted p-4">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center text-primary hover:text-primary/80 transition duration-200">
          <IconArrowLeft className="h-5 w-5 mr-1" />
          <span>Back to Home</span>
        </Link>
      </div>
      
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          <Suspense fallback={
            <div className="bg-card rounded-xl p-8 flex justify-center items-center border border-border">
              <div className="animate-pulse text-center">
                <div className="h-8 w-32 bg-muted mx-auto rounded mb-4"></div>
                <div className="h-6 w-64 bg-muted mx-auto rounded"></div>
              </div>
            </div>
          }>
            <LoginContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}