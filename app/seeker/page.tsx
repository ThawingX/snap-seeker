import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';
import { redirect } from 'next/navigation';
import StructuredData from '@/components/seo/StructuredData';
import { generateSiteStructuredData, generateProductStructuredData } from '@/lib/seo/seo-utils';

export const metadata: Metadata = generateMetadata(
  'Seeker | Find Similar Products and Analyze Competitors | SnapSeeker',
  'Seeker is the powerful product search engine from SnapSeeker that helps you find similar products, analyze competitors, and validate your ideas before development.',
  [
    seoConfig.coreKeywords,
    seoConfig.targetUserKeywords,
    seoConfig.painPointKeywords,
    seoConfig.productKeywords
  ],
  '/seeker',
  undefined,
  'en'
);

export default function SeekerPage() {
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