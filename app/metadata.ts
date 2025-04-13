import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';

// Generate home page metadata with specific keywords for this page
export const metadata: Metadata = generateMetadata(
  'SnapSeeker | Snap Seeker | Product Search & Competitor Analysis Tool',
  'SnapSeeker (Snap Seeker) helps you quickly validate product ideas, find similar products, analyze market opportunities, and avoid reinventing the wheel. The ultimate seeker and product search tool by SnapSnap.',
  [
    seoConfig.coreKeywords,
    seoConfig.targetUserKeywords,
    seoConfig.painPointKeywords,
    seoConfig.productKeywords
  ],
  '/',
  undefined,
  'en'
); 