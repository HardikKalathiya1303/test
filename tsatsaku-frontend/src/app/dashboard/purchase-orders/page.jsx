'use client';

import { useState, useEffect } from 'react';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import StatusTimeline from '@/components/ui/StatusTimeline';
import { getPurchaseOrders, getPurchaseOrder } from '@/services/buyer.service';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState({ search: '', status: '', startDate: '', endDate: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => { fetchOrders(); }, [pagination.page, filters.status]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page, limit: pagination.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };
      const response = await getPurchaseOrders(params);
      // Normalize response shapes: backend sometimes returns { success, data, pagination }
      // or returns an array directly. Log the raw payload for debugging.
      console.log('getPurchaseOrders payload:', response);

      const payload = response?.data !== undefined ? response.data : response;

      if (payload?.success) {
        setOrders(payload.data || []);
        setPagination(prev => ({ ...prev, total: payload.pagination?.total || 0, pages: payload.pagination?.pages || 0 }));
      } else if (Array.isArray(payload)) {
        setOrders(payload);
        setPagination(prev => ({ ...prev, total: payload.length, pages: Math.max(1, Math.ceil(payload.length / pagination.limit)) }));
      } else if (payload?.items) {
        setOrders(payload.items || []);
        setPagination(prev => ({ ...prev, total: payload.total || payload.pagination?.total || 0, pages: payload.pages || payload.pagination?.pages || 0 }));
      } else {
        // Unknown payload shape — attempt to set orders if possible
        if (payload) {
          setOrders(payload);
        } else {
          setOrders([]);
        }
      }
    } catch (err) { console.error('Failed to fetch orders:', err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPagination(prev => ({ ...prev, page: 1 })); fetchOrders(); };
  const handleFilterChange = (name, value) => { setFilters(prev => ({ ...prev, [name]: value })); if (name === 'status') setPagination(prev => ({ ...prev, page: 1 })); };
  const clearFilters = () => { setFilters({ search: '', status: '', startDate: '', endDate: '' }); setPagination(prev => ({ ...prev, page: 1 })); };

  const viewOrderDetails = async (orderId) => {
    setSelectedOrder(orderId);
    setLoadingDetails(true);
    try {
      const response = await getPurchaseOrder(orderId);
      if (response.success) setOrderDetails(response.data);
    } catch (err) { console.error('Failed to fetch order details:', err); }
    finally { setLoadingDetails(false); }
  };

  const closeModal = () => { setSelectedOrder(null); setOrderDetails(null); };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Purchase Orders</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">View and manage your orders</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md transition-colors">
          <span className="material-icons-outlined text-lg mr-2">add</span>
          Create Order
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons-outlined text-gray-400 text-xl">search</span>
            </div>
            <input type="text" placeholder="Search by order number..."
              value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-gray-50 dark:bg-slate-800 text-sm placeholder-text-secondary-light text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors" />
          </div>

          <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full sm:w-48 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-gray-50 dark:bg-slate-800 text-sm text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors">
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>

          <button type="submit" className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm">
            Search
          </button>

          <button type="button" onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
            <span className="material-icons-outlined text-lg">filter_list</span>
            Filters
          </button>
        </form>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Start Date</label>
              <input type="date" value={filters.startDate} onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-gray-50 dark:bg-slate-800 text-sm text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">End Date</label>
              <input type="date" value={filters.endDate} onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-gray-50 dark:bg-slate-800 text-sm text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
            </div>
            <div className="flex items-end">
              <button type="button" onClick={clearFilters}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium flex items-center gap-1">
                <span className="material-icons-outlined text-lg">close</span>
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-800 border-b border-border-light dark:border-border-dark">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Order Number</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-primary dark:text-blue-400">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1.5">
                      <span className="material-icons-outlined text-sm">calendar_today</span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary-light dark:text-text-primary-dark">{order.products?.length || 0} items</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(order.currentStatus)}>{formatStatus(order.currentStatus)}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-primary-light dark:text-text-primary-dark text-right">${order.totalAmount?.toLocaleString() || '0'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button onClick={() => viewOrderDetails(order._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary dark:text-blue-400 hover:bg-primary/10 dark:hover:bg-blue-900/40 rounded-lg transition-colors">
                        <span className="material-icons-outlined text-lg">visibility</span>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="material-icons-outlined text-5xl text-gray-300 mb-4 block">inventory_2</span>
            <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">No orders found</p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
              {filters.search || filters.status ? 'Try adjusting your filters' : 'Your orders will appear here'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {orders.length > 0 && (
          <div className="px-6 py-4 border-t border-border-light dark:border-border-dark">
            <Pagination currentPage={pagination.page} totalPages={pagination.pages}
              onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
              totalItems={pagination.total} itemsPerPage={pagination.limit} />
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal isOpen={!!selectedOrder} onClose={closeModal} title="Order Details" size="lg">
        {loadingDetails ? (
          <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>
        ) : orderDetails ? (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{orderDetails.orderNumber}</h3>
                <p className="text-sm text-gray-500">Placed on {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge variant={getStatusVariant(orderDetails.currentStatus)} size="lg">{formatStatus(orderDetails.currentStatus)}</Badge>
            </div>

            {/* Status Timeline */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Order Status</h4>
              <StatusTimeline statuses={orderDetails.statusHistory || []} />
            </div>

            {/* Products List */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Products</h4>
              <div className="space-y-3">
                {orderDetails.products?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="material-icons-outlined text-gray-400">inventory_2</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.product?.name || 'Product'}</p>
                        <p className="text-sm text-gray-500">SKU: {item.product?.sku || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">${orderDetails.subtotal?.toLocaleString() || '0'}</span>
              </div>
              {orderDetails.tax > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Tax</span><span className="text-gray-900">${orderDetails.tax?.toLocaleString()}</span>
                </div>
              )}
              {orderDetails.shippingCost > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Shipping</span><span className="text-gray-900">${orderDetails.shippingCost?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-lg text-gray-900">${orderDetails.totalAmount?.toLocaleString() || '0'}</span>
              </div>
            </div>

            {/* Shipping Info */}
            {orderDetails.shippingAddress && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-500">
                  {orderDetails.shippingAddress.street}<br />
                  {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}<br />
                  {orderDetails.shippingAddress.country}
                </p>
              </div>
            )}

            {/* QR Code */}
            {orderDetails.qrCode && (
              <div className="border-t border-gray-200 pt-4 text-center">
                <h4 className="font-medium text-gray-900 mb-2">QR Code</h4>
                <img src={orderDetails.qrCode} alt="Order QR Code" className="mx-auto w-32 h-32" />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8"><p className="text-gray-500">Failed to load order details</p></div>
        )}
      </Modal>
    </div>
  );
}

function getStatusVariant(status) {
  const variants = { 'pending': 'warning', 'confirmed': 'info', 'processing': 'info', 'shipped': 'primary', 'in_transit': 'primary', 'delivered': 'success', 'completed': 'success', 'cancelled': 'danger' };
  return variants[status?.toLowerCase()] || 'secondary';
}

function formatStatus(status) {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
