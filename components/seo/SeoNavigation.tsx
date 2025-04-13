"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SeoNavigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'text-teal-500' : 'text-neutral-300 hover:text-white';
  };
  
  return (
    <div className="flex justify-between items-center w-full mb-12">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <svg className="h-8 w-8 text-teal-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.5 14.5L4.5 19.5M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path d="M12 3L12 7M21 12L17 12M19.7782 4.2218L16.9497 7.0503M4.2218 4.2218L7.0503 7.0503M12 17L12 21"/>
          </svg>
          <span className="text-xl font-bold">SnapSeeker</span>
        </Link>
      </div>
      <div className="hidden md:flex gap-6">
        <Link href="/seo/about" className={isActive('/seo/about')}>About Us</Link>
        <Link href="/seo/features" className={isActive('/seo/features')}>Features</Link>
        <Link href="/seo/competitor-analysis" className={isActive('/seo/competitor-analysis')}>Competitor Analysis</Link>
        <Link href="/seo/product-validation" className={isActive('/seo/product-validation')}>Product Validation</Link>
      </div>
    </div>
  );
} 