import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';
import StructuredData from '@/components/seo/StructuredData';
import { generateSiteStructuredData } from '@/lib/seo/seo-utils';
import SeoNavigation from '@/components/seo/SeoNavigation';
import SeoFooter from '@/components/seo/SeoFooter';
import Link from 'next/link';

// Generate metadata specific to the about page
export const metadata: Metadata = generateMetadata(
  'About SnapSeeker | Competitor Analysis and Idea Validation Tool',
  'SnapSeeker is the market-leading competitor analysis and idea validation tool, helping product managers, independent developers, and entrepreneurs quickly validate product ideas and understand market opportunities.',
  [
    seoConfig.productKeywords,
    seoConfig.coreKeywords,
  ],
  '/seo/about',
  undefined,
  'en'
);

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* SEO Navigation */}
      <SeoNavigation />
      
      <h1 className="text-4xl font-bold mb-8">About SnapSeeker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Our Mission</h2>
          <p className="text-lg text-gray-300 mb-6">
            Our mission at SnapSeeker is to help product managers, independent developers, and entrepreneurs quickly validate their product ideas, understand the competitive landscape, and find differentiation advantages.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Why SnapSeeker</h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-cyan-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-lg font-medium">Avoid Reinventing the Wheel</p>
                <p>Quickly discover similar products and understand existing solutions.</p>
              </div>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-cyan-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-lg font-medium">Market Opportunity Analysis</p>
                <p>Understand the competitive landscape and find unmet needs.</p>
              </div>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-cyan-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-lg font-medium">Save Time and Resources</p>
                <p>Quickly validate ideas and reduce development risks.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-2xl p-10 text-center mt-16 mb-20">
        <h2 className="text-3xl font-bold mb-6">Explore SnapSeeker Features</h2>
        <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
          Start using SnapSeeker to understand the competitive landscape, validate your product ideas, and improve your product's success rate.
        </p>
      </div>
      
      {/* SEO Footer */}
      <SeoFooter />
      
      <StructuredData data={generateSiteStructuredData()} />
    </div>
  );
} 