import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';
import Link from 'next/link';
import StructuredData from '@/components/seo/StructuredData';
import { generateProductStructuredData } from '@/lib/seo/seo-utils';
import SeoNavigation from '@/components/seo/SeoNavigation';
import SeoFooter from '@/components/seo/SeoFooter';

export const metadata: Metadata = generateMetadata(
  'Product Idea Validation | SnapSeeker Validation Tool',
  'SnapSeeker provides powerful product idea validation features to help you validate your product ideas before development, reducing development risks.',
  [
    seoConfig.productKeywords,
    seoConfig.coreKeywords,
  ],
  '/seo/product-validation',
  undefined,
  'en'
);

export default function ProductValidationPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* SEO Navigation */}
      <SeoNavigation />
      
      <h1 className="text-4xl font-bold mb-8">Product Idea Validation</h1>
      
      <div className="bg-neutral-900 p-8 rounded-xl mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">How Idea Validation Reduces Risk</h2>
        <p className="text-lg text-gray-300">
          Validating your ideas before product development, understanding market needs and the competitive landscape can greatly reduce development risks and time costs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div className="bg-neutral-800 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Validation Steps</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-300">
            <li>Define the core value of your product and target users</li>
            <li>Search and analyze similar products</li>
            <li>Understand competitors' strengths and weaknesses</li>
            <li>Find differentiating innovation points</li>
            <li>Assess market opportunities and risks</li>
          </ol>
        </div>
        
        <div className="bg-neutral-800 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Benefits of Validation</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>Avoid reinventing the wheel, save development time</li>
            <li>Understand the competitive landscape, find differentiation advantages</li>
            <li>Validate product demand, reduce market risks</li>
            <li>Discover potential collaboration or competition opportunities</li>
            <li>Optimize product positioning and marketing strategy</li>
          </ul>
        </div>
      </div>
      
      {/* Additional Information Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Why is Product Idea Validation So Important?</h2>
        <div className="bg-neutral-900 p-8 rounded-xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-xl font-semibold mb-3 text-cyan-400">Market Research Statistics</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-cyan-500 font-bold mr-2">42%</span>
                  <p className="text-gray-300">of products fail because there is no real market need</p>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 font-bold mr-2">35%</span>
                  <p className="text-gray-300">of startups do not conduct sufficient market research before product launch</p>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 font-bold mr-2">3x</span>
                  <p className="text-gray-300">validated product ideas have three times the success rate of unvalidated ideas</p>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 md:pl-8 md:border-l border-neutral-700">
              <h3 className="text-xl font-semibold mb-3 text-cyan-400">How SnapSeeker Helps You</h3>
              <p className="text-gray-300 mb-4">
                SnapSeeker helps you validate product ideas before investing significant time and resources, analyze market opportunities, understand the competitive landscape, and find differentiation advantages.
              </p>
              <p className="text-gray-300">
                Our tools use advanced search and analysis technology to help you quickly find similar products, analyze their strengths and weaknesses, and provide valuable insights for your ideas.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-2xl p-10 text-center mb-20">
        <h2 className="text-3xl font-bold mb-6">Validate Your Product Ideas</h2>
        <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
          Use SnapSeeker to quickly validate your ideas, understand market needs and the competitive landscape, and reduce development risks.
        </p>
        <Link href="/" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium text-lg inline-block transition-colors">
          Start Validation
        </Link>
      </div>
      
      {/* SEO Footer */}
      <SeoFooter />
      
      <StructuredData data={generateProductStructuredData()} />
    </div>
  );
} 