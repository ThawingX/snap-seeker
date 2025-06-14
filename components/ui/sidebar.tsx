"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconMenu2, IconX, IconCoins, IconRefresh } from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";
import { api, API_ENDPOINTS } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = false,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-6 hidden md:flex md:flex-col glass-card border-r border-border/50 w-[280px] shrink-0 transition-glass shadow-lg",
          className
        )}
        animate={{
          width: animate ? (open ? "280px" : "80px") : "280px",
        }}
        onMouseEnter={() => animate && setOpen(true)}
        onMouseLeave={() => animate && setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-16 px-4 py-4 flex flex-row md:hidden items-center justify-between glass-card border-b border-border/50 w-full shadow-lg"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-foreground"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 glass p-6 z-[100] flex flex-col justify-between shadow-2xl",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-foreground"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarCredits = ({ className }: { className?: string }) => {
  const { open, animate } = useSidebar();
  const { isAuthenticated } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const fetchCredits = async () => {
    if (!isAuthenticated) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(API_ENDPOINTS.CREDITS);
      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }
      const data = await response.json();
      setCredits(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // 只在登录后初始化一次Credits请求
  useEffect(() => {
    if (isAuthenticated && !hasInitialized) {
      fetchCredits();
      setHasInitialized(true);
    } else if (!isAuthenticated) {
      // 用户登出时重置状态
      setCredits(null);
      setHasInitialized(false);
      setError(null);
    }
  }, [isAuthenticated, hasInitialized]);

  // 如果未登录，不显示Credits组件
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg bg-gray-500/10 backdrop-blur-sm transition-all duration-300",
        "hover:bg-gray-500/15",
        className
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-400/20">
        <IconCoins className="w-4 h-4 text-gray-600" />
      </div>
      
      <motion.div
        animate={{
          display: animate ? (open ? "flex" : "none") : "flex",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="flex items-center gap-1 flex-1 min-w-0"
      >
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Credits :</span>
        <span className="text-sm font-bold text-foreground">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : error ? (
            <span className="text-red-500">Error</span>
          ) : (
            (credits?.toLocaleString() || '0')
          )}
        </span>
      </motion.div>
      
      {/* 刷新按钮 - 始终可见 */}
      <button
        onClick={fetchCredits}
        disabled={loading}
        className={cn(
          "flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 flex-shrink-0",
          "hover:bg-gray-400/30 active:scale-95",
          loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
        title="刷新Credits"
      >
        <IconRefresh 
          className={cn(
            "w-3 h-3 text-gray-600",
            loading && "animate-spin"
          )} 
        />
      </button>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  const pathname = usePathname();
  const isActive = pathname === link.href;
  const isExternalLink = link.href.startsWith('http');

  return (
    <Link
      href={link.href}
      target={isExternalLink ? "_blank" : undefined}
      rel={isExternalLink ? "noopener noreferrer" : undefined}
      className={cn(
        "flex items-center justify-start gap-4 group/sidebar py-3 px-4 rounded-lg transition-all duration-300 border border-transparent",
        "hover:bg-primary/10 hover:text-primary hover:shadow-md hover:border-primary/30",
        isActive ? "bg-primary text-primary-foreground shadow-md border-primary/40" : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={cn(
          "text-sm transition-all duration-200 whitespace-pre inline-block !p-0 !m-0",
          isActive ? "font-semibold text-primary-foreground" : "text-inherit"
        )}
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
