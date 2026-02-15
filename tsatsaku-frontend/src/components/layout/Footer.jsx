'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-primary-600 to-primary-800 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">T</span>
          </div>
          <span className="text-sm text-gray-500">
            © {currentYear} Tsatsaku. All rights reserved.
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/privacy"
            className="text-sm text-gray-400 hover:text-primary-600 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/dashboard/terms"
            className="text-sm text-gray-400 hover:text-primary-600 transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/dashboard/contact"
            className="text-sm text-gray-400 hover:text-primary-600 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
