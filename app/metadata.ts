import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';

// Generate home page metadata with specific keywords for this page
export const metadata: Metadata = generateMetadata(
  'Competitor Analysis and Idea Validation Tool | SnapSeeker',
  'Quickly validate your product ideas, find similar products, analyze market opportunities, and avoid reinventing the wheel with SnapSeeker.',
  [
    seoConfig.coreKeywords,
    seoConfig.targetUserKeywords,
    seoConfig.painPointKeywords
  ],
  '/',
  undefined,
  'en'
); 