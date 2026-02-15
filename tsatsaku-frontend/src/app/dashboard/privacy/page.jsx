'use client';

import { useState, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';
import { getContent } from '@/services/content.service';

export default function PrivacyPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getContent('privacy');
        if (response.success) setContent(response.data);
      } catch (err) { console.error('Failed to fetch content:', err); }
      finally { setLoading(false); }
    };
    fetchContent();
  }, []);

  const defaultSections = [
    { title: 'Information We Collect', body: 'We collect information you provide directly, such as your name, email, company details, and contact information when you register for an account or use our services.' },
    { title: 'How We Use Your Information', body: 'Your information is used to provide and improve our services, process transactions, communicate with you, and ensure the security of our platform.' },
    { title: 'Data Security', body: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.' },
    { title: 'Cookies and Tracking', body: 'We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content.' },
    { title: 'Third-Party Sharing', body: 'We do not sell your personal information. We may share data with trusted partners who assist in operating our platform, subject to confidentiality agreements.' },
    { title: 'Your Rights', body: 'You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Privacy Policy</h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">How we collect, use, and protect your information</p>
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
                <span className="material-icons-outlined text-primary text-2xl">shield</span>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">{content?.title || 'Privacy Policy'}</h2>
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
