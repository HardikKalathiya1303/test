'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';

const buyerMenuItems = [
  {
    section: 'Main',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { href: '/dashboard/purchase-orders', label: 'Purchase Orders', icon: 'receipt_long' },
      { href: '/dashboard/profile', label: 'Profile', icon: 'person' },
    ],
  },
  {
    section: 'Information',
    items: [
      { href: '/dashboard/about', label: 'About Us', icon: 'info' },
      { href: '/dashboard/terms', label: 'Terms & Conditions', icon: 'description' },
      { href: '/dashboard/privacy', label: 'Privacy Policy', icon: 'shield' },
    ],
  },
  {
    section: 'Support',
    items: [
      { href: '/dashboard/faq', label: 'FAQ', icon: 'help_outline' },
      { href: '/dashboard/contact', label: 'Contact Us', icon: 'mail_outline' },
    ],
  },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md text-gray-700 border border-gray-200"
      >
        <span className="material-icons-outlined text-xl">menu</span>
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 flex flex-col transition-transform duration-300',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Tsatsaku</span>
          </Link>

          {/* Close button - Mobile only */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <span className="material-icons-outlined text-xl">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {buyerMenuItems.map((group) => (
            <div key={group.section}>
              <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {group.section}
              </div>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group',
                      isActive
                        ? 'bg-primary-600/10 text-primary-600 font-medium'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <span className={cn(
                      'material-icons-outlined text-[20px]',
                      isActive ? 'text-primary-600' : 'group-hover:text-primary-600'
                    )}>
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Area & Logout */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.role?.replace('_', ' ') || 'Buyer'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              title="Logout"
            >
              <span className="material-icons-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
