import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import authService from '../services/authService';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import api from '../services/api';
import showToast from '../utils/toast';

function FAQPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState(new Set());

  useEffect(() => {
    checkAuth();
    loadFAQs();
  }, []);

  const checkAuth = async () => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  };

  const loadFAQs = async () => {
    try {
      const response = await api.get('/content/faq');
      if (response.data && response.data.data) {
        setFaqs(response.data.data.faqs || []);
      }
    } catch (error) {
      console.error('Error loading FAQ content:', error);
      // Use default FAQs if API fails
      setFaqs([
        {
          id: 1,
          category: 'Getting Started',
          question: 'How do I create an account on Tsatsaku?',
          answer: 'To create an account, click on the "Register" button on the login page. Fill in your email, password, and basic information. You will receive an email verification link to activate your account.'
        },
        {
          id: 2,
          category: 'Getting Started',
          question: 'What is Tsatsaku and how can it help my business?',
          answer: 'Tsatsaku is a comprehensive Trade-as-a-Service platform that helps businesses manage their purchase orders, inventory, and buyer relationships. It streamlines your trade operations with automated workflows, real-time tracking, and comprehensive reporting.'
        },
        {
          id: 3,
          category: 'Account Management',
          question: 'How do I reset my password?',
          answer: 'Click on the "Forgot Password" link on the login page. Enter your email address and we will send you a password reset link. Follow the instructions in the email to create a new password.'
        },
        {
          id: 4,
          category: 'Account Management',
          question: 'How do I update my profile information?',
          answer: 'Go to your dashboard and click on "Profile" in the sidebar menu. You can update your personal information, business details, and account preferences from there.'
        },
        {
          id: 5,
          category: 'Purchase Orders',
          question: 'How do I create a purchase order?',
          answer: 'Navigate to the Purchase Orders section and click "Create New Order". Fill in the required details including products, quantities, delivery information, and submit. The order will be processed according to your business workflow.'
        },
        {
          id: 6,
          category: 'Purchase Orders',
          question: 'Can I track the status of my orders?',
          answer: 'Yes, all purchase orders can be tracked in real-time. Go to the Purchase Orders section to view the current status, shipping information, and expected delivery dates for all your orders.'
        },
        {
          id: 7,
          category: 'Purchase Orders',
          question: 'How do I cancel or modify an order?',
          answer: 'You can cancel or modify orders that haven\'t been processed yet. Go to your Purchase Orders, find the order you want to change, and use the "Modify" or "Cancel" options if available.'
        },
        {
          id: 8,
          category: 'Inventory Management',
          question: 'How does inventory tracking work?',
          answer: 'Our system automatically tracks your inventory levels based on purchase orders and sales. You can view real-time stock levels, set up low-stock alerts, and generate inventory reports.'
        },
        {
          id: 9,
          category: 'Inventory Management',
          question: 'Can I set up automatic reorder points?',
          answer: 'Yes, you can configure automatic reorder points for your products. When stock levels reach the specified threshold, the system can automatically generate purchase orders or send notifications.'
        },
        {
          id: 10,
          category: 'Billing & Payments',
          question: 'What payment methods do you accept?',
          answer: 'We accept major credit cards, bank transfers, and other secure payment methods. Payment options may vary based on your location and account type.'
        },
        {
          id: 11,
          category: 'Billing & Payments',
          question: 'How do I view my billing history?',
          answer: 'Your billing history and invoices are available in the Billing section of your account. You can download invoices, view payment history, and manage payment methods.'
        },
        {
          id: 12,
          category: 'Technical Support',
          question: 'What browsers are supported?',
          answer: 'Tsatsaku works best with modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.'
        },
        {
          id: 13,
          category: 'Technical Support',
          question: 'How do I report a bug or technical issue?',
          answer: 'You can report technical issues through our Contact page or the support ticket system. Include as much detail as possible about the issue and steps to reproduce it.'
        },
        {
          id: 14,
          category: 'Security',
          question: 'How secure is my data?',
          answer: 'We use industry-standard security measures including SSL encryption, secure data centers, and regular security audits. Your data is backed up regularly and protected with multiple layers of security.'
        },
        {
          id: 15,
          category: 'Security',
          question: 'Do you offer two-factor authentication?',
          answer: 'Yes, we highly recommend enabling two-factor authentication (2FA) for additional account security. You can enable it in your account security settings.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqs.map(faq => faq.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>FAQ | Tsatsaku</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <DashboardLayout user={user} title="Frequently Asked Questions">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h1>
                  <p className="text-gray-600 mt-1">Find answers to common questions about Tsatsaku</p>
                </div>
              </div>
              
              {/* Search Box */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {categories.map((category) => (
              <div key={category} className="bg-white rounded-lg border border-gray-200 p-3 text-center hover:shadow-sm transition-shadow">
                <div className="text-sm font-medium text-gray-900">{category}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {faqs.filter(faq => faq.category === category).length} questions
                </div>
              </div>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-600">No questions found matching your search.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-brand-600 hover:text-brand-700 font-medium"
                >
                  Clear search
                </button>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-brand-100 text-brand-700 rounded-full mr-2">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          openItems.has(faq.id) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {openItems.has(faq.id) && (
                    <div className="px-6 pb-4 border-t border-gray-100">
                      <div className="pt-4 text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-gradient-to-br from-brand-600 to-brand-700 rounded-lg text-white p-8 text-center">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75 9.75 9.75 0 00-9.75-9.75z" />
            </svg>
            <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
            <p className="text-brand-100 mb-6">
              Can't find what you're looking for? Our support team is here to help you get the most out of Tsatsaku.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-brand-600 px-6 py-3 rounded-lg font-medium hover:bg-brand-50 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="mailto:support@tsatsaku.com"
                className="bg-brand-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-400 transition-colors border border-brand-400"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

export default function FAQ() {
  return (
    <ProtectedRoute>
      <FAQPage />
    </ProtectedRoute>
  );
}