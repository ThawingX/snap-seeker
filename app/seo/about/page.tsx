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
  '关于 SnapSeeker | About SnapSeeker | 竞品分析和创意验证工具',
  'SnapSeeker 是市场领先的竞品分析和创意验证工具，帮助产品经理、独立开发者和创业者快速验证产品想法，了解市场机会。Learn about SnapSeeker, the market-leading competitor analysis and idea validation tool for product managers, indie developers, and entrepreneurs.',
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
      
      <h1 className="text-4xl font-bold mb-8">关于 SnapSeeker | About SnapSeeker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">我们的使命 | Our Mission</h2>
          <p className="text-lg text-gray-300 mb-6">
            SnapSeeker 的使命是帮助产品经理、独立开发者和创业者快速验证他们的产品创意，了解市场竞争格局，并找到差异化竞争优势。
          </p>
          <p className="text-lg text-gray-300">
            Our mission at SnapSeeker is to help product managers, independent developers, and entrepreneurs quickly validate their product ideas, understand the competitive landscape, and find differentiation advantages.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">为什么选择 SnapSeeker | Why SnapSeeker</h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-cyan-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-lg font-medium">避免重复造轮子 | Avoid Reinventing the Wheel</p>
                <p>快速发现同类产品，了解现有解决方案。</p>
              </div>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-cyan-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-lg font-medium">市场机会分析 | Market Opportunity Analysis</p>
                <p>了解市场竞争格局，找到未被满足的需求。</p>
              </div>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-cyan-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-lg font-medium">节省时间和资源 | Save Time and Resources</p>
                <p>快速验证创意，减少研发风险。</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-2xl p-10 text-center mt-16 mb-20">
        <h2 className="text-3xl font-bold mb-6">探索 SnapSeeker 的功能</h2>
        <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
          开始使用 SnapSeeker，了解市场竞争格局，验证您的产品创意，提高产品成功率。
        </p>
      </div>
      
      {/* SEO Footer */}
      <SeoFooter />
      
      <StructuredData data={generateSiteStructuredData()} />
    </div>
  );
} 