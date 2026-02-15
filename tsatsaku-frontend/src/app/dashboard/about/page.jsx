'use client';

import { useState, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';
import { getContent } from '@/services/content.service';

export default function AboutPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getContent('about');
        if (response.success) setContent(response.data);
      } catch (err) { console.error('Failed to fetch content:', err); }
      finally { setLoading(false); }
    };
    fetchContent();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">About Us</h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">Learn more about Tsatsaku</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
      ) : (
        <div className="space-y-6">
          {/* Hero Card */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-8 text-white shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-icons-outlined text-3xl">business</span>
              <h2 className="text-2xl font-bold">{content?.title || 'About Tsatsaku'}</h2>
            </div>
            <p className="text-white/90 text-lg">Your trusted partner in chemical trade and inventory management</p>
          </div>

          {/* Content */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6 md:p-8 shadow-sm">
            {content?.content ? (
              <div className="prose prose-gray dark:prose-invert max-w-none text-text-primary-light dark:text-text-primary-dark" dangerouslySetInnerHTML={{ __html: content.content }} />
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: 'public', title: 'Global Reach', desc: 'Connecting buyers and sellers across international markets for seamless chemical trade.' },
                    { icon: 'verified', title: 'Quality Assured', desc: 'Every product meets strict quality standards with full traceability and compliance.' },
                    { icon: 'support_agent', title: 'Dedicated Support', desc: 'Our expert team provides personalized assistance throughout your procurement journey.' },
                  ].map((item) => (
                    <div key={item.title} className="text-center p-6 bg-gray-50 dark:bg-slate-800 rounded-xl border border-border-light dark:border-border-dark hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <span className="material-icons-outlined text-2xl text-primary">{item.icon}</span>
                      </div>
                      <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">{item.title}</h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">Our Mission</h3>
                  <p className="text-text-primary-light dark:text-text-primary-dark leading-relaxed">
                    Tsatsaku is a comprehensive chemical trade platform designed to streamline the procurement process for businesses worldwide. We connect buyers with verified suppliers, providing a transparent and efficient marketplace for chemical products.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">What We Offer</h3>
                  <ul className="space-y-3">
                    {[
                      'Extensive catalog of verified chemical products',
                      'Real-time order tracking and management',
                      'Secure payment processing',
                      'Quality assurance and compliance documentation',
                      'Dedicated customer support',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="material-icons-outlined text-green-500 text-lg mt-0.5">check_circle</span>
                        <span className="text-text-primary-light dark:text-text-primary-dark">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
