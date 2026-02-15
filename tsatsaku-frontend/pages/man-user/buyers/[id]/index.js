import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../../components/layouts/DashboardLayout';
import { api } from '../../../../services/api';
import { toast } from 'react-toastify';

export default function BuyerDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [buyer, setBuyer] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchBuyer();
  }, [id]);

  const fetchBuyer = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/man-user/buyers/${id}`);
      if (response.data.success) {
        setBuyer(response.data.data?.buyer || response.data.data);
        setOrderStats(response.data.data?.orderStats || null);
      }
    } catch (error) {
      console.error('Error fetching buyer:', error);
      toast.error('Failed to fetch buyer details');
      router.push('/man-user/buyers');
    } finally {
      setLoading(false);
    }
  };

  const toggleBuyerStatus = async () => {
    try {
      const newStatus = buyer.status === 'active' ? 'inactive' : 'active';
      const response = await api.patch(`/man-user/buyers/${id}`, { status: newStatus });
      if (response.data.success) {
        toast.success(`Buyer ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        fetchBuyer();
      }
    } catch (error) {
      toast.error('Failed to update buyer status');
    }
  };

  if (loading || !buyer) {
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
            <Link href="/man-user/buyers" className="text-blue-600 hover:text-blue-700 font-medium">
              &larr; Back to Buyers
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              {buyer.companyName || `${buyer.userId?.firstName || ''} ${buyer.userId?.lastName || ''}`}
            </h1>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                buyer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {buyer.status || 'active'}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link href={`/man-user/buyers/${id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
              Edit Buyer
            </Link>
            <button onClick={toggleBuyerStatus}
              className={`px-4 py-2 rounded-md font-medium ${
                buyer.status === 'active'
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}>
              {buyer.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {buyer.userId?.firstName} {buyer.userId?.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{buyer.userId?.email || '-'}</dd>
                </div>
              </dl>
            </div>

            {/* Company Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{buyer.companyName || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Industry</dt>
                  <dd className="mt-1 text-sm text-gray-900">{buyer.companyInfo?.industry || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Registration Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{buyer.companyInfo?.registrationNumber || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tax ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{buyer.companyInfo?.taxId || '-'}</dd>
                </div>
              </dl>
            </div>

            {/* Contact Person */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Person</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{buyer.contactPerson?.name || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{buyer.contactPerson?.email || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{buyer.contactPerson?.phone || '-'}</dd>
                </div>
              </dl>
            </div>

            {/* Address */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Street</dt>
                  <dd className="mt-1 text-sm text-gray-900">{buyer.address?.street || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">City</dt>
                  <dd className="mt-1 text-sm text-gray-900">{buyer.address?.city || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">State</dt>
                  <dd className="mt-1 text-sm text-gray-900">{buyer.address?.state || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Country</dt>
                  <dd className="mt-1 text-sm text-gray-900">{buyer.address?.country || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                  <dd className="mt-1 text-sm text-gray-900">{buyer.address?.postalCode || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Sidebar - Order Stats */}
          <div className="space-y-6">
            {orderStats && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Orders</span>
                    <span className="text-sm font-medium">{orderStats.totalOrders || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Amount</span>
                    <span className="text-sm font-medium">${(orderStats.totalAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Pending</span>
                    <span className="text-sm font-medium">{orderStats.pending || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Processing</span>
                    <span className="text-sm font-medium">{orderStats.processing || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Completed</span>
                    <span className="text-sm font-medium">{orderStats.completed || 0}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Created</span>
                  <span className="text-sm font-medium">
                    {buyer.createdAt ? new Date(buyer.createdAt).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Updated</span>
                  <span className="text-sm font-medium">
                    {buyer.updatedAt ? new Date(buyer.updatedAt).toLocaleDateString() : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
