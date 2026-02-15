import Link from 'next/link';
import Image from 'next/image';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark antialiased transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col flex-shrink-0 z-20 hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary dark:bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-secondary dark:text-white">Tsatsaku</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary dark:text-blue-400 font-medium group transition-colors">
            <span className="material-icons-outlined text-[20px]">dashboard</span>
            Dashboard
          </Link>

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
            Operations
          </div>

          <Link href="/dashboard/purchase-orders" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors group">
            <span className="material-icons-outlined text-[20px] group-hover:text-primary dark:group-hover:text-blue-400">receipt_long</span>
            Purchase Orders
          </Link>

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
            Company
          </div>

          <Link href="/dashboard/about" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors group">
            <span className="material-icons-outlined text-[20px] group-hover:text-primary dark:group-hover:text-blue-400">business</span>
            About Us
          </Link>

          <Link href="/dashboard/terms" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors group">
            <span className="material-icons-outlined text-[20px] group-hover:text-primary dark:group-hover:text-blue-400">gavel</span>
            Terms & Conditions
          </Link>

          <Link href="/dashboard/privacy" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors group">
            <span className="material-icons-outlined text-[20px] group-hover:text-primary dark:group-hover:text-blue-400">shield</span>
            Privacy Policy
          </Link>

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
            Support
          </div>

          <Link href="/dashboard/contact" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors group">
            <span className="material-icons-outlined text-[20px] group-hover:text-primary dark:group-hover:text-blue-400">support_agent</span>
            Contact Support
          </Link>

          <Link href="/dashboard/faq" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors group">
            <span className="material-icons-outlined text-[20px] group-hover:text-primary dark:group-hover:text-blue-400">help_outline</span>
            FAQ
          </Link>

          <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors group">
            <span className="material-icons-outlined text-[20px] group-hover:text-primary dark:group-hover:text-blue-400">settings</span>
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-border-light dark:border-border-dark">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden border-2 border-white dark:border-slate-600 shadow-sm relative">
              {/* Placeholder for avatar if image fails or is missing */}
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-600">JS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">J. Smith</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">Admin</p>
            </div>
            <button className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-blue-400">
              <span className="material-icons-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-6 z-10">
          <div className="flex items-center max-w-md w-full">
            <div className="relative w-full hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons-outlined text-gray-400 text-xl">search</span>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-border-light dark:border-border-dark rounded-lg leading-5 bg-gray-50 dark:bg-slate-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm dark:text-gray-100 transition-colors"
                placeholder="Search orders, products, shipments..."
              />
            </div>
            {/* Mobile Menu Button (Visible only on small screens) */}
            <button className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open sidebar</span>
              <span className="material-icons-outlined">menu</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-text-secondary-light dark:text-text-secondary-dark relative">
              <span className="material-icons-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-surface-dark"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-text-secondary-light dark:text-text-secondary-dark">
              <span className="material-icons-outlined">help_outline</span>
            </button>
            <button className="flex items-center gap-1 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-blue-400">
              <span>En</span>
              <span className="material-icons-outlined text-lg">expand_more</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
