import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import authService from '../services/authService';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import api from '../services/api';
import showToast from '../utils/toast';

function PrivacyPolicyPage() {
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
      const response = await api.get('/content/privacy');
      if (response.data && response.data.data) {
        setContent(response.data.data.content);
      }
    } catch (error) {
      console.error('Error loading privacy content:', error);
      // Use default content if API fails
      setContent(`
        <div>
          <h1>Privacy Policy</h1>
          <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>

          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us. This may include:</p>
          <ul>
            <li><strong>Account Information:</strong> Username, email address, password, and profile information</li>
            <li><strong>Business Information:</strong> Company name, contact details, business type, and trade-related data</li>
            <li><strong>Transaction Data:</strong> Purchase orders, inventory records, supplier information, and payment details</li>
            <li><strong>Communication Data:</strong> Messages, support requests, and feedback</li>
            <li><strong>Usage Data:</strong> Information about how you use our service, including log data, device information, and analytics</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and manage your orders</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and provide customer service</li>
            <li>Monitor and analyze usage and trends to improve our services</li>
            <li>Personalize your experience and provide content and features</li>
            <li>Protect against fraudulent or unauthorized activity</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>3. Information Sharing and Disclosure</h2>
          <p>We may share your information in the following situations:</p>
          <ul>
            <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
            <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
            <li><strong>Business Partners:</strong> With partners when necessary to facilitate transactions</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
            <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication procedures</li>
            <li>Employee training on data protection practices</li>
            <li>Incident response procedures</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your information, we will securely delete or anonymize it.</p>

          <h2>6. Your Rights and Choices</h2>
          <p>Depending on your location, you may have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request access to your personal information</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request a copy of your personal information in a portable format</li>
            <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
            <li><strong>Objection:</strong> Object to certain types of processing</li>
          </ul>

          <h2>7. Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar technologies to collect usage information, improve our services, and provide a personalized experience. You can control cookie settings through your browser preferences.</p>

          <h2>8. International Data Transfers</h2>
          <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.</p>

          <h2>9. Children's Privacy</h2>
          <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will delete it promptly.</p>

          <h2>10. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date.</p>

          <h2>11. Contact Us</h2>
          <p>If you have questions about this Privacy Policy or our privacy practices, please contact us through our support system or at our contact page.</p>
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
        <title>Privacy Policy | Tsatsaku</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <DashboardLayout user={user} title="Privacy Policy">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-green-800 font-medium">Your Privacy Matters</p>
                    <p className="text-green-700 text-sm mt-1">We're committed to protecting your personal information and being transparent about our practices.</p>
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

          {/* Privacy Tools */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg text-white p-6">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-lg font-bold">Manage Profile</h3>
              </div>
              <p className="text-blue-100 text-sm mb-4">Update your personal information and privacy settings.</p>
              <a 
                href="/profile" 
                className="inline-flex items-center bg-white text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                Go to Profile
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg text-white p-6">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold">Data Request</h3>
              </div>
              <p className="text-purple-100 text-sm mb-4">Request access to your data or deletion of your account.</p>
              <a 
                href="/contact" 
                className="inline-flex items-center bg-white text-purple-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors"
              >
                Contact Us
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg text-white p-6">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-bold">Terms</h3>
              </div>
              <p className="text-orange-100 text-sm mb-4">Review our complete terms and conditions.</p>
              <a 
                href="/terms" 
                className="inline-flex items-center bg-white text-orange-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors"
              >
                View Terms
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default function PrivacyPolicy() {
  return (
    <ProtectedRoute>
      <PrivacyPolicyPage />
    </ProtectedRoute>
  );
}