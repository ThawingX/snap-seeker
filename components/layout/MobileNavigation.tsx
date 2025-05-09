"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  IconHome,
  IconHistory,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import { useAuth } from "@/contexts/AuthContext";

const MobileNavigation = () => {
  const pathname = usePathname();
  const { showAuthModal } = useAuth();
  
  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: <IconHome size={24} />,
    },
    {
      label: "Search",
      href: "/discover",
      icon: <IconSearch size={24} />,
    },
    {
      label: "History",
      href: "/history",
      icon: <IconHistory size={24} />,
    },
    {
      label: "Account",
      href: "#",
      icon: <IconUser size={24} />,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        showAuthModal("login");
      }
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-neutral-800 p-2">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center py-2 text-xs",
              pathname === item.href
                ? "text-teal-500"
                : "text-neutral-400 hover:text-neutral-200"
            )}
            onClick={item.onClick}
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation; 