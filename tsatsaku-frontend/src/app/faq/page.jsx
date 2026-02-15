'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getContent } from '@/services/content.service';
import Spinner from '@/components/ui/Spinner';
import Footer from '@/components/layout/Footer';

const defaultFAQs = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click on the "Sign Up" button on the homepage and fill in your company details including company name, address, and contact information. Once submitted, you\'ll receive a confirmation email to verify your account.'
      },
      {
        question: 'What are the system requirements?',
        answer: 'Tsatsaku is a web-based platform that works on any modern browser (Chrome, Firefox, Safari, Edge). No installation is required. For the best experience, we recommend using the latest version of your preferred browser.'
      },
      {
        question: 'Is there a mobile app available?',
        answer: 'Currently, Tsatsaku is accessible through any mobile browser with a responsive design. A dedicated mobile app is in development and will be available soon.'
      }
    ]
  },
  {
    category: 'Purchase Orders',
    questions: [
      {
        question: 'How do I track my purchase orders?',
        answer: 'Log into your dashboard and navigate to "Purchase Orders". You can view all your orders, their current status, and detailed tracking information including status history and expected delivery dates.'
      },
      {
        question: 'Can I modify an order after it\'s placed?',
        answer: 'Orders can only be modified while in "Pending" status. Once an order is confirmed or processing, please contact our support team for any changes.'
      },
      {
        question: 'How do I download order invoices?',
        answer: 'Go to the order details page and click the "Download Invoice" button. Invoices are available in PDF format for all confirmed orders.'
      }
    ]
  },
  {
    category: 'Account & Security',
    questions: [
      {
        question: 'How do I reset my password?',
        answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a 6-digit OTP code. Enter this code to verify your identity and set a new password.'
      },
      {
        question: 'How do I update my company information?',
        answer: 'Navigate to Dashboard > Profile Settings to update your company name, address, contact person details, and location information.'
      },
      {
        question: 'Is my data secure?',
        answer: 'Yes, we use industry-standard encryption (SSL/TLS) for all data transmission. Your data is stored securely in encrypted databases with regular backups.'
      }
    ]
  },
  {
    category: 'Billing & Payments',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept various payment methods including credit/debit cards, bank transfers, and other region-specific payment options. Contact our sales team for detailed payment terms.'
      },
      {
        question: 'How do I view my billing history?',
        answer: 'Your billing history and invoices are available in the Dashboard under the billing section. You can download past invoices and view payment status.'
      }
    ]
  }
];

export default function FAQPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [faqs, setFaqs] = useState(defaultFAQs);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getContent('faq');
        if (response.success) {
          setContent(response.data);
          // Parse FAQs from content if available
          if (response.data?.faqs) {
            setFaqs(response.data.faqs);
          }
        }
      } catch (err) {
        console.error('Failed to fetch content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
              <Link href="/faq" className="text-primary font-medium">
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
            {content?.title || 'Frequently Asked Questions'}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Find answers to common questions about Tsatsaku
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-8">
              {filteredFAQs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="material-icons-outlined text-primary mr-2 text-2xl">help_outline</span>
                    {category.category}
                  </h2>
                  <div className="space-y-3">
                    {category.questions.map((item, questionIndex) => {
                      const isExpanded = expandedItems[`${categoryIndex}-${questionIndex}`];
                      return (
                        <div
                          key={questionIndex}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(categoryIndex, questionIndex)}
                            className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-medium text-gray-900 pr-4">
                              {item.question}
                            </span>
                            {isExpanded ? (
                              <span className="material-icons-outlined text-primary flex-shrink-0 text-xl">expand_less</span>
                            ) : (
                              <span className="material-icons-outlined text-muted flex-shrink-0 text-xl">expand_more</span>
                            )}
                          </button>
                          {isExpanded && (
                            <div className="p-4 bg-gray-50 border-t border-gray-200">
                              <p className="text-muted leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-icons-outlined mx-auto text-gray-300 mb-4" style={{fontSize: '48px', display: 'block'}}>help_outline</span>
              <p className="text-muted">No results found for "{searchQuery}"</p>
              <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
            </div>
          )}

          {/* Still Need Help */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-muted mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
