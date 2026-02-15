'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getContent } from '@/services/content.service';
import Spinner from '@/components/ui/Spinner';
import Footer from '@/components/layout/Footer';

export default function TermsConditionsPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getContent('terms');
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
            {content?.title || 'Terms and Conditions'}
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
            dangerouslySetInnerHTML={{ __html: content?.content || getDefaultTerms() }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function getDefaultTerms() {
  return `
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing and using the Tsatsaku platform ("Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our Service.</p>

    <h2>2. Description of Service</h2>
    <p>Tsatsaku provides an inventory management platform that allows businesses to track products, manage purchase orders, and coordinate with warehouses and ports. The Service is provided "as is" and we reserve the right to modify, suspend, or discontinue the Service at any time.</p>

    <h2>3. User Accounts</h2>
    <p>To access certain features of the Service, you must register for an account. You agree to:</p>
    <ul>
      <li>Provide accurate, current, and complete information during registration</li>
      <li>Maintain and update your information to keep it accurate</li>
      <li>Maintain the security of your password and account</li>
      <li>Accept responsibility for all activities under your account</li>
      <li>Notify us immediately of any unauthorized use</li>
    </ul>

    <h2>4. User Conduct</h2>
    <p>You agree not to:</p>
    <ul>
      <li>Use the Service for any unlawful purpose</li>
      <li>Attempt to gain unauthorized access to our systems</li>
      <li>Interfere with or disrupt the Service</li>
      <li>Transmit any viruses or malicious code</li>
      <li>Collect or harvest user data without consent</li>
    </ul>

    <h2>5. Intellectual Property</h2>
    <p>The Service and its original content, features, and functionality are owned by Tsatsaku and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>

    <h2>6. Privacy</h2>
    <p>Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding your personal information.</p>

    <h2>7. Termination</h2>
    <p>We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.</p>

    <h2>8. Limitation of Liability</h2>
    <p>In no event shall Tsatsaku, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>

    <h2>9. Changes to Terms</h2>
    <p>We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on the platform. Your continued use of the Service after such modifications constitutes acceptance of the updated terms.</p>

    <h2>10. Contact Us</h2>
    <p>If you have any questions about these Terms, please contact us at:</p>
    <ul>
      <li>Email: legal@tsatsaku.com</li>
      <li>Address: 123 Business Street, Suite 100, New York, NY 10001</li>
    </ul>
  `;
}
