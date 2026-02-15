import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import authService from '../services/authService';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import api from '../services/api';
import showToast from '../utils/toast';

function TermsConditionsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadContent();
  }, []);

  const checkAuth = async () => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  };

  const loadContent = async () => {
    try {
      const response = await api.get('/content/terms');
      if (response.data && response.data.data) {
        setContent(response.data.data.content);
      }
    } catch (error) {
      console.error('Error loading terms content:', error);
      // Use default content if API fails
      setContent(`
        <div>
          <h1>Terms and Conditions</h1>
          <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using the Tsatsaku platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h2>2. Description of Service</h2>
          <p>Tsatsaku is a Trade-as-a-Service platform that provides purchase order management, inventory tracking, and buyer relationship management services. The Service includes:</p>
          <ul>
            <li>Purchase Order management system</li>
            <li>Inventory tracking and management</li>
            <li>Buyer and supplier relationship management</li>
            <li>Reporting and analytics tools</li>
            <li>Communication and collaboration features</li>
          </ul>

          <h2>3. User Accounts</h2>
          <p>To access certain features of the Service, you must register for an account. You agree to:</p>
          <ul>
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password and account</li>
            <li>Accept all risks of unauthorized access to your account</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul>
            <li>Use the Service in any way that violates applicable laws or regulations</li>
            <li>Transmit or procure the sending of any advertising or promotional material</li>
            <li>Impersonate or attempt to impersonate the Company, employees, or other users</li>
            <li>Upload or transmit viruses, malware, or any other malicious code</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
          </ul>

          <h2>5. Data and Privacy</h2>
          <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using the Service, you consent to the collection and use of your information as outlined in our Privacy Policy.</p>

          <h2>6. Intellectual Property Rights</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Tsatsaku and its licensors. The Service is protected by copyright, trademark, and other laws.</p>

          <h2>7. Payment Terms</h2>
          <p>Certain features of the Service may require payment of fees. All fees are stated in USD and are non-refundable unless otherwise specified. You agree to pay all applicable fees as described in the Service at the time the fees are due.</p>

          <h2>8. Service Availability</h2>
          <p>We strive to maintain high availability of our Service, but we do not guarantee that the Service will be available at all times. The Service may be interrupted for maintenance, updates, or due to technical issues.</p>

          <h2>9. Limitation of Liability</h2>
          <p>In no event shall Tsatsaku, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>

          <h2>10. Indemnification</h2>
          <p>You agree to defend, indemnify, and hold harmless Tsatsaku and its licensee and licensors from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including necessary fees).</p>

          <h2>11. Termination</h2>
          <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.</p>

          <h2>12. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.</p>

          <h2>13. Governing Law</h2>
          <p>These Terms shall be interpreted and governed by the laws of the jurisdiction in which Tsatsaku operates, without regard to its conflict of law provisions.</p>

          <h2>14. Contact Information</h2>
          <p>If you have any questions about these Terms and Conditions, please contact us through our support system or at our contact page.</p>
        </div>
      `);
    } finally {
      setIsLoading(false);
    }
  };

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
        <title>Terms & Conditions | Tsatsaku</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <DashboardLayout user={user} title="Terms & Conditions">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-yellow-800 font-medium">Important Legal Document</p>
                    <p className="text-yellow-700 text-sm mt-1">Please read these terms carefully before using our services.</p>
                  </div>
                </div>
              </div>

              <div 
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
          </div>

          {/* Action Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg text-white p-6">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-xl font-bold">Privacy Policy</h3>
              </div>
              <p className="text-blue-100 mb-4">Learn how we protect and handle your personal information.</p>
              <a 
                href="/privacy" 
                className="inline-flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                View Privacy Policy
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg text-white p-6">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold">Have Questions?</h3>
              </div>
              <p className="text-purple-100 mb-4">Need clarification on any terms? Our team is here to help.</p>
              <a 
                href="/contact" 
                className="inline-flex items-center bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                Contact Support
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

export default function TermsConditions() {
  return (
    <ProtectedRoute>
      <TermsConditionsPage />
    </ProtectedRoute>
  );
}