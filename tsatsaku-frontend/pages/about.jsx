import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import authService from '../services/authService';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import api from '../services/api';
import showToast from '../utils/toast';

function AboutPage() {
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
      const response = await api.get('/content/about');
      if (response.data && response.data.data) {
        setContent(response.data.data.content);
      }
    } catch (error) {
      console.error('Error loading about content:', error);
      // Use default content if API fails
      setContent(`
        <div>
          <h2>About Tsatsaku</h2>
          <p>Tsatsaku is a comprehensive Trade-as-a-Service platform designed to streamline and enhance your business operations. We provide end-to-end solutions for purchase order management, inventory tracking, and buyer relationships.</p>
          
          <h3>Our Mission</h3>
          <p>To revolutionize the way businesses manage their trade operations by providing innovative, efficient, and user-friendly solutions that drive growth and success.</p>
          
          <h3>What We Offer</h3>
          <ul>
            <li><strong>Purchase Order Management:</strong> Streamline your ordering process with our comprehensive PO management system.</li>
            <li><strong>Inventory Tracking:</strong> Keep track of your inventory in real-time with automated updates and alerts.</li>
            <li><strong>Buyer Relationship Management:</strong> Build and maintain strong relationships with your buyers through our integrated platform.</li>
            <li><strong>Role-Based Access:</strong> Secure, role-based access ensures the right people have access to the right information.</li>
          </ul>
          
          <h3>Why Choose Tsatsaku?</h3>
          <ul>
            <li>✓ Easy-to-use interface designed for efficiency</li>
            <li>✓ Comprehensive reporting and analytics</li>
            <li>✓ Secure and reliable platform</li>
            <li>✓ 24/7 customer support</li>
            <li>✓ Scalable solutions that grow with your business</li>
          </ul>
          
          <h3>Our Team</h3>
          <p>Our team consists of experienced professionals with deep expertise in trade management, technology, and customer service. We're dedicated to helping your business succeed.</p>
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
        <title>About Us | Tsatsaku</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <DashboardLayout user={user} title="About Us">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-brand-100 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">About Tsatsaku</h1>
              </div>
            </div>
            
            <div className="p-6">
              <div 
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-lg text-white p-6">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-bold">Contact Us</h3>
              </div>
              <p className="text-brand-100 mb-4">Have questions or need support? We're here to help!</p>
              <a 
                href="/contact" 
                className="inline-flex items-center bg-white text-brand-600 px-4 py-2 rounded-lg font-medium hover:bg-brand-50 transition-colors"
              >
                Get in Touch
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg text-white p-6">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-bold">Your Orders</h3>
              </div>
              <p className="text-green-100 mb-4">View and manage all your purchase orders in one place.</p>
              <a 
                href="/purchase-orders" 
                className="inline-flex items-center bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                View Orders
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

export default function About() {
  return (
    <ProtectedRoute>
      <AboutPage />
    </ProtectedRoute>
  );
}