"use client";
import React from "react";
import { SidebarLink, SidebarCredits } from "@/components/ui/sidebar";
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
        <IconHome className="h-5 w-5 shrink-0 text-muted-foreground" />
      ),
    },
    {
      label: "History",
      href: "/history",
      icon: (
        <IconHistory className="h-5 w-5 shrink-0 text-muted-foreground" />
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
      <div className="mb-4">
        <SidebarCredits />
      </div>
      <div className="flex justify-center mb-4">
        <button 
          onClick={() => showAuthModal("signup")}
          className="text-base py-3 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-primary/20 hover:border-primary/40">
            Sign Up
        </button>
      </div>
      <div className="flex justify-center">
        <button 
          onClick={() => showAuthModal("login")}
          className="text-base py-3 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-primary/20 hover:border-primary/40">
            Log in
        </button>
      </div>
    </div>
  );

};