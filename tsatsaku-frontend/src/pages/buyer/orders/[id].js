import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import authService from '../../../../services/authService';
import api from '../../../../services/api';
import showToast from '../../../../utils/toast';

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (id) {
      checkAuth();
    }
  }, [id]);

  useEffect(() => {
    if (user && id) {
      loadOrder();
    }
  }, [user, id]);

  const checkAuth = async () => {
    try {
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser || currentUser.role !== 'buyer') {
        router.push('/login');
        return;
      }

      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  };

  const loadOrder = async () => {
    try {
      const response = await api.get(`/buyer/purchase-orders/${id}`);
      if (response.data.success && response.data.data) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      showToast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      showToast.error('Please provide a reason for cancellation');
      return;
    }

    setCanceling(true);
    try {
      const response = await api.post(`/buyer/purchase-orders/${id}/cancel`, { reason: cancelReason });
      if (response.data.success) {
        showToast.success('Order cancelled successfully');
        setShowCancelModal(false);
        await loadOrder();
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      showToast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading Order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <button
            onClick={() => router.push('/buyer/orders')}
            className="text-blue-600 hover:text-blue-900"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  return (
    <>
      <Head>
        <title>Order {order.orderNumber} | Tsatsaku</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/buyer/orders')}
              className="text-blue-600 hover:text-blue-900 mb-4"
            >
              ← Back to Orders
            </button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order {order.orderNumber}</h1>
                <p className="text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-4 py-2 rounded-lg text-sm font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Order Date</p>
                <p className="text-gray-900 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Items</p>
                <p className="text-gray-900 font-medium">{order.items?.length || 0}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Amount</p>
                <p className="text-gray-900 font-medium font-bold text-lg">${order.totalAmount}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Delivery Address</p>
                <p className="text-gray-900 font-medium text-sm">{order.deliveryAddress || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Items</h2>
            <div className="space-y-4">
              {order.items && order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium text-gray-900">{item.productName || 'Product'}</p>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${item.unitPrice}</p>
                    <p className="text-gray-500 text-sm">Subtotal: ${item.quantity * item.unitPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Status History</h2>
            <div className="space-y-4">
              {order.statusHistory && order.statusHistory.length > 0 ? (
                order.statusHistory.map((history, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="flex-shrink-0 w-3 h-3 bg-blue-600 rounded-full mt-1.5 mr-4"></div>
                    <div>
                      <p className="font-medium text-gray-900">{history.status}</p>
                      <p className="text-gray-500 text-sm">{new Date(history.changedAt).toLocaleString()}</p>
                      {history.comment && <p className="text-gray-600 text-sm mt-1">{history.comment}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No status history available</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            {order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'shipped' && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Order
              </button>
            )}
            <button
              onClick={() => router.push('/buyer/orders')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to cancel this order? Please provide a reason:</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={canceling}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {canceling ? 'Canceling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}