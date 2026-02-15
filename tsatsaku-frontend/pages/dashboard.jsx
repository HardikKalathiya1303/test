import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import authService from '../services/authService';
import api from '../services/api';
import showToast from '../utils/toast';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';

function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Try to fetch user data from API
        const result = await authService.getMe();
        if (result.success) {
          setUser(result.data);
        } else {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const getDashboardContent = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return <AdminDashboard user={user} />;
      case 'man_user':
        return <ManUserDashboard user={user} />;
      case 'buyer':
        return <BuyerDashboard user={user} />;
      default:
        return <div>Unknown user role</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | Tsatsaku</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <DashboardLayout user={user} title="Dashboard">
        {getDashboardContent()}
      </DashboardLayout>
    </>
  );
}

// Admin Dashboard Component
function AdminDashboard({ user }) {
  const router = useRouter();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.data?.stats || response.data.data || {});
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers || 0, color: 'blue', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
    { label: 'Total Buyers', value: stats.totalBuyers || 0, color: 'purple', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Total Products', value: stats.totalProducts || 0, color: 'green', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Pending Orders', value: stats.pendingOrders || 0, color: 'yellow', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Total Ports', value: stats.totalPorts || 0, color: 'indigo', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { label: 'Total Warehouses', value: stats.totalWarehouses || 0, color: 'gray', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
    { label: 'Low Stock Alerts', value: stats.lowStockProducts || 0, color: 'red', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' },
    { label: 'Active Users', value: stats.activeUsers || 0, color: 'teal', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const quickActions = [
    { label: 'Manage Products', desc: 'Add, edit, or remove products', href: '/admin/products' },
    { label: 'Manage Buyers', desc: 'View buyer accounts', href: '/admin/buyers' },
    { label: 'Sub-Admins', desc: 'Manage admin users', href: '/admin/sub-admins' },
    { label: 'Contact Queries', desc: 'View customer queries', href: '/admin/queries' },
    { label: 'Content Pages', desc: 'Edit About, Terms, FAQ', href: '/admin/content' },
    { label: 'View Reports', desc: 'Analytics & reports', href: '/admin/reports' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="mt-1 text-gray-600">Welcome back, {user?.firstName || 'Admin'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className={`p-2 bg-${card.color}-100 rounded-lg`}>
                <svg className={`w-6 h-6 text-${card.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <button key={i} onClick={() => router.push(action.href)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
              <div className="text-sm font-medium text-gray-900">{action.label}</div>
              <div className="text-xs text-gray-500 mt-1">{action.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// MAN User Dashboard Component
function ManUserDashboard({ user }) {
  const router = useRouter();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [buyersRes, ordersRes] = await Promise.allSettled([
        api.get('/man-user/buyers', { params: { page: 1, limit: 1 } }),
        api.get('/man-user/purchase-orders', { params: { page: 1, limit: 1 } })
      ]);
      setStats({
        totalBuyers: buyersRes.status === 'fulfilled' ? (buyersRes.value.data.totalCount || buyersRes.value.data.buyers?.length || 0) : 0,
        totalOrders: ordersRes.status === 'fulfilled' ? (ordersRes.value.data.totalCount || ordersRes.value.data.orders?.length || 0) : 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Buyer Management', desc: 'Add, edit, manage buyer accounts', href: '/man-user/buyers' },
    { label: 'Purchase Orders', desc: 'Create and manage orders', href: '/man-user/purchase-orders' },
    { label: 'Sub-Users', desc: 'Manage MAN sub-users', href: '/man-user/sub-users' },
    { label: 'Inventory Reports', desc: 'View real-time inventory', href: '/man-user/inventory/reports' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">MAN User Dashboard</h2>
        <p className="mt-1 text-gray-600">Welcome back, {user?.firstName || 'User'}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Buyers</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : stats.totalBuyers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : stats.totalOrders}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {quickActions.map((action, i) => (
            <button key={i} onClick={() => router.push(action.href)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
              <div className="text-sm font-medium text-gray-900">{action.label}</div>
              <div className="text-xs text-gray-500 mt-1">{action.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Buyer Dashboard Component
function BuyerDashboard({ user }) {
  const router = useRouter();
  const [stats, setStats] = useState({ totalOrders: 0, activeOrders: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/buyer/dashboard-stats');
      if (response.data.success) {
        setStats(response.data.data || {});
      }
    } catch (error) {
      console.error('Failed to load buyer stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName || 'Buyer'}!</h2>
        <p className="text-blue-100">Manage your purchase orders and track your business with Tsatsaku</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{loading ? '...' : (stats.totalOrders || 0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Active Orders</p>
          <p className="text-2xl font-bold text-gray-900">{loading ? '...' : (stats.activeOrders || 0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-gray-900">{loading ? '...' : (stats.pendingOrders || 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a href="/purchase-orders" className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">My Orders</h3>
          <p className="text-gray-600 mt-1 text-sm">View and track orders</p>
        </a>
        <a href="/profile" className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">My Profile</h3>
          <p className="text-gray-600 mt-1 text-sm">Update your details</p>
        </a>
        <a href="/contact" className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Contact Us</h3>
          <p className="text-gray-600 mt-1 text-sm">Get help and support</p>
        </a>
        <a href="/faq" className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">FAQ</h3>
          <p className="text-gray-600 mt-1 text-sm">Frequently asked questions</p>
        </a>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}