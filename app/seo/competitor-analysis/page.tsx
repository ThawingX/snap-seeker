import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';
import Link from 'next/link';
import StructuredData from '@/components/seo/StructuredData';
import { generateProductStructuredData } from '@/lib/seo/seo-utils';
import SeoNavigation from '@/components/seo/SeoNavigation';
import SeoFooter from '@/components/seo/SeoFooter';

export const metadata: Metadata = generateMetadata(
  'Competitor Analysis | SnapSeeker Product Analysis Tool',
  'SnapSeeker provides powerful competitor analysis features to help you understand the competitive landscape and find your differentiation advantages.',
  [
    seoConfig.productKeywords,
    seoConfig.coreKeywords,
  ],
  '/seo/competitor-analysis',
  undefined,
  'en'
);

export default function CompetitorAnalysisPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* SEO Navigation */}
      <SeoNavigation />
      
      <h1 className="text-4xl font-bold mb-8">Competitor Analysis</h1>
      
      <div className="bg-neutral-900 p-8 rounded-xl mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">How Competitor Analysis Helps Your Business</h2>
        <p className="text-lg text-gray-300">
          Understanding competitors' products, strategies, and market positioning can help you find differentiation advantages, avoid common pitfalls, and seize market opportunities.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-neutral-800 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-3 text-white">Market Insights</h3>
          <p className="text-gray-300">Understand market trends and user needs to find product innovation points.</p>
        </div>
        <div className="bg-neutral-800 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-3 text-white">Product Differentiation</h3>
          <p className="text-gray-300">Analyze competitors' product features to find differentiation advantages.</p>
        </div>
        <div className="bg-neutral-800 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-3 text-white">Risk Reduction</h3>
          <p className="text-gray-300">Understand the current market to reduce product development and marketing risks.</p>
        </div>
      </div>
      
      {/* Workflow Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Analysis Workflow</h2>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="bg-neutral-900 p-6 rounded-lg mb-4 md:mb-0 md:mr-4 flex-1 text-center">
            <div className="bg-teal-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-teal-500 font-bold text-xl">1</span>
            </div>
            <h3 className="font-medium mb-2">Enter Product Keywords</h3>
            <p className="text-sm text-gray-400">Describe your product idea or the market you want to analyze</p>
          </div>
          <div className="hidden md:block text-gray-500">→</div>
          <div className="bg-neutral-900 p-6 rounded-lg mb-4 md:mb-0 md:mx-4 flex-1 text-center">
            <div className="bg-teal-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-teal-500 font-bold text-xl">2</span>
            </div>
            <h3 className="font-medium mb-2">Analyze Competitors</h3>
            <p className="text-sm text-gray-400">SnapSeeker automatically finds and analyzes similar products</p>
          </div>
          <div className="hidden md:block text-gray-500">→</div>
          <div className="bg-neutral-900 p-6 rounded-lg flex-1 text-center">
            <div className="bg-teal-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-teal-500 font-bold text-xl">3</span>
            </div>
            <h3 className="font-medium mb-2">Get Detailed Report</h3>
            <p className="text-sm text-gray-400">Understand market opportunities and differentiation points</p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-2xl p-10 text-center mb-20">
        <h2 className="text-3xl font-bold mb-6">Start Analyzing Your Competitors</h2>
        <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
          Use SnapSeeker to quickly understand the market landscape, find competitive advantages, and avoid entering highly competitive red ocean markets.
        </p>
        <Link href="/" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-medium text-lg inline-block transition-colors">
          Start Analysis
        </Link>
      </div>
      
      {/* SEO Footer */}
      <SeoFooter />
      
      <StructuredData data={generateProductStructuredData()} />
    </div>
  );
} 