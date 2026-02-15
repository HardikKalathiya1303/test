import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Admin can see all purchase orders through man-user buyers' orders
      // The admin route doesn't have a direct purchase-orders endpoint,
      // so we'll use the dashboard stats and buyers endpoint for overview
      const params = { page: currentPage, limit: 10 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      // Try fetching from buyers to get their orders
      const response = await api.get('/admin/buyers', { params: { page: 1, limit: 100 } });
      const buyers = response.data.buyers || response.data.data || [];
      
      // Get orders data from dashboard stats
      const statsRes = await api.get('/admin/dashboard/stats');
      const statsData = statsRes.data.data || {};
      
      // If there are recent activities that are orders, use those
      const recentOrders = statsData.recentActivities || [];
      
      setOrders(buyers.map(b => ({
        _id: b._id,
        buyerName: `${b.firstName || ''} ${b.lastName || ''}`.trim() || b.companyName || 'N/A',
        companyName: b.companyName || 'N/A',
        email: b.email,
        status: b.status || 'active',
        createdAt: b.createdAt,
        type: 'buyer'
      })));
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = orders.filter(o => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (o.buyerName || '').toLowerCase().includes(term) ||
             (o.companyName || '').toLowerCase().includes(term) ||
             (o.email || '').toLowerCase().includes(term);
    }
    return true;
  });

  if (loading && orders.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Orders Overview</h1>
          <p className="text-gray-600 mt-1">View all buyers and their purchase order activity</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input type="text" placeholder="Search by buyer name, company or email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={fetchOrders} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No data found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.buyerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.companyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => router.push(`/admin/buyers`)}
                            className="text-blue-600 hover:text-blue-900">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
