import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../../components/layouts/DashboardLayout';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';

export default function SubUserDetails() {
  const [subUser, setSubUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchSubUser();
    }
  }, [id]);

  const fetchSubUser = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/man-user/sub-users/${id}`);
      setSubUser(response.data);
    } catch (error) {
      console.error('Error fetching sub-user:', error);
      toast.error('Failed to fetch sub-user details');
      router.push('/man-user/sub-users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this sub-user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/man-user/sub-users/${id}`);
      toast.success('Sub-user deleted successfully');
      router.push('/man-user/sub-users');
    } catch (error) {
      console.error('Error deleting sub-user:', error);
      toast.error('Failed to delete sub-user');
    }
  };

  const toggleStatus = async () => {
    try {
      const response = await api.put(`/man-user/sub-users/${id}`, {
        isActive: !subUser.isActive
      });
      setSubUser(response.data);
      toast.success(`Sub-user ${subUser.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      console.error('Error updating sub-user status:', error);
      toast.error('Failed to update sub-user status');
    }
  };

  const getModuleLabel = (moduleId) => {
    const moduleMap = {
      'buyers': 'Buyer Management',
      'purchase-orders': 'Purchase Orders',
      'inventory': 'Inventory Reports'
    };
    return moduleMap[moduleId] || moduleId;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!subUser) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Sub-user not found</p>
          <Link 
            href="/man-user/sub-users"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Sub-Users
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/man-user/sub-users"
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Sub-Users
            </Link>
            <div className="flex space-x-3">
              <Link 
                href={`/man-user/sub-users/${id}/edit`}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={toggleStatus}
                className={`px-4 py-2 rounded-md transition-colors ${
                  subUser.isActive
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {subUser.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{subUser.name}</h1>
          <div className="flex items-center mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              subUser.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {subUser.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{subUser.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{subUser.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900">{subUser.role}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        subUser.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subUser.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(subUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(subUser.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Module Access */}
            <div className="bg-white shadow rounded-lg mt-6">
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Module Access</h3>
                <div className="grid grid-cols-1 gap-3">
                  {subUser.modules.map((module, index) => (
                    <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {getModuleLabel(module)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Access granted to this module
                        </p>
                      </div>
                    </div>
                  ))}
                  {subUser.modules.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No modules assigned
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link 
                    href={`/man-user/sub-users/${id}/edit`}
                    className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit Details
                  </Link>
                  <button
                    onClick={toggleStatus}
                    className={`block w-full text-center py-2 px-4 rounded-md transition-colors ${
                      subUser.isActive
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {subUser.isActive ? 'Deactivate User' : 'Activate User'}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="block w-full bg-red-600 text-white text-center py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Modules</span>
                    <span className="text-sm font-medium">{subUser.modules.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Account Age</span>
                    <span className="text-sm font-medium">
                      {Math.floor((new Date() - new Date(subUser.createdAt)) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}