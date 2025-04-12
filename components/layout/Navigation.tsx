"use client";
import React from "react";
import { SidebarLink } from "@/components/ui/sidebar";
import {
  IconHome,
  IconCompass,
  IconLayoutGrid,
  IconBook,
} from "@tabler/icons-react";
import Link from "next/link";

export const Navigation = () => {
  const links = [
    {
      label: "Home",
      href: "#",
      icon: (
        <IconHome className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Discover",
      href: "#",
      icon: (
        <IconCompass className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Spaces",
      href: "#",
      icon: (
        <IconLayoutGrid className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Library",
      href: "#",
      icon: (
        <IconBook className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <div className="mt-8 flex flex-col gap-2">
      {links.map((link, idx) => (
        <SidebarLink key={idx} link={link} />
      ))}
    </div>
  );
};

export const AuthButtons = () => {
  return (
    <div className="pb-4">
      <div className="flex justify-center mb-4">
        <Link href="#" 
          className="text-sm py-2 px-8 rounded-full bg-teal-500 text-white font-medium hover:bg-teal-600 transition-colors">
            Sign Up
        </Link>
      </div>
      <div className="flex justify-center">
        <Link href="#" 
          className="text-sm py-2 px-8 rounded-full text-neutral-700 font-medium hover:bg-neutral-100 transition-colors dark:text-neutral-200 dark:hover:bg-neutral-800">
            Log in
        </Link>
      </div>
    </div>
  );
}; 