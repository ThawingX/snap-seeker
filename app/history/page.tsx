"use client";
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { History } from "@/components/layout/History";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MobileHistory } from "@/components/layout/MobileHistory";

export default function HistoryPage() {
  return (
    <>
      {/* Desktop Layout - hidden on mobile with CSS */}
      <AppLayout>
        <History />
      </AppLayout>
      
      {/* Mobile Layout - hidden on desktop with CSS */}
      <MobileLayout>
        <MobileHistory />
      </MobileLayout>
    </>
  );
} 