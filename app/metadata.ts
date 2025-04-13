import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';

// Generate home page metadata with specific keywords for this page
export const metadata: Metadata = generateMetadata(
  '竞品分析和创意验证工具 | SnapSeeker | Competitor Analysis Tool',
  '使用 SnapSeeker 快速验证您的产品创意，查找同类产品，分析市场机会，并避免重复造轮子。Quickly validate your product ideas, find similar products, analyze market opportunities, and avoid reinventing the wheel with SnapSeeker.',
  [
    seoConfig.coreKeywords,
    seoConfig.targetUserKeywords,
    seoConfig.painPointKeywords
  ],
  '/',
  undefined,
  'en'
); 