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
            专业的竞品分析和创意验证工具，帮助产品经理、独立开发者和创业者快速验证产品想法。
          </p>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">主要功能</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/competitor-analysis" className="text-neutral-400 hover:text-teal-500">
                竞品分析工具 | Competitor Analysis Tool
              </Link>
            </li>
            <li>
              <Link href="/product-validation" className="text-neutral-400 hover:text-teal-500">
                产品创意验证 | Product Idea Validation
              </Link>
            </li>
            <li>
              <Link href="/" className="text-neutral-400 hover:text-teal-500">
                同类产品查询 | Similar Product Search
              </Link>
            </li>
            <li>
              <Link href="/" className="text-neutral-400 hover:text-teal-500">
                市场机会分析 | Market Opportunity Analysis
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">解决痛点</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/features" className="text-neutral-400 hover:text-teal-500">
                避免重复造轮子 | Avoid Reinventing the Wheel
              </Link>
            </li>
            <li>
              <Link href="/features" className="text-neutral-400 hover:text-teal-500">
                了解市场竞争格局 | Understand Market Landscape
              </Link>
            </li>
            <li>
              <Link href="/features" className="text-neutral-400 hover:text-teal-500">
                降低创业风险 | Reduce Startup Risk
              </Link>
            </li>
            <li>
              <Link href="/features" className="text-neutral-400 hover:text-teal-500">
                提高产品成功率 | Improve Success Rate
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">适合用户</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-neutral-400 hover:text-teal-500">
                产品经理 | Product Managers
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-neutral-400 hover:text-teal-500">
                独立开发者 | Independent Developers
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-neutral-400 hover:text-teal-500">
                创业者 | Entrepreneurs
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-neutral-400 hover:text-teal-500">
                市场研究人员 | Market Researchers
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
          <Link href="/about" className="text-neutral-500 text-sm hover:text-white">关于我们</Link>
          <Link href="/features" className="text-neutral-500 text-sm hover:text-white">功能</Link>
          <Link href="/" className="text-neutral-500 text-sm hover:text-white">隐私政策</Link>
          <Link href="/" className="text-neutral-500 text-sm hover:text-white">条款</Link>
        </div>
      </div>
    </div>
  );
} 