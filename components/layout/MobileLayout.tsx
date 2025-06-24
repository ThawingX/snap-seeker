"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconHistory,
  IconInfoCircle,
  IconList,
  IconChartBar,
  IconBulb,
  IconMenu2
} from "@tabler/icons-react";
import { useState } from "react";
import { LogoIcon } from "@/components/layout/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

export const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const { showAuthModal, isAuthenticated, logout } = useAuth();

  const mainNavItems = [
    {
      label: "Home",
      href: "/",
      icon: <IconHome size={24} />,
    },
    {
      label: "History",
      href: "/history",
      icon: <IconHistory size={24} />,
    },
  ];

  return (
    <div
      className={cn(
        "flex md:hidden w-full flex-1 flex-col overflow-hidden bg-gradient-soft text-foreground",
        "h-screen",
      )}
    >
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 px-3 py-2">
        <div className="flex items-center justify-between min-h-[40px]">
          <div className="flex items-center space-x-2">
            <LogoIcon />
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <button 
                onClick={logout}
                className="text-xs py-1 px-2 rounded-md bg-gray-500/20 hover:bg-gray-500/30 text-muted-foreground font-medium transition-all duration-300 backdrop-blur-sm border border-gray-400/20 hover:border-gray-400/40">
                  Logout
              </button>
            ) : (
              <>
                <button 
                  onClick={() => {
                    trackEvent(ANALYTICS_EVENTS.LOGIN_START, {
                      method: 'email',
                      page: 'mobile_header'
                    });
                    showAuthModal("login");
                  }}
                  className="text-xs py-1 px-2 rounded-md bg-blue-600/80 hover:bg-blue-600/90 text-white font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-blue-500/30 hover:border-blue-500/50 backdrop-blur-sm">
                    Login
                </button>
                <button 
                  onClick={() => {
                    trackEvent(ANALYTICS_EVENTS.CREATE_ACCOUNT_CLICK, {
                      method: 'email',
                      page: 'mobile_header',
                      has_invitation_code: false
                    });
                    showAuthModal("signup");
                  }}
                  className="text-xs py-1 px-2 rounded-md bg-green-600/80 hover:bg-green-600/90 text-white font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-green-500/30 hover:border-green-500/50 backdrop-blur-sm">
                    Sign Up
                </button>
              </>
            )}
            

          </div>
        </div>
      </div>
      
      <main className="flex-1 overflow-y-auto pt-[60px] pb-20">
        {children}
      </main>

      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 p-2">
        <div className="grid grid-cols-2 gap-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 text-xs transition-colors",
                pathname === item.href || (item.href === "/history" && pathname === "/space")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};