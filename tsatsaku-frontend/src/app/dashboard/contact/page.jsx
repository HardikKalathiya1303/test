'use client';

import { useState } from 'react';
import Spinner from '@/components/ui/Spinner';
import { submitContact } from '@/services/content.service';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await submitContact(formData);
      if (response.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(response.message || 'Failed to send message');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Contact Us</h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">Get in touch with our support team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          {[
            { icon: 'email', title: 'Email', detail: 'support@tsatsaku.com', desc: 'We reply within 24 hours' },
            { icon: 'phone', title: 'Phone', detail: '+1 (555) 123-4567', desc: 'Mon-Fri 9am to 6pm' },
            { icon: 'location_on', title: 'Office', detail: 'Global Trade Center', desc: 'International Business District' },
          ].map((item) => (
            <div key={item.title} className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-icons-outlined text-primary">{item.icon}</span>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark text-sm">{item.title}</h3>
                <p className="text-primary text-sm font-medium">{item.detail}</p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center gap-2">
            <span className="material-icons-outlined text-primary">send</span>
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Send a Message</h2>
          </div>
          <div className="p-6">
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons-outlined text-green-500 text-3xl">check_circle</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">Message Sent!</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-6">We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => setSuccess(false)}
                  className="text-primary font-medium text-sm hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                    <span className="material-icons-outlined text-red-500 text-xl">error</span>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-1.5">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                      placeholder="Your full name" required
                      className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-gray-50 dark:bg-slate-800 text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-1.5">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="your@email.com" required
                      className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-gray-50 dark:bg-slate-800 text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-1.5">Subject</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                    placeholder="What is this about?" required
                    className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-gray-50 dark:bg-slate-800 text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-1.5">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange}
                    placeholder="Write your message here..." required rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-gray-50 dark:bg-slate-800 text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" />
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={loading}
                    className="px-6 py-3 bg-primary hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                    {loading ? <Spinner size="sm" color="white" /> : <span className="material-icons-outlined text-lg">send</span>}
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
