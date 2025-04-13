import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';
import { redirect } from 'next/navigation';
import StructuredData from '@/components/seo/StructuredData';
import { generateSiteStructuredData, generateProductStructuredData } from '@/lib/seo/seo-utils';

export const metadata: Metadata = generateMetadata(
  'SnapSnap | Creator of SnapSeeker - Product Analysis Tool',
  'SnapSnap is the company behind SnapSeeker, the powerful product analysis and idea validation tool that helps product managers and entrepreneurs make better decisions.',
  [
    seoConfig.coreKeywords,
    seoConfig.targetUserKeywords,
    seoConfig.painPointKeywords,
    seoConfig.productKeywords
  ],
  '/snapsnap',
  undefined,
  'en'
);

export default function SnapSnapPage() {
  // Redirect to main page
  redirect('/');
  
  // This won't actually render, but is here for SEO
  const structuredData = [
    generateSiteStructuredData(),
    generateProductStructuredData(),
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SnapSnap',
      url: seoConfig.siteUrl,
      logo: `${seoConfig.siteUrl}/logo.png`,
      sameAs: [
        'https://twitter.com/snapsnap',
        'https://linkedin.com/company/snapsnap'
      ],
      brand: {
        '@type': 'Brand',
        name: 'SnapSeeker',
        description: 'Product analysis and idea validation tool'
      }
    }
  ];
  
  return (
    <>
      <StructuredData data={structuredData} />
    </>
  );
} 