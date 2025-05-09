"use client";
import React from "react";
import { SidebarLink } from "@/components/ui/sidebar";
import {
  IconHome,
  IconHistory,
} from "@tabler/icons-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export const Navigation = () => {
  // Define sidebar navigation links
  const navigationLinks = [
    {
      label: "Home",
      href: "/",
      icon: (
        <IconHome className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "History",
      href: "/history",
      icon: (
        <IconHistory className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {navigationLinks.map((link, idx) => (
        <SidebarLink key={idx} link={link} />
      ))}
    </nav>
  );
};

export const AuthButtons = () => {
  const { showAuthModal } = useAuth();

  return (
    <div className="pb-4">
      <div className="flex justify-center mb-4">
        <button 
          onClick={() => showAuthModal("signup")}
          className="text-base py-3 px-10 rounded-full bg-teal-500 text-white font-medium hover:bg-teal-600 transition-colors">
            Sign Up
        </button>
      </div>
      <div className="flex justify-center">
        <button 
          onClick={() => showAuthModal("login")}
          className="text-base py-3 px-10 rounded-full text-neutral-700 font-medium hover:bg-neutral-100 transition-colors dark:text-neutral-200 dark:hover:bg-neutral-800">
            Log in
        </button>
      </div>
    </div>
  );
}; 