import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';
import TermsOfService from '@/components/legal/TermsOfService';

export const metadata: Metadata = generateMetadata(
  'Terms of Service | SnapSeeker',
  'Read SnapSeeker\'s terms of service to understand your rights and responsibilities when using our product search and competitor analysis platform.',
  [
    {
      keywords: [
        { zh: '服务条款', en: 'terms of service' },
        { zh: '用户协议', en: 'user agreement' },
        { zh: '条款和条件', en: 'terms and conditions' },
        { zh: '服务条款', en: 'service terms' }
      ]
    }
  ],
  '/terms',
  undefined,
  'en'
);

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TermsOfService />
    </div>
  );
}