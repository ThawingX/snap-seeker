import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';
import Link from 'next/link';
import StructuredData from '@/components/seo/StructuredData';
import { generateProductStructuredData } from '@/lib/seo/seo-utils';
import SeoNavigation from '@/components/seo/SeoNavigation';
import SeoFooter from '@/components/seo/SeoFooter';

export const metadata: Metadata = generateMetadata(
  '竞品分析 | Competitor Analysis | SnapSeeker产品分析工具',
  'SnapSeeker提供强大的竞品分析功能，帮助您了解市场竞争格局，找到差异化优势。Use SnapSeeker to analyze competitors and find your unique market position.',
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
      
      <h1 className="text-4xl font-bold mb-8">竞品分析 | Competitor Analysis</h1>
      
      <div className="bg-neutral-900 p-8 rounded-xl mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">竞品分析如何帮助您的业务</h2>
        <p className="text-lg text-gray-300 mb-6">
          了解竞争对手的产品、策略和市场定位，可以帮助您找到差异化优势，避免常见陷阱，并抓住市场机会。
        </p>
        <p className="text-lg text-gray-300">
          Understanding competitors' products, strategies, and market positioning can help you find differentiation advantages, avoid common pitfalls, and seize market opportunities.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-neutral-800 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-3 text-white">市场洞察</h3>
          <p className="text-gray-300">了解市场趋势和用户需求，找到产品创新点。</p>
        </div>
        <div className="bg-neutral-800 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-3 text-white">产品差异化</h3>
          <p className="text-gray-300">分析竞争对手产品特点，找到差异化竞争优势。</p>
        </div>
        <div className="bg-neutral-800 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-3 text-white">风险降低</h3>
          <p className="text-gray-300">了解市场现状，降低产品开发和市场推广风险。</p>
        </div>
      </div>
      
      {/* Workflow Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">竞品分析流程 | Analysis Workflow</h2>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="bg-neutral-900 p-6 rounded-lg mb-4 md:mb-0 md:mr-4 flex-1 text-center">
            <div className="bg-teal-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-teal-500 font-bold text-xl">1</span>
            </div>
            <h3 className="font-medium mb-2">输入产品关键词</h3>
            <p className="text-sm text-gray-400">描述您的产品创意或想要分析的市场</p>
          </div>
          <div className="hidden md:block text-gray-500">→</div>
          <div className="bg-neutral-900 p-6 rounded-lg mb-4 md:mb-0 md:mx-4 flex-1 text-center">
            <div className="bg-teal-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-teal-500 font-bold text-xl">2</span>
            </div>
            <h3 className="font-medium mb-2">分析竞争对手</h3>
            <p className="text-sm text-gray-400">SnapSeeker 自动查询并分析同类产品</p>
          </div>
          <div className="hidden md:block text-gray-500">→</div>
          <div className="bg-neutral-900 p-6 rounded-lg flex-1 text-center">
            <div className="bg-teal-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-teal-500 font-bold text-xl">3</span>
            </div>
            <h3 className="font-medium mb-2">获取详细报告</h3>
            <p className="text-sm text-gray-400">了解市场机会和差异化竞争点</p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-2xl p-10 text-center mb-20">
        <h2 className="text-3xl font-bold mb-6">开始分析您的竞争对手</h2>
        <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
          使用 SnapSeeker 快速了解市场格局，找到竞争优势，避免踏入竞争激烈的红海市场。
        </p>
        <Link href="/" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-medium text-lg inline-block transition-colors">
          开始分析
        </Link>
      </div>
      
      {/* SEO Footer */}
      <SeoFooter />
      
      <StructuredData data={generateProductStructuredData()} />
    </div>
  );
} 