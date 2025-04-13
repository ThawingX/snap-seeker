import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';
import { redirect } from 'next/navigation';
import StructuredData from '@/components/seo/StructuredData';
import { generateSiteStructuredData, generateProductStructuredData } from '@/lib/seo/seo-utils';

export const metadata: Metadata = generateMetadata(
  'Snap Seeker | Product Search and Competitor Analysis Tool | SnapSnap',
  'Snap Seeker by SnapSnap helps product managers and entrepreneurs quickly find similar products, validate ideas, and analyze the competitive landscape. The ultimate product search tool.',
  [
    seoConfig.coreKeywords,
    seoConfig.targetUserKeywords,
    seoConfig.painPointKeywords,
    seoConfig.productKeywords
  ],
  '/snap-seeker',
  undefined,
  'en'
);

export default function SnapSeekerPage() {
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