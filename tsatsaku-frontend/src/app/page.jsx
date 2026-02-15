'use client';

import Link from 'next/link';

const features = [
  { icon: 'inventory_2', title: 'Inventory Management', description: 'Track your products across multiple warehouses with real-time stock updates.' },
  { icon: 'shopping_cart', title: 'Purchase Orders', description: 'Create, manage, and track purchase orders from submission to delivery.' },
  { icon: 'bar_chart', title: 'Analytics & Reports', description: 'Get insights into your business with comprehensive analytics and reports.' },
  { icon: 'shield', title: 'Secure Platform', description: 'Enterprise-grade security to protect your business data and transactions.' },
  { icon: 'schedule', title: 'Real-time Tracking', description: 'Monitor order status and shipments in real-time with detailed updates.' },
  { icon: 'public', title: 'Global Network', description: 'Connect with warehouses and ports across multiple regions worldwide.' },
];

const benefits = [
  'Streamlined order management',
  'Real-time inventory tracking',
  'Automated notifications',
  'Detailed status history',
  'Secure document storage',
  'Multi-user access control',
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center text-white font-bold shadow-md">T</div>
              <span className="text-xl font-bold tracking-tight text-gray-900">Tsatsaku</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">Contact</Link>
              <Link href="/faq" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">FAQ</Link>
              <Link href="/login" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">Login</Link>
              <Link href="/register" className="btn-gradient text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg">Get Started</Link>
            </nav>
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <span className="material-icons-outlined text-gray-700">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Simplify Your Chemical Trade
              </h1>
              <p className="text-xl text-white/80 mt-6">
                Tsatsaku helps businesses track products, manage orders, and streamline operations with our powerful trade management platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/register" className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-700 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                  Start Free Trial
                  <span className="material-icons-outlined ml-2">arrow_forward</span>
                </Link>
                <Link href="/about" className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="space-y-4">
                  {[
                    { icon: 'local_shipping', order: 'PO-2024-001', status: 'Shipped to Warehouse A', color: 'bg-white/20' },
                    { icon: 'pending', order: 'PO-2024-002', status: 'Processing', color: 'bg-white/20' },
                    { icon: 'check_circle', order: 'PO-2024-003', status: 'Delivered', color: 'bg-green-500/20' },
                  ].map((item) => (
                    <div key={item.order} className="bg-white/20 rounded-lg p-4 flex items-center gap-4">
                      <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center`}>
                        <span className="material-icons-outlined text-xl">{item.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium">Order #{item.order}</p>
                        <p className="text-sm text-white/70">{item.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything you need to manage trade</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Our comprehensive platform provides all the tools you need to efficiently manage your inventory and orders.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md hover:border-primary-600/20 transition-all">
                <div className="w-12 h-12 bg-primary-600/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="material-icons-outlined text-2xl text-primary-600">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why businesses choose Tsatsaku</h2>
              <p className="text-gray-500 mb-8">Join businesses worldwide that have streamlined their operations with our platform.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <span className="material-icons-outlined text-green-500 text-xl">check_circle</span>
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/register" className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700 transition-colors">
                  Get started today
                  <span className="material-icons-outlined ml-2">arrow_forward</span>
                </Link>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">Dashboard Overview</h3>
                  <span className="text-sm text-gray-500">Today</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { val: '156', label: 'Total Orders', bg: 'bg-primary-600/10', color: 'text-primary-600' },
                    { val: '142', label: 'Completed', bg: 'bg-green-50', color: 'text-green-600' },
                    { val: '8', label: 'Pending', bg: 'bg-amber-50', color: 'text-amber-600' },
                    { val: '6', label: 'Processing', bg: 'bg-blue-50', color: 'text-blue-600' },
                  ].map((item) => (
                    <div key={item.label} className={`${item.bg} rounded-lg p-4`}>
                      <p className={`text-2xl font-bold ${item.color}`}>{item.val}</p>
                      <p className="text-sm text-gray-500">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to streamline your trade?</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">Start your free trial today and see how Tsatsaku can transform your business operations.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-700 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
              Start Free Trial
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-600 to-primary-800 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Tsatsaku. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-primary-600 transition-colors">Privacy</Link>
            <Link href="/terms-conditions" className="text-sm text-gray-400 hover:text-primary-600 transition-colors">Terms</Link>
            <Link href="/contact" className="text-sm text-gray-400 hover:text-primary-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
