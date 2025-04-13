"use client";
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MobileSearchBar } from "@/components/layout/MobileSearchBar";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function DiscoverPage() {
  return (
    <>
      {/* Desktop Layout - hidden on mobile with CSS */}
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Discover Page</h1>
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
              <h1 className="text-xl font-bold ml-2">发现</h1>
            </div>
          </div>
          
          <div className="mt-4">
            <MobileSearchBar />
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="text-center">
              <p className="text-neutral-400 text-sm mb-2">尝试搜索一些内容</p>
              <p className="text-neutral-500 text-xs">使用搜索框或点击下方的麦克风图标</p>
            </div>
          </div>
        </div>
      </MobileLayout>
    </>
  );
} 