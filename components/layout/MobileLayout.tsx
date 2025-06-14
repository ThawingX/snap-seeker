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
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

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
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">SnapSeeker</h1>
          <ThemeToggle />
        </div>
      </div>
      
      <main className="flex-1 overflow-y-auto pt-16 pb-16">
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