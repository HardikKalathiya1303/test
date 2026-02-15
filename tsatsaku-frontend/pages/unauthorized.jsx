import Link from 'next/link';
import Head from 'next/head';

export default function Unauthorized() {
  return (
    <>
      <Head>
        <title>Unauthorized | Tsatsaku</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Access Denied</h2>
            <p className="mt-2 text-gray-600">
              You don't have permission to access this page.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/dashboard" className="w-full flex justify-center py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors">
              Go to Dashboard
            </Link>
            
            <Link href="/login" className="w-full flex justify-center py-3 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors">
              Login as Different User
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}