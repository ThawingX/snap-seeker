"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-3 py-4 px-4 text-sm font-normal text-black"
    >
      <div className="h-9 w-9 shrink-0 text-teal-500">
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 14.5L4.5 19.5M15 10a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 3L12 7M21 12L17 12M19.7782 4.2218L16.9497 7.0503M4.2218 4.2218L7.0503 7.0503M12 17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="font-bold whitespace-pre text-black dark:text-white text-lg">
        Snap Seeker
      </span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-8 w-8 shrink-0 text-teal-500">
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 14.5L4.5 19.5M15 10a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 3L12 7M21 12L17 12M19.7782 4.2218L16.9497 7.0503M4.2218 4.2218L7.0503 7.0503M12 17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </Link>
  );
}; 