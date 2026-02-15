'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { getDashboardStats } from '@/services/buyer.service';

const StatCard = ({ title, value, icon, colorClass, bgClass, trend }) => (
  <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-border-light dark:border-border-dark flex flex-col justify-between h-32 hover:border-primary/50 dark:hover:border-blue-500/50 transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{title}</p>
        <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${bgClass}`}>
        <span className={`material-icons-outlined ${colorClass}`}>{icon}</span>
      </div>
    </div>
    <div className="flex items-center mt-2">
      <span className="flex items-center text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
        <span className="material-icons-outlined text-[14px] mr-0.5">trending_up</span>
        {trend || '+0.0%'}
      </span>
      <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark ml-2">vs last month</span>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        if (response.success) {
          setStats(response.data);
        } else {
          setError(response.message || 'Failed to load dashboard stats');
        }
      } catch (err) {
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const dashboardStats = stats || {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    processingOrders: 0,
    recentOrders: [],
  };

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Dashboard Overview</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm transition-colors">
            <span className="material-icons-outlined text-lg mr-2">download</span>
            Export
          </button>
          <Link href="/dashboard/purchase-orders" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md transition-colors">
            <span className="material-icons-outlined text-lg mr-2">add</span>
            New Order
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <span className="material-icons-outlined text-red-500">warning</span>
          <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={dashboardStats.totalOrders}
          icon="shopping_cart"
          colorClass="text-blue-600 dark:text-blue-400"
          bgClass="bg-blue-50 dark:bg-blue-900/20"
          trend="+12.5%"
        />
        <StatCard
          title="Pending Orders"
          value={dashboardStats.pendingOrders}
          icon="schedule"
          colorClass="text-orange-600 dark:text-orange-400"
          bgClass="bg-orange-50 dark:bg-orange-900/20"
          trend="+5.2%"
        />
        <StatCard
          title="Completed Orders"
          value={dashboardStats.completedOrders}
          icon="check_circle"
          colorClass="text-green-600 dark:text-green-400"
          bgClass="bg-green-50 dark:bg-green-900/20"
          trend="+8.1%"
        />
        <StatCard
          title="Processing"
          value={dashboardStats.processingOrders || 0}
          icon="inventory_2"
          colorClass="text-purple-600 dark:text-purple-400"
          bgClass="bg-purple-50 dark:bg-purple-900/20"
          trend="+2.4%"
        />
      </div>

      {/* Recent Orders / Shipments Table (Styled as Shipments in reference) */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark mb-8 overflow-hidden">
        <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center">
          <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Recent Orders</h2>
          <Link href="/dashboard/purchase-orders" className="text-sm font-medium text-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">View All</Link>
        </div>

        {dashboardStats.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-800 text-xs font-semibold uppercase text-text-secondary-light dark:text-text-secondary-dark border-b border-border-light dark:border-border-dark">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark text-sm">
                {dashboardStats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-text-primary-light dark:text-text-primary-dark">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-text-primary-light dark:text-text-primary-dark">
                      {order.products?.length || 0} items
                    </td>
                    <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">
                      ${order.totalAmount?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${order.currentStatus === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                          order.currentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'}`}>
                        {order.currentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-primary dark:hover:text-blue-400">
                        <span className="material-icons-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <span className="material-icons-outlined text-5xl text-gray-300 mb-4 block">inventory_2</span>
            <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">No orders yet</p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">Your recent orders will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
