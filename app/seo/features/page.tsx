import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';
import StructuredData from '@/components/seo/StructuredData';
import { generateSiteStructuredData } from '@/lib/seo/seo-utils';
import SeoNavigation from '@/components/seo/SeoNavigation';
import SeoFooter from '@/components/seo/SeoFooter';
import Link from 'next/link';

export const metadata: Metadata = generateMetadata(
  'SnapSeeker Features | Competitor Analysis and Idea Validation Tool',
  'SnapSeeker provides powerful features including competitor analysis, idea validation, and market opportunity analysis to help product managers and entrepreneurs quickly validate product ideas.',
  [
    seoConfig.productKeywords,
    seoConfig.coreKeywords,
  ],
  '/seo/features',
  undefined,
  'en'
);

export default function FeaturesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* SEO Navigation */}
      <SeoNavigation />
      
      <h1 className="text-4xl font-bold mb-8">SnapSeeker Features</h1>
      
      <div className="space-y-16">
        {/* Feature 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Competitor Analysis</h2>
            <p className="text-lg text-gray-300 mb-6">
              Comprehensive analysis of similar products' features, pricing, user experience, and market positioning to help you understand the competitive landscape and develop differentiation strategies.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-cyan-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Automatic identification of competitor features and differences
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-cyan-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Comparative analysis of pricing and business models
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-cyan-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Discover strengths and weaknesses of competitors
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 p-8 rounded-xl">
            <div className="h-64 flex items-center justify-center text-cyan-500 border border-cyan-800/50 rounded-lg">
              <span className="text-lg font-medium">Competitor Analysis Interface</span>
            </div>
          </div>
        </div>
        
        {/* Feature 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 bg-gradient-to-r from-teal-900/20 to-green-900/20 p-8 rounded-xl">
            <div className="h-64 flex items-center justify-center text-teal-500 border border-teal-800/50 rounded-lg">
              <span className="text-lg font-medium">Idea Validation Process</span>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl font-semibold mb-4 text-teal-400">Idea Validation</h2>
            <p className="text-lg text-gray-300 mb-6">
              Quickly validate your product idea's feasibility and market potential through user needs analysis, market size assessment, and problem-solution fit.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Multi-dimensional assessment of idea feasibility
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                User needs and pain points matching analysis
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Potential market size prediction
              </li>
            </ul>
          </div>
        </div>
        
        {/* Feature 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Market Opportunity Analysis</h2>
            <p className="text-lg text-gray-300 mb-6">
              Discover unmet market needs and niche market opportunities to help you find differentiation advantages and blue ocean markets.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Niche market opportunity identification
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Unmet needs analysis
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Differentiation strategy recommendations
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-8 rounded-xl">
            <div className="h-64 flex items-center justify-center text-purple-500 border border-purple-800/50 rounded-lg">
              <span className="text-lg font-medium">Market Opportunity Analysis Example</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-10 text-center mt-16 mb-20">
        <h2 className="text-3xl font-bold mb-6">Start Using SnapSeeker</h2>
        <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
          Experience SnapSeeker's powerful features now, gain market advantages, and increase your product's success rate
        </p>
      </div>
      
      {/* SEO Footer */}
      <SeoFooter />
      
      <StructuredData data={generateSiteStructuredData()} />
    </div>
  );
} 