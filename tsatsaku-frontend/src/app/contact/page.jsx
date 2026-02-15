'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getContent } from '@/services/content.service';
import { submitContactForm } from '@/services/content.service';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Footer from '@/components/layout/Footer';

const subjectOptions = [
  { value: '', label: 'Select a subject' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Technical Support' },
  { value: 'sales', label: 'Sales Question' },
  { value: 'partnership', label: 'Partnership Opportunity' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Other' },
];

export default function ContactPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getContent('contact');
        if (response.success) {
          setContent(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await submitContactForm(formData);
      
      if (response.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        setError(response.message || 'Failed to submit form. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
              <Link href="/contact" className="text-primary font-medium">
                Contact
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-primary transition-colors">
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
            {content?.title || 'Contact Us'}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="material-icons-outlined text-primary text-2xl">mail</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-muted mt-1">support@tsatsaku.com</p>
                      <p className="text-muted">sales@tsatsaku.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-success-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="material-icons-outlined text-success text-2xl">phone</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-muted mt-1">+1 (555) 123-4567</p>
                      <p className="text-muted">Mon-Fri, 9am-6pm EST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-info-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="material-icons-outlined text-info text-2xl">location_on</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <p className="text-muted mt-1">
                        123 Business Street<br />
                        Suite 100<br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-warning-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="material-icons-outlined text-warning text-2xl">schedule</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Business Hours</h3>
                      <p className="text-muted mt-1">
                        Monday - Friday: 9am - 6pm<br />
                        Saturday: 10am - 4pm<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Send us a Message</h2>
                </CardHeader>
                <CardContent className="p-6">
                  {success ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-icons-outlined text-success" style={{fontSize: '32px'}}>send</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-muted mb-6">
                        Thank you for contacting us. We'll get back to you within 24 hours.
                      </p>
                      <Button 
                        variant="primary" 
                        onClick={() => setSuccess(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <Alert variant="danger" onClose={() => setError('')}>
                          {error}
                        </Alert>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />

                        <Input
                          label="Email Address"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Phone Number"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                        />

                        <Select
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          options={subjectOptions}
                          required
                        />
                      </div>

                      <Textarea
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        rows={6}
                        required
                      />

                      <Button
                        type="submit"
                        variant="primary"
                        loading={submitting}
                        className="w-full sm:w-auto"
                        leftIcon={<span className="material-icons-outlined text-lg">send</span>}
                      >
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
