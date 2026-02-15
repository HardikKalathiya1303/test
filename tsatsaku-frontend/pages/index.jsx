import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import authService from '../services/authService';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      // Redirect to dashboard if already logged in
      router.push('/dashboard');
    } else {
      // Redirect to login page on first load if not authenticated
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Tsatsaku - Trade-as-a-Service</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="main-gradient-bg flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="brand-logo mx-auto mb-4">
            <span className="text-white text-3xl font-bold">T</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Tsatsaku</h1>
          <p className="text-slate-600">Redirecting to login...</p>
        </div>
      </div>
    </>
  );
}