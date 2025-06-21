"use client";
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { IconTarget, IconTools } from "@tabler/icons-react";
import { trackProductMarketingTryIt } from "@/lib/analytics";

function ProductMarketingContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <IconTarget className="h-16 w-16 text-primary" />
            <IconTools className="h-8 w-8 text-orange-500 absolute -top-2 -right-2" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Product Marketing Context
        </h1>
        
        <p className="text-lg text-muted-foreground mb-6">
          Customized product marketing context generation is under development. This feature will 
          provide tailored marketing strategies and messaging frameworks.
        </p>
        
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-foreground mb-3">Coming Soon:</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>AI-powered marketing message generation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Target audience persona development</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Brand positioning and value proposition crafting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Marketing campaign strategy recommendations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Content marketing context and templates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Competitive messaging differentiation</span>
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
            className=" cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => {
              // 触发产品营销试用埋点
              trackProductMarketingTryIt({
                page: 'product_marketing',
                feature_status: 'coming_soon',
                user_interest: 'high'
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

export default function ProductMarketingPage() {
  return (
    <>
      {/* Desktop Layout - hidden on mobile with CSS */}
      <AppLayout>
        <ProductMarketingContent />
      </AppLayout>
      
      {/* Mobile Layout - hidden on desktop with CSS */}
      <MobileLayout>
        <ProductMarketingContent />
      </MobileLayout>
    </>
  );
}