import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';
import Link from 'next/link';
import StructuredData from '@/components/seo/StructuredData';
import { generateProductStructuredData } from '@/lib/seo/seo-utils';
import SeoNavigation from '@/components/seo/SeoNavigation';
import SeoFooter from '@/components/seo/SeoFooter';

export const metadata: Metadata = generateMetadata(
  '产品创意验证 | Product Idea Validation | SnapSeeker验证工具',
  'SnapSeeker提供强大的产品创意验证功能，帮助您在开发前验证产品想法，降低开发风险。Use SnapSeeker to validate your product ideas before development.',
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
      
      <h1 className="text-4xl font-bold mb-8">产品创意验证 | Product Idea Validation</h1>
      
      <div className="bg-neutral-900 p-8 rounded-xl mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">创意验证如何减少风险</h2>
        <p className="text-lg text-gray-300 mb-6">
          在产品开发前验证您的创意，了解市场需求和竞争格局，可以大大降低开发风险和时间成本。
        </p>
        <p className="text-lg text-gray-300">
          Validating your ideas before product development, understanding market needs and the competitive landscape can greatly reduce development risks and time costs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div className="bg-neutral-800 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">验证产品创意的步骤 | Validation Steps</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-300">
            <li>定义产品核心价值和目标用户</li>
            <li>搜索和分析同类产品</li>
            <li>了解竞争对手优势和劣势</li>
            <li>找到产品差异化创新点</li>
            <li>评估市场机会和风险</li>
          </ol>
        </div>
        
        <div className="bg-neutral-800 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">验证创意的好处 | Benefits of Validation</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>避免重复造轮子，节省开发时间</li>
            <li>了解市场竞争格局，找到差异化优势</li>
            <li>验证产品需求，减少市场风险</li>
            <li>发现潜在合作或竞争机会</li>
            <li>优化产品定位和市场策略</li>
          </ul>
        </div>
      </div>
      
      {/* Additional Information Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">为什么产品创意验证如此重要？</h2>
        <div className="bg-neutral-900 p-8 rounded-xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-xl font-semibold mb-3 text-cyan-400">市场研究统计</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-cyan-500 font-bold mr-2">42%</span>
                  <p className="text-gray-300">的产品失败是因为没有真正的市场需求</p>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 font-bold mr-2">35%</span>
                  <p className="text-gray-300">的新创企业在产品启动前没有进行充分的市场调研</p>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 font-bold mr-2">3x</span>
                  <p className="text-gray-300">经过验证的产品创意成功率是未验证创意的三倍</p>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 md:pl-8 md:border-l border-neutral-700">
              <h3 className="text-xl font-semibold mb-3 text-cyan-400">SnapSeeker 如何帮助您</h3>
              <p className="text-gray-300 mb-4">
                SnapSeeker 帮助您在投入大量时间和资源前验证产品创意，分析市场机会，了解竞争格局，找到差异化优势。
              </p>
              <p className="text-gray-300">
                我们的工具使用先进的搜索和分析技术，帮助您快速找到同类产品，分析其优势和劣势，为您的创意提供有价值的洞察。
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-2xl p-10 text-center mb-20">
        <h2 className="text-3xl font-bold mb-6">验证您的产品创意</h2>
        <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
          使用 SnapSeeker 快速验证您的创意，了解市场需求和竞争格局，降低开发风险。
        </p>
        <Link href="/" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium text-lg inline-block transition-colors">
          开始验证
        </Link>
      </div>
      
      {/* SEO Footer */}
      <SeoFooter />
      
      <StructuredData data={generateProductStructuredData()} />
    </div>
  );
} 