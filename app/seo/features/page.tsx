import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';
import StructuredData from '@/components/seo/StructuredData';
import { generateSiteStructuredData } from '@/lib/seo/seo-utils';
import SeoNavigation from '@/components/seo/SeoNavigation';
import SeoFooter from '@/components/seo/SeoFooter';
import Link from 'next/link';

export const metadata: Metadata = generateMetadata(
  'SnapSeeker 功能介绍 | Features | 竞品分析和创意验证工具',
  'SnapSeeker 提供强大的竞品分析、创意验证、市场机会分析等功能，帮助产品经理和创业者快速验证产品创意。Discover the powerful features of SnapSeeker including competitor analysis, idea validation, and market opportunity analysis.',
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
      
      <h1 className="text-4xl font-bold mb-8">SnapSeeker 功能介绍 | Features</h1>
      
      <div className="space-y-16">
        {/* Feature 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">竞品分析 | Competitor Analysis</h2>
            <p className="text-lg text-gray-300 mb-6">
              全面分析同类产品的功能、定价、用户体验和市场定位，帮助您了解市场竞争格局，制定差异化策略。
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-cyan-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                自动识别竞品特点和差异
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-cyan-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                比较分析竞品定价和商业模式
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-cyan-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                发现竞品的优势和劣势
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 p-8 rounded-xl">
            <div className="h-64 flex items-center justify-center text-cyan-500 border border-cyan-800/50 rounded-lg">
              <span className="text-lg font-medium">竞品分析界面展示</span>
            </div>
          </div>
        </div>
        
        {/* Feature 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 bg-gradient-to-r from-teal-900/20 to-green-900/20 p-8 rounded-xl">
            <div className="h-64 flex items-center justify-center text-teal-500 border border-teal-800/50 rounded-lg">
              <span className="text-lg font-medium">创意验证流程示意</span>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl font-semibold mb-4 text-teal-400">创意验证 | Idea Validation</h2>
            <p className="text-lg text-gray-300 mb-6">
              通过用户需求分析、市场规模评估和问题解决匹配度，快速验证产品创意的可行性和市场潜力。
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                多维度评估创意可行性
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                用户需求痛点匹配分析
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                潜在市场规模预测
              </li>
            </ul>
          </div>
        </div>
        
        {/* Feature 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">市场机会分析 | Market Opportunity</h2>
            <p className="text-lg text-gray-300 mb-6">
              发现未被满足的市场需求和细分市场机会，帮助您找到差异化竞争优势和蓝海市场。
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                细分市场机会识别
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                未满足需求分析
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                差异化策略建议
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-8 rounded-xl">
            <div className="h-64 flex items-center justify-center text-purple-500 border border-purple-800/50 rounded-lg">
              <span className="text-lg font-medium">市场机会分析示例</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-10 text-center mt-16 mb-20">
        <h2 className="text-3xl font-bold mb-6">开始使用 SnapSeeker</h2>
        <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
          立即体验 SnapSeeker 的强大功能，抢占市场先机，提升产品成功率
        </p>
      </div>
      
      {/* SEO Footer */}
      <SeoFooter />
      
      <StructuredData data={generateSiteStructuredData()} />
    </div>
  );
} 