'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getContent } from '@/services/content.service';
import Spinner from '@/components/ui/Spinner';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getContent('about');
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
              <Link href="/about" className="text-primary font-medium">
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
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {content?.title || 'About Us'}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Learn more about Tsatsaku and our mission to simplify inventory management
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Content from CMS */}
          <div 
            className="prose prose-lg max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: content?.content || getDefaultContent() }}
          />

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons-outlined text-primary" style={{fontSize: '32px'}}>business</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">500+</p>
              <p className="text-muted">Businesses Served</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons-outlined text-success" style={{fontSize: '32px'}}>group</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">10,000+</p>
              <p className="text-muted">Active Users</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-info-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons-outlined text-info" style={{fontSize: '32px'}}>public</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">25+</p>
              <p className="text-muted">Countries</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-warning-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons-outlined text-warning" style={{fontSize: '32px'}}>emoji_events</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">99%</p>
              <p className="text-muted">Customer Satisfaction</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that trust Tsatsaku for their inventory management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Create Account
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function getDefaultContent() {
  return `
    <h2>Our Story</h2>
    <p>Tsatsaku was founded with a simple mission: to make inventory management accessible and efficient for businesses of all sizes. We understand the challenges that come with tracking products, managing orders, and maintaining accurate stock levels.</p>
    
    <h2>Our Mission</h2>
    <p>We strive to provide innovative solutions that help businesses streamline their operations, reduce costs, and improve customer satisfaction. Our platform combines cutting-edge technology with user-friendly design to deliver a seamless experience.</p>
    
    <h2>Our Values</h2>
    <ul>
      <li><strong>Innovation:</strong> We continuously improve our platform to meet evolving business needs.</li>
      <li><strong>Reliability:</strong> Our systems are built for stability and performance.</li>
      <li><strong>Customer Focus:</strong> We listen to our users and prioritize their success.</li>
      <li><strong>Integrity:</strong> We operate with transparency and honesty in all our dealings.</li>
    </ul>
  `;
}
