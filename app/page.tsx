"use client";
import React from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MobileDashboard } from "@/components/layout/MobileDashboard";
import StructuredData from "@/components/seo/StructuredData";
import { generateProductStructuredData, generateSiteStructuredData } from "@/lib/seo/seo-utils";
import CanonicalLink from "@/components/seo/CanonicalLink";

export default function Home() {
  // Combine multiple structured data objects
  const structuredData = [
    generateSiteStructuredData(),
    generateProductStructuredData()
  ];
  
  return (
    <>
      {/* SEO optimizations */}
      <CanonicalLink path="/" />
      
      {/* Desktop Layout - hidden on mobile with CSS */}
      <AppLayout>
        <Dashboard />
      </AppLayout>
      
      {/* Mobile Layout - hidden on desktop with CSS */}
      <MobileLayout>
        <MobileDashboard />
      </MobileLayout>
      
      {/* Add structured data */}
      <StructuredData data={structuredData} />
    </>
  );
}
