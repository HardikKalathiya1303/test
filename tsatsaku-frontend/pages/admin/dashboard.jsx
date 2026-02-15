import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import authService from '../../services/authService';
import api from '../../services/api';
import showToast from '../../utils/toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentActivities: [],
    lowStock: []
  });

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
      
      if (!currentUser || currentUser.role !== 'admin') {
        router.push('/login');
        return;
      }

      setUser(currentUser);
      await loadDashboardData();
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Set default empty data to prevent crashes
      setDashboardData({
        stats: {
          totalUsers: 0,
          activeUsers: 0,
          totalBuyers: 0,
          activeBuyers: 0,
          totalProducts: 0,
          lowStockProducts: 0,
          totalPorts: 0,
          totalWarehouses: 0,
          pendingOrders: 0,
          totalRevenue: 0
        },
        recentActivities: [],
        lowStock: []
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData.stats || {};

  return (
    <>
      <Head>
        <title>Admin Dashboard | Tsatsaku</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500">Welcome back, {user?.firstName}!</span>
                <button 
                  onClick={() => {
                    authService.logout();
                    router.push('/login');
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex space-x-8 mb-8">
            <button 
              onClick={() => router.push('/admin/dashboard')}
              className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium"
            >
              Dashboard
            </button>
            <button 
              onClick={() => router.push('/admin/products')}
              className="text-gray-600 hover:text-blue-600 pb-2"
            >
              Products
            </button>
            <button 
              onClick={() => router.push('/admin/product-categories')}
              className="text-gray-600 hover:text-blue-600 pb-2"
            >
              Categories
            </button>
            <button 
              onClick={() => router.push('/admin/buyers')}
              className="text-gray-600 hover:text-blue-600 pb-2"
            >
              Buyers
            </button>
            <button 
              onClick={() => router.push('/admin/sub-admins')}
              className="text-gray-600 hover:text-blue-600 pb-2"
            >
              Sub Admins
            </button>
          </nav>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers || 0}</p>
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.activeUsers || 0}</p>
                </div>
              </div>
            </div>

            {/* Total Buyers */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Buyers</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalBuyers || 0}</p>
                </div>
              </div>
            </div>

            {/* Total Products */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Products</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts || 0}</p>
                </div>
              </div>
            </div>

            {/* Low Stock Products */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.lowStockProducts || 0}</p>
                </div>
              </div>
            </div>

            {/* Total Ports */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Ports</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalPorts || 0}</p>
                </div>
              </div>
            </div>

            {/* Total Warehouses */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Warehouses</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalWarehouses || 0}</p>
                </div>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pendingOrders || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
              </div>
              <div className="p-6">
                {dashboardData.recentActivities && dashboardData.recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentActivities.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent activities</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => router.push('/admin/products')}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="text-sm font-medium text-gray-900">Manage Products</div>
                    <div className="text-xs text-gray-500 mt-1">Add, edit, or remove products</div>
                  </button>
                  <button 
                    onClick={() => router.push('/admin/buyers')}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="text-sm font-medium text-gray-900">Manage Buyers</div>
                    <div className="text-xs text-gray-500 mt-1">View and manage buyer accounts</div>
                  </button>
                  <button 
                    onClick={() => router.push('/admin/product-categories')}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="text-sm font-medium text-gray-900">Categories</div>
                    <div className="text-xs text-gray-500 mt-1">Organize product categories</div>
                  </button>
                  <button 
                    onClick={() => router.push('/admin/sub-admins')}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="text-sm font-medium text-gray-900">Sub Admins</div>
                    <div className="text-xs text-gray-500 mt-1">Manage admin users</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}