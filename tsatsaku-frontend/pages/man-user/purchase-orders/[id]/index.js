import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../../components/layouts/DashboardLayout';
import { api } from '../../../../services/api';
import { toast } from 'react-toastify';

const STATUS_OPTIONS = [
  'pending', 'confirmed', 'in_production', 'quality_check',
  'ready_for_dispatch', 'dispatched_from_port', 'in_transit',
  'arrived_at_destination', 'delivered', 'cancelled', 'on_hold', 'returned'
];

export default function PurchaseOrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/man-user/purchase-orders/${id}`);
      if (response.data.success) {
        setOrder(response.data.data);
        setNewStatus(response.data.data?.status || '');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to fetch purchase order details');
      router.push('/man-user/purchase-orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order.status) return;
    try {
      setUpdatingStatus(true);
      const response = await api.put(`/man-user/purchase-orders/${id}`, { status: newStatus });
      if (response.data.success) {
        toast.success('Status updated successfully');
        fetchOrder();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'in_production': 'bg-purple-100 text-purple-800',
      'quality_check': 'bg-indigo-100 text-indigo-800',
      'ready_for_dispatch': 'bg-cyan-100 text-cyan-800',
      'dispatched_from_port': 'bg-sky-100 text-sky-800',
      'in_transit': 'bg-blue-100 text-blue-800',
      'arrived_at_destination': 'bg-teal-100 text-teal-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'on_hold': 'bg-orange-100 text-orange-800',
      'returned': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '-';
  };

  if (loading || !order) {
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
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <Link href="/man-user/purchase-orders" className="text-blue-600 hover:text-blue-700 font-medium">
              &larr; Back to Purchase Orders
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              Order {order.poNumber}
            </h1>
            <div className="mt-2 flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {formatStatus(order.status)}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                order.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                order.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {order.priority || 'normal'} priority
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Buyer Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Buyer Information</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.buyer?.companyName || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contact</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {order.buyer?.userId?.firstName} {order.buyer?.userId?.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.buyer?.userId?.email || '-'}</dd>
                </div>
              </dl>
            </div>

            {/* Products */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Products</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.products?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.productName || item.product?.name || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.sku || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">${(item.unitPrice || 0).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                          ${(item.totalPrice || item.quantity * item.unitPrice || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status History</h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {order.statusHistory.map((entry, index) => (
                      <li key={index}>
                        <div className="relative pb-8">
                          {index !== order.statusHistory.length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusColor(entry.status)}`}>
                                <span className="text-xs">{index + 1}</span>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5">
                              <p className="text-sm text-gray-900 font-medium">{formatStatus(entry.status)}</p>
                              <p className="text-xs text-gray-500">
                                {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '-'}
                                {entry.notes && ` - ${entry.notes}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Update Status */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Status</h3>
              <div className="space-y-3">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{formatStatus(s)}</option>
                  ))}
                </select>
                <button onClick={handleStatusUpdate} disabled={updatingStatus || newStatus === order.status}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium">
                  {updatingStatus ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${(order.subtotal || 0).toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount ({order.discount}%)</span>
                    <span className="font-medium text-red-600">-${(order.discountAmount || 0).toFixed(2)}</span>
                  </div>
                )}
                {order.shippingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">${(order.shippingCost || 0).toFixed(2)}</span>
                  </div>
                )}
                {order.taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="font-medium">${(order.taxAmount || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${(order.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500 block">Delivery Address</span>
                  <span className="text-sm font-medium">{order.deliveryAddress || '-'}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Expected Date</span>
                  <span className="text-sm font-medium">
                    {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Payment Terms</span>
                  <span className="text-sm font-medium">{order.paymentTerms || '-'}</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {order.qrCode && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">QR Code</h3>
                <div className="flex justify-center">
                  <img src={order.qrCode} alt="Order QR Code" className="w-40 h-40" />
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                  </span>
                </div>
                {order.internalNotes && (
                  <div>
                    <span className="text-sm text-gray-500 block">Notes</span>
                    <span className="text-sm">{order.internalNotes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
