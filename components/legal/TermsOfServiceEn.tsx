import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const TermsOfServiceEn = () => {
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
          Terms of Service
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
              Welcome to SnapSeeker! These Terms of Service ("Terms") govern your use of our website and services.
              By accessing or using SnapSeeker, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Service Description</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              SnapSeeker is a product analysis and search platform that provides:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Product search and discovery tools</li>
              <li>Market analysis and insights</li>
              <li>Competitor research capabilities</li>
              <li>Data visualization and reporting features</li>
              <li>User account management and personalization</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">User Accounts</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">Account Registration</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the security of your account credentials</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>You must be at least 13 years old to create an account</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">Account Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>You are solely responsible for all activities under your account</li>
                  <li>You agree to use the service only for lawful purposes</li>
                  <li>You will not share your account with others</li>
                  <li>You will keep your contact information up to date</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Acceptable Use Policy</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You agree not to use SnapSeeker to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Use automated tools to access the service without permission</li>
              <li>Collect user information without consent</li>
              <li>Impersonate others or provide false information</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Intellectual Property Rights</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">Our Content</h3>
                <p className="text-gray-300 leading-relaxed">
                  All content, features, and functionality of SnapSeeker, including but not limited to text, graphics, logos, icons, images, audio clips, and software, are owned by SnapSeeker or its licensors and are protected by copyright, trademark, and other intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">User Content</h3>
                <p className="text-gray-300 leading-relaxed">
                  You retain ownership of any content you submit to SnapSeeker. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content in connection with our services.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Privacy and Data Protection</h2>
            <p className="text-gray-300 leading-relaxed">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.
            </p>
          </section>

          {/* Service Availability */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Service Availability</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>We strive to maintain high service availability but cannot guarantee uninterrupted access</li>
              <li>We may temporarily suspend service for maintenance, updates, or technical issues</li>
              <li>We reserve the right to modify, suspend, or discontinue any part of the service</li>
              <li>We will provide reasonable notice for planned maintenance when possible</li>
            </ul>
          </section>

          {/* Payment and Billing */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Payment and Billing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">Subscription Plans</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Some features may require a paid subscription</li>
                  <li>Subscription fees are billed in advance on a recurring basis</li>
                  <li>All fees are non-refundable unless otherwise stated</li>
                  <li>We reserve the right to change pricing with advance notice</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">Cancellation</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>You may cancel your subscription at any time</li>
                  <li>Cancellation will take effect at the end of your current billing period</li>
                  <li>You will retain access to paid features until the end of your billing period</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Disclaimers</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">Service "As Is"</h3>
                <p className="text-gray-300 leading-relaxed">
                  SnapSeeker is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-cyan-400">Data Accuracy</h3>
                <p className="text-gray-300 leading-relaxed">
                  While we strive to provide accurate and up-to-date information, we do not guarantee the accuracy, completeness, or reliability of any data or analysis provided through our service.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              To the maximum extent permitted by law, SnapSeeker shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from your use of the service.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Termination</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>You may terminate your account at any time by contacting us</li>
              <li>We may suspend or terminate your account for violation of these Terms</li>
              <li>Upon termination, your right to use the service will cease immediately</li>
              <li>We may retain certain information as required by law or for legitimate business purposes</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where SnapSeeker operates, without regard to conflict of law principles.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through our website. Your continued use of the service after changes become effective constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
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

export default TermsOfServiceEn;