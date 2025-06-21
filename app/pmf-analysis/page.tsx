"use client";
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { IconChartBar, IconTools } from "@tabler/icons-react";
import { trackPMFAnalysisTryIt } from "@/lib/analytics";

function PMFAnalysisContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <IconChartBar className="h-16 w-16 text-primary" />
            <IconTools className="h-8 w-8 text-orange-500 absolute -top-2 -right-2" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          PMF Analysis
        </h1>
        
        <p className="text-lg text-muted-foreground mb-6">
          Product-Market Fit analysis tools are currently in development. This feature will help 
          you evaluate and optimize your product's market positioning.
        </p>
        
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-foreground mb-3">Coming Soon:</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Market fit scoring and evaluation metrics</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Customer segment analysis and targeting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Product positioning recommendations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Market opportunity assessment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>PMF improvement strategies and roadmap</span>
            </li>
          </ul>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button 
            disabled
            className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
          >
            Feature Coming Soon
          </button>
          <button 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => {
              // 触发PMF分析试用埋点
              trackPMFAnalysisTryIt({
                page: 'pmf_analysis',
                action: 'click',
                section: 'main'
              });
              console.log('User clicked Expect button');
            }}
          >
            I wanna try it!
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PMFAnalysisPage() {
  return (
    <>
      {/* Desktop Layout - hidden on mobile with CSS */}
      <AppLayout>
        <PMFAnalysisContent />
      </AppLayout>
      
      {/* Mobile Layout - hidden on desktop with CSS */}
      <MobileLayout>
        <PMFAnalysisContent />
      </MobileLayout>
    </>
  );
}