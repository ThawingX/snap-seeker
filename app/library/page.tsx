"use client";
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { IconArrowLeft, IconBook, IconBookmarks } from "@tabler/icons-react";
import Link from "next/link";

export default function LibraryPage() {
  return (
    <>
      {/* Desktop Layout - hidden on mobile with CSS */}
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Library Page</h1>
          <p className="text-gray-500">This page is only visible on desktop</p>
        </div>
      </AppLayout>
      
      {/* Mobile Layout - hidden on desktop with CSS */}
      <MobileLayout>
        <div className="flex flex-col h-full">
          <div className="sticky top-0 left-0 right-0 z-30 bg-black px-4 py-3 border-b border-neutral-800">
            <div className="flex items-center">
              <Link href="/" className="p-2 -ml-2">
                <IconArrowLeft className="h-5 w-5 text-white" />
              </Link>
              <h1 className="text-xl font-bold ml-2">图书馆</h1>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col items-center justify-center bg-neutral-900 rounded-lg p-6">
                <IconBook className="h-10 w-10 text-teal-500 mb-3" />
                <span className="text-sm font-medium text-white">我的收藏</span>
                <span className="text-xs text-neutral-400 mt-1">0 项内容</span>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-neutral-900 rounded-lg p-6">
                <IconBookmarks className="h-10 w-10 text-teal-500 mb-3" />
                <span className="text-sm font-medium text-white">我的阅读</span>
                <span className="text-xs text-neutral-400 mt-1">0 项内容</span>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">推荐内容</h2>
              <div className="bg-neutral-900 rounded-lg p-4 text-center">
                <p className="text-neutral-400 text-sm">暂无推荐内容</p>
              </div>
            </div>
          </div>
        </div>
      </MobileLayout>
    </>
  );
} 