import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';

// Default SEO metadata for all marketing pages
export const metadata: Metadata = generateMetadata(
  seoConfig.defaultTitle,
  seoConfig.defaultDescription,
  [
    seoConfig.coreKeywords,
    seoConfig.productKeywords
  ],
  '/seo',
  undefined,
  'en'
);

export default function SeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {children}
    </div>
  );
} 