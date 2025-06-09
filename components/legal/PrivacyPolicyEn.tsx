import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicyEn = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Title */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-gray-400 text-lg">
          Last updated: {new Date().toLocaleDateString('en-US')}
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              Welcome to SnapSeeker! We take your privacy seriously. This Privacy Policy explains how we collect, use, store, and protect your personal information.
              By using our services, you agree to the practices described in this Privacy Policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Name and contact information (email address)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Invitation codes (if applicable)</li>
                  <li>Profile information</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Search queries and product analysis requests</li>
                  <li>Usage patterns and preference settings</li>
                  <li>Device information and technical data</li>
                  <li>IP address and location information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">How We Use Information</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your search requests and generate analysis reports</li>
              <li>Communicate with you about service updates and support</li>
              <li>Personalize your user experience</li>
              <li>Ensure platform security and prevent abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Information Sharing</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties, except:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>With your explicit consent</li>
              <li>To trusted third-party service providers necessary for service delivery</li>
              <li>When required by law or to protect our rights</li>
              <li>In case of business transfer or merger</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement industry-standard security measures to protect your personal information, including encrypted transmission, secure storage, and access controls.
              However, please note that no method of internet transmission or electronic storage is 100% secure.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Cookies and Tracking Technologies</h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies and similar technologies to improve your browsing experience, analyze website usage, and provide personalized content.
              You can control cookie usage through your browser settings.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Access and view your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your personal information</li>
              <li>Restrict or object to information processing</li>
              <li>Data portability</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Data Retention</h2>
            <p className="text-gray-300 leading-relaxed">
              We retain your personal information only for as long as necessary to achieve the collection purposes or meet legal requirements.
              When information is no longer needed, we will securely delete or anonymize it.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Third-Party Links</h2>
            <p className="text-gray-300 leading-relaxed">
              Our services may contain links to third-party websites. We are not responsible for the privacy practices of these websites.
              We recommend reviewing the privacy policies of any third-party websites you visit.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.
              If we discover we have collected such information, we will delete it immediately.
            </p>
          </section>

          {/* Policy Updates */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Policy Updates</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Significant changes will be communicated via email or website notification.
              Continued use of our services indicates acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-300">Email: xdylanlong@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyEn;