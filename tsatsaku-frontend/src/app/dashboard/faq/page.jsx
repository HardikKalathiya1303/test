'use client';

import { useState, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';
import { getContent } from '@/services/content.service';

export default function FAQPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getContent('faq');
        if (response.success) setContent(response.data);
      } catch (err) { console.error('Failed to fetch content:', err); }
      finally { setLoading(false); }
    };
    fetchContent();
  }, []);

  const defaultFaqs = [
    { q: 'How do I place a purchase order?', a: 'Navigate to the Purchase Orders section from the sidebar and click on "Create New Order". Fill in the required details including product selection, quantities, and delivery preferences.' },
    { q: 'How can I track my order status?', a: 'Go to the Purchase Orders page to view all your orders. Click on any order to see its detailed status timeline, including current tracking information.' },
    { q: 'How do I update my company profile?', a: 'Visit the Profile section from the sidebar. You can update your company information, contact person details, and location settings from there.' },
    { q: 'What payment methods are supported?', a: 'We support various payment methods including bank transfers, letters of credit, and other trade finance instruments. Contact our team for specific payment arrangements.' },
    { q: 'How do I contact support?', a: 'You can reach our support team through the Contact Us page, or email us directly. Our team typically responds within 24 business hours.' },
    { q: 'Can I cancel an order?', a: 'Order cancellation depends on the current status. Orders in "Pending" status can typically be cancelled. For orders already in processing, please contact our support team.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">FAQ</h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">Frequently asked questions and answers</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
      ) : (
        <div className="space-y-6">
          {/* Search hint */}
          <div className="bg-primary/5 rounded-xl p-6 flex items-start gap-4 border border-primary/10">
            <span className="material-icons-outlined text-primary text-2xl flex-shrink-0 mt-0.5">help_outline</span>
            <div>
              <h2 className="font-semibold text-text-primary-light dark:text-text-primary-dark">Need help?</h2>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Browse our frequently asked questions below. If you can&apos;t find what you&apos;re looking for, visit the Contact Us page.</p>
            </div>
          </div>

          {content?.content ? (
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6 md:p-8 shadow-sm">
              <div className="prose prose-gray dark:prose-invert max-w-none text-text-primary-light dark:text-text-primary-dark" dangerouslySetInnerHTML={{ __html: content.content }} />
            </div>
          ) : (
            <div className="space-y-3">
              {defaultFaqs.map((faq, index) => (
                <div key={index} className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-medium text-text-primary-light dark:text-text-primary-dark pr-4">{faq.q}</span>
                    <span className="material-icons-outlined text-text-secondary-light dark:text-text-secondary-dark flex-shrink-0 transition-transform duration-200" style={{ transform: openIndex === index ? 'rotate(180deg)' : 'none' }}>
                      expand_more
                    </span>
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-4 pt-0">
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
