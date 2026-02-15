'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { PageLoader } from '@/components/ui/Spinner';

export default function DashboardLayout({ children, title }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (!mounted || loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <PageLoader message="Redirecting to login..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <Header title={title} />
        
        <main className="flex-1 p-4 lg:p-6 pt-20 lg:pt-6">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
