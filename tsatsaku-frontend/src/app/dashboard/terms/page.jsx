'use client';

import { useState, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';
import { getContent } from '@/services/content.service';

export default function TermsPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getContent('terms');
        if (response.success) setContent(response.data);
      } catch (err) { console.error('Failed to fetch content:', err); }
      finally { setLoading(false); }
    };
    fetchContent();
  }, []);

  const defaultSections = [
    { title: '1. Acceptance of Terms', body: 'By accessing and using the Tsatsaku platform, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.' },
    { title: '2. Account Registration', body: 'Users must provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials.' },
    { title: '3. Use of Services', body: 'Our platform is intended for legitimate business use only. Users must comply with all applicable laws and regulations when using our services.' },
    { title: '4. Orders and Transactions', body: 'All orders placed through the platform are subject to confirmation and availability. Prices and product specifications may change without prior notice.' },
    { title: '5. Limitation of Liability', body: 'Tsatsaku shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform or services.' },
    { title: '6. Modifications', body: 'We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Terms & Conditions</h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">Please read these terms carefully before using our services</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6 md:p-8 shadow-sm">
          {content?.content ? (
            <div className="prose prose-gray dark:prose-invert max-w-none text-text-primary-light dark:text-text-primary-dark" dangerouslySetInnerHTML={{ __html: content.content }} />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border-light dark:border-border-dark">
                <span className="material-icons-outlined text-primary text-2xl">description</span>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">{content?.title || 'Terms and Conditions'}</h2>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {defaultSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">{section.title}</h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed text-sm">{section.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
