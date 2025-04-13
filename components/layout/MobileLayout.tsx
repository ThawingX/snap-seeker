"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconHistory,
} from "@tabler/icons-react";

export const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  const navItems = [
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
        "flex md:hidden w-full flex-1 flex-col overflow-hidden bg-black text-white",
        "h-screen",
      )}
    >
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>
      
      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-neutral-800 p-2">
        <div className="grid grid-cols-2 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 text-xs",
                pathname === item.href || (item.href === "/history" && pathname === "/space")
                  ? "text-teal-500"
                  : "text-neutral-400 hover:text-neutral-200"
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