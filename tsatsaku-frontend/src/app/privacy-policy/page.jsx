'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getContent } from '@/services/content.service';
import Spinner from '@/components/ui/Spinner';
import Footer from '@/components/layout/Footer';

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getContent('privacy');
        if (response.success) {
          setContent(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary">
              Tsatsaku
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-primary transition-colors">
                FAQ
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-primary transition-colors">
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {content?.title || 'Privacy Policy'}
          </h1>
          <p className="text-white/80">
            Last updated: {new Date(content?.updatedAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content?.content || getDefaultPrivacy() }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function getDefaultPrivacy() {
  return `
    <h2>1. Introduction</h2>
    <p>At Tsatsaku ("we", "our", or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>

    <h2>2. Information We Collect</h2>
    <h3>Personal Information</h3>
    <p>We may collect personal information that you provide directly to us, including:</p>
    <ul>
      <li>Name and contact information (email, phone number, address)</li>
      <li>Company information (company name, address, registration details)</li>
      <li>Account credentials (email, password)</li>
      <li>Payment information (processed through secure payment processors)</li>
    </ul>

    <h3>Automatically Collected Information</h3>
    <p>When you use our Service, we may automatically collect:</p>
    <ul>
      <li>Device information (browser type, operating system, device identifiers)</li>
      <li>Usage data (pages visited, time spent, features used)</li>
      <li>IP address and location data</li>
      <li>Cookies and similar tracking technologies</li>
    </ul>

    <h2>3. How We Use Your Information</h2>
    <p>We use the information we collect to:</p>
    <ul>
      <li>Provide, maintain, and improve our Service</li>
      <li>Process transactions and send related information</li>
      <li>Send administrative messages, updates, and security alerts</li>
      <li>Respond to your comments, questions, and support requests</li>
      <li>Monitor and analyze trends, usage, and activities</li>
      <li>Detect, investigate, and prevent fraudulent transactions</li>
      <li>Personalize and improve your experience</li>
    </ul>

    <h2>4. Information Sharing</h2>
    <p>We may share your information in the following circumstances:</p>
    <ul>
      <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
      <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
      <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
      <li><strong>With Your Consent:</strong> When you have given us permission to share</li>
    </ul>

    <h2>5. Data Security</h2>
    <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
    <ul>
      <li>SSL/TLS encryption for data transmission</li>
      <li>Encrypted storage for sensitive data</li>
      <li>Regular security assessments and audits</li>
      <li>Access controls and authentication measures</li>
    </ul>

    <h2>6. Data Retention</h2>
    <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.</p>

    <h2>7. Your Rights</h2>
    <p>Depending on your location, you may have certain rights regarding your personal information:</p>
    <ul>
      <li>Access and receive a copy of your data</li>
      <li>Rectify inaccurate or incomplete data</li>
      <li>Request deletion of your data</li>
      <li>Object to or restrict processing of your data</li>
      <li>Data portability</li>
      <li>Withdraw consent</li>
    </ul>

    <h2>8. Cookies</h2>
    <p>We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.</p>

    <h2>9. Third-Party Links</h2>
    <p>Our Service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.</p>

    <h2>10. Children's Privacy</h2>
    <p>Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18.</p>

    <h2>11. Changes to This Policy</h2>
    <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>

    <h2>12. Contact Us</h2>
    <p>If you have any questions about this Privacy Policy, please contact us:</p>
    <ul>
      <li>Email: privacy@tsatsaku.com</li>
      <li>Address: 123 Business Street, Suite 100, New York, NY 10001</li>
    </ul>
  `;
}
