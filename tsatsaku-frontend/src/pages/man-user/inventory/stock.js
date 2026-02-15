import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import authService from '../../../services/authService';
import api from '../../../services/api';
import showToast from '../../../utils/toast';

export default function StockManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockAction, setStockAction] = useState('in');
  const [stockData, setStockData] = useState({
    quantity: 0,
    reason: '',
    notes: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadWarehouses();
    }
  }, [user]);

  useEffect(() => {
    if (user && warehouses.length > 0) {
      loadStocks();
    }
  }, [currentPage, searchTerm, warehouse]);

  const checkAuth = async () => {
    try {
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser || currentUser.role !== 'man_user') {
        router.push('/login');
        return;
      }

      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  };

  const loadWarehouses = async () => {
    try {
      const response = await api.get('/man-user/warehouses?limit=100');
      if (response.data.success && response.data.data) {
        setWarehouses(response.data.data.warehouses || []);
        if (response.data.data.warehouses?.length > 0) {
          setWarehouse(response.data.data.warehouses[0]._id);
        }
      }
    } catch (error) {
      console.error('Failed to load warehouses:', error);
    }
  };

  const loadStocks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        search: searchTerm,
        warehouse: warehouse
      });

      const response = await api.get(`/man-user/warehouse-stock?${params}`);
      if (response.data.success && response.data.data) {
        setStocks(response.data.data.stocks || []);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to load stocks:', error);
      showToast.error('Failed to load stocks');
    } finally {
      setLoading(false);
    }
  };

  const handleStockOperation = async () => {
    if (!stockData.quantity || stockData.quantity <= 0) {
      showToast.error('Please enter a valid quantity');
      return;
    }

    if (!stockData.reason.trim()) {
      showToast.error('Please provide a reason');
      return;
    }

    try {
      const response = await api.post(`/man-user/warehouse-stock/${selectedStock._id}/${stockAction}`, stockData);
      if (response.data.success) {
        showToast.success(`Stock ${stockAction} operation successful`);
        setShowStockModal(false);
        setSelectedStock(null);
        setStockData({ quantity: 0, reason: '', notes: '' });
        await loadStocks();
      }
    } catch (error) {
      console.error('Failed to perform stock operation:', error);
      showToast.error(error.response?.data?.message || 'Failed to perform operation');
    }
  };

  const openStockModal = (stock, action) => {
    setSelectedStock(stock);
    setStockAction(action);
    setStockData({ quantity: 0, reason: '', notes: '' });
    setShowStockModal(true);
  };

  const getStockStatus = (stock) => {
    const usagePercent = (stock.used / stock.quantity) * 100;
    if (usagePercent > 80) return 'critical';
    if (usagePercent > 50) return 'warning';
    return 'good';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading Stock...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Stock Management | Tsatsaku</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Warehouse Stock Management</h1>
            <p className="text-gray-500 mt-1">Track and manage warehouse inventory</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={warehouse}
                onChange={(e) => {
                  setWarehouse(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Warehouse</option>
                {warehouses.map(w => (
                  <option key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => loadStocks()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Stock Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {stocks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Warehouse</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Total Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Used</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Available</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock) => {
                      const status = getStockStatus(stock);
                      const available = stock.quantity - stock.used;
                      return (
                        <tr key={stock._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{stock.productName || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{stock.warehouseName || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{stock.quantity}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{stock.used || 0}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{available}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm space-x-2">
                            <button
                              onClick={() => openStockModal(stock, 'in')}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Stock In
                            </button>
                            <button
                              onClick={() => openStockModal(stock, 'out')}
                              className="text-red-600 hover:text-red-900 font-medium"
                            >
                              Stock Out
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No stock records found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">{currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stock Operation Modal */}
      {showStockModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Stock {stockAction === 'in' ? 'In' : 'Out'} - {selectedStock.productName}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Available: {selectedStock.quantity - selectedStock.used} units
            </p>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Quantity"
                value={stockData.quantity}
                onChange={(e) => setStockData({ ...stockData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={stockData.reason}
                onChange={(e) => setStockData({ ...stockData, reason: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Reason</option>
                {stockAction === 'in' ? (
                  <>
                    <option value="purchase">Purchase</option>
                    <option value="return">Return</option>
                    <option value="transfer">Transfer</option>
                    <option value="adjustment">Stock Adjustment</option>
                  </>
                ) : (
                  <>
                    <option value="sale">Sale</option>
                    <option value="damage">Damage</option>
                    <option value="loss">Loss</option>
                    <option value="transfer">Transfer</option>
                    <option value="adjustment">Stock Adjustment</option>
                  </>
                )}
              </select>
              <textarea
                placeholder="Additional notes..."
                value={stockData.notes}
                onChange={(e) => setStockData({ ...stockData, notes: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleStockOperation}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  stockAction === 'in'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {stockAction === 'in' ? 'Stock In' : 'Stock Out'}
              </button>
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setSelectedStock(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}