"use client";
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { IconBulb, IconTools } from "@tabler/icons-react";
import { trackCompetitorPromptAnalysisTryIt } from "@/lib/analytics";

function CompetitorAnalysisContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <IconBulb className="h-16 w-16 text-primary" />
            <IconTools className="h-8 w-8 text-orange-500 absolute -top-2 -right-2" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          Competitor Prompt Analysis
        </h1>

        <p className="text-lg text-muted-foreground mb-6">
          This feature is currently under development. It will provide comprehensive analysis
          of competitor features through advanced prompt engineering techniques.
        </p>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-foreground mb-3">Coming Soon:</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>AI-powered competitor feature extraction and analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Intelligent prompt decomposition for feature comparison</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Automated competitive intelligence reports</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Strategic insights and recommendations</span>
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
              // 触发竞争对手分析试用埋点
              trackCompetitorPromptAnalysisTryIt({
                page: 'competitor_analysis',
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

export default function CompetitorAnalysisPage() {
  return (
    <>
      {/* Desktop Layout - hidden on mobile with CSS */}
      <AppLayout>
        <CompetitorAnalysisContent />
      </AppLayout>

      {/* Mobile Layout - hidden on desktop with CSS */}
      <MobileLayout>
        <CompetitorAnalysisContent />
      </MobileLayout>
    </>
  );
}