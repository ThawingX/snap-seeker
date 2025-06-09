"use client";
import React from 'react';
import Link from 'next/link';

export default function SeoFooter() {
  return (
    <div className="border-t border-neutral-800 pt-10 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div>
          <div className="flex items-center mb-4">
            <svg className="h-6 w-6 text-teal-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.5 14.5L4.5 19.5M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path d="M12 3L12 7M21 12L17 12M19.7782 4.2218L16.9497 7.0503M4.2218 4.2218L7.0503 7.0503M12 17L12 21"/>
            </svg>
            <span className="font-medium">SnapSeeker</span>
          </div>
          <p className="text-neutral-400 text-sm">
            Professional competitor analysis and idea validation tool, helping product managers, independent developers, and entrepreneurs quickly validate product ideas.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">Main Features</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/competitor-analysis" className="text-neutral-400 hover:text-teal-500">
                Competitor Analysis Tool
              </Link>
            </li>
            <li>
              <Link href="/product-validation" className="text-neutral-400 hover:text-teal-500">
                Product Idea Validation
              </Link>
            </li>
            <li>
              <Link href="/" className="text-neutral-400 hover:text-teal-500">
                Similar Product Search
              </Link>
            </li>
            <li>
              <Link href="/" className="text-neutral-400 hover:text-teal-500">
                Market Opportunity Analysis
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">Solutions</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/features" className="text-neutral-400 hover:text-teal-500">
                Avoid Reinventing the Wheel
              </Link>
            </li>
            <li>
              <Link href="/features" className="text-neutral-400 hover:text-teal-500">
                Understand Market Landscape
              </Link>
            </li>
            <li>
              <Link href="/features" className="text-neutral-400 hover:text-teal-500">
                Reduce Startup Risk
              </Link>
            </li>
            <li>
              <Link href="/features" className="text-neutral-400 hover:text-teal-500">
                Improve Success Rate
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">Target Users</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-neutral-400 hover:text-teal-500">
                Product Managers
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-neutral-400 hover:text-teal-500">
                Independent Developers
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-neutral-400 hover:text-teal-500">
                Entrepreneurs
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-neutral-400 hover:text-teal-500">
                Market Researchers
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-neutral-800 pt-6">
        <div className="text-neutral-500 text-sm mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} SnapSeeker. All rights reserved.
        </div>
        <div className="flex gap-4">
          <Link href="/about" className="text-neutral-500 text-sm hover:text-white">About Us</Link>
          <Link href="/features" className="text-neutral-500 text-sm hover:text-white">Features</Link>
          <Link href="/privacy" className="text-neutral-500 text-sm hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="text-neutral-500 text-sm hover:text-white">Terms</Link>
        </div>
      </div>
    </div>
  );
}