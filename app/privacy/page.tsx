import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo/seo-utils';
import seoConfig from '@/lib/seo/seo-config';
import PrivacyPolicyEn from '@/components/legal/PrivacyPolicyEn';

export const metadata: Metadata = generateMetadata(
  'Privacy Policy | SnapSeeker',
  'Learn how SnapSeeker protects your privacy and handles your personal data. Our comprehensive privacy policy explains data collection, usage, and your rights.',
  [
    {
      keywords: [
        { zh: '隐私政策', en: 'privacy policy' },
        { zh: '数据保护', en: 'data protection' },
        { zh: '用户隐私', en: 'user privacy' },
        { zh: '个人信息', en: 'personal information' }
      ]
    }
  ],
  '/privacy',
  undefined,
  'en'
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PrivacyPolicyEn />
    </div>
  );
}