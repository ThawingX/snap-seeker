"use client";
import React from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MobileDashboard } from "@/components/layout/MobileDashboard";

export default function Home() {
  return (
    <>
      {/* Desktop Layout - hidden on mobile with CSS */}
      <AppLayout>
        <Dashboard />
      </AppLayout>
      
      {/* Mobile Layout - hidden on desktop with CSS */}
      <MobileLayout>
        <MobileDashboard />
      </MobileLayout>
    </>
  );
}
