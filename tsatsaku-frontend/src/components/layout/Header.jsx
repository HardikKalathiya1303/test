'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';

export default function Header({ title }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side - Search */}
      <div className="flex items-center max-w-md w-full">
        <div className="relative w-full hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-icons-outlined text-gray-400 text-xl">search</span>
          </div>
          <input
            type="text"
            placeholder="Search orders, products..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-colors"
          />
        </div>
        <h1 className="text-lg font-semibold text-gray-900 md:hidden">
          {title || 'Dashboard'}
        </h1>
      </div>

      {/* Right side - Notifications, Help, Profile */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 relative transition-colors">
          <span className="material-icons-outlined text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>

        {/* Help */}
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors hidden sm:flex">
          <span className="material-icons-outlined text-[22px]">help_outline</span>
        </button>

        {/* Divider */}
        <div className="hidden md:block h-8 w-px bg-gray-200 mx-1" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <span className="material-icons-outlined text-gray-400 text-lg hidden md:block">expand_more</span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20 animate-fadeIn">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="material-icons-outlined text-lg text-gray-400">person</span>
                  Profile
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="material-icons-outlined text-lg text-gray-400">settings</span>
                  Settings
                </Link>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <span className="material-icons-outlined text-lg">logout</span>
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
