import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function AdminReports() {
  const [analytics, setAnalytics] = useState(null);
  const [stockStats, setStockStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, stockStatsRes, lowStockRes] = await Promise.allSettled([
        api.get('/admin/dashboard/analytics'),
        api.get('/admin/warehouse-stocks/stats'),
        api.get('/admin/warehouse-stocks/low-stock'),
      ]);

      if (analyticsRes.status === 'fulfilled') {
        setAnalytics(analyticsRes.value.data.data || analyticsRes.value.data);
      }
      if (stockStatsRes.status === 'fulfilled') {
        setStockStats(stockStatsRes.value.data.data || stockStatsRes.value.data);
      }
      if (lowStockRes.status === 'fulfilled') {
        setLowStock(lowStockRes.value.data.data || lowStockRes.value.data || []);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">View analytics and stock reports</p>
          </div>
          <button onClick={fetchReportData} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Refresh Data
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'stock', 'low-stock'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                {tab === 'overview' ? 'Analytics Overview' : tab === 'stock' ? 'Stock Statistics' : 'Low Stock Alerts'}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {analytics ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(analytics).filter(([k]) => typeof analytics[k] === 'number' || typeof analytics[k] === 'string').slice(0, 8).map(([key, value]) => (
                    <div key={key} className="bg-white rounded-lg shadow p-6">
                      <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                    </div>
                  ))}
                </div>

                {/* Charts data as tables */}
                {analytics.monthlyData && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(analytics.monthlyData[0] || {}).map(k => (
                              <th key={k} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {analytics.monthlyData.map((row, i) => (
                            <tr key={i}>
                              {Object.values(row).map((v, j) => (
                                <td key={j} className="px-4 py-3 text-sm text-gray-700">{typeof v === 'number' ? v.toLocaleString() : String(v)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Raw JSON fallback */}
                {!analytics.monthlyData && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Analytics Data</h3>
                    <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto max-h-96">{JSON.stringify(analytics, null, 2)}</pre>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">No analytics data available</p>
              </div>
            )}
          </div>
        )}

        {/* Stock Statistics Tab */}
        {activeTab === 'stock' && (
          <div className="space-y-6">
            {stockStats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(stockStats).filter(([, v]) => typeof v === 'number').map(([key, value]) => (
                    <div key={key} className="bg-white rounded-lg shadow p-6">
                      <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Stock Details</h3>
                  <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto max-h-96">{JSON.stringify(stockStats, null, 2)}</pre>
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">No stock statistics available</p>
              </div>
            )}
          </div>
        )}

        {/* Low Stock Alerts Tab */}
        {activeTab === 'low-stock' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Low Stock Alerts</h3>
              {Array.isArray(lowStock) && lowStock.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Qty</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Qty</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lowStock.map((item, idx) => (
                        <tr key={item._id || idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.product?.name || item.productName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.warehouse?.name || item.warehouseName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.currentQuantity ?? item.quantity ?? 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.minimumQuantity ?? item.minQuantity ?? 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Low Stock
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-green-600 text-lg font-medium">All stock levels are healthy!</p>
                  <p className="text-gray-500 mt-1">No low stock alerts at this time.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
