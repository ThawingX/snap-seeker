import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';
import { redirect } from 'next/navigation';
import StructuredData from '@/components/seo/StructuredData';
import { generateSiteStructuredData, generateProductStructuredData } from '@/lib/seo/seo-utils';

export const metadata: Metadata = generateMetadata(
  'Product Seek | Find Similar Products and Validate Ideas | SnapSeeker',
  'Product Seek is the powerful search tool from SnapSeeker that helps you find similar products, validate your ideas, and analyze market opportunities before development.',
  [
    seoConfig.coreKeywords,
    seoConfig.targetUserKeywords,
    seoConfig.painPointKeywords,
    seoConfig.productKeywords
  ],
  '/product-seek',
  undefined,
  'en'
);

export default function ProductSeekPage() {
  // Redirect to main page
  redirect('/');
  
  // This won't actually render, but is here for SEO
  const structuredData = [
    generateSiteStructuredData(),
    generateProductStructuredData()
  ];
  
  return (
    <>
      <StructuredData data={structuredData} />
    </>
  );
} 