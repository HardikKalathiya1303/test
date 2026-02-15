import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../../components/layouts/DashboardLayout';
import { api } from '../../../../services/api';
import { toast } from 'react-toastify';

export default function ViewSubUser() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/man-user/sub-users/${id}`);
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to fetch user details');
      router.push('/man-user/sub-users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async () => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      const response = await api.patch(`/man-user/sub-users/${id}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        setUser(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const getModulePermissions = (moduleAccess) => {
    if (!moduleAccess || typeof moduleAccess !== 'object') return [];
    
    return Object.entries(moduleAccess).map(([module, permissions]) => ({
      module,
      permissions: permissions || {}
    })).filter(item => 
      item.permissions.view || item.permissions.add || item.permissions.edit
    );
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

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">User not found</div>
          <Link 
            href="/man-user/sub-users"
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Sub-Users
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const modulePermissions = getModulePermissions(user.moduleAccess);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <Link 
                  href="/man-user/sub-users"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Sub-Users
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600 mt-2">Sub-user details and permissions</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={toggleUserStatus}
                className={`px-4 py-2 rounded-md font-medium ${
                  user.status === 'active'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {user.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <Link
                href={`/man-user/sub-users/${id}/edit`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Edit User
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basic Information */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">First Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.firstName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.lastName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.phone || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Module Permissions */}
            <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Module Permissions</h3>
              </div>
              <div className="p-6">
                {modulePermissions.length > 0 ? (
                  <div className="space-y-4">
                    {modulePermissions.map(({ module, permissions }) => (
                      <div key={module} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 capitalize">
                            {module.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <div className="flex space-x-2">
                            {permissions.view && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                View
                              </span>
                            )}
                            {permissions.add && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Add
                              </span>
                            )}
                            {permissions.edit && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Edit
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500">No module permissions assigned</div>
                    <Link
                      href={`/man-user/sub-users/${id}/edit`}
                      className="mt-2 text-blue-600 hover:text-blue-700"
                    >
                      Edit user to assign permissions
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-4">
                <Link
                  href={`/man-user/sub-users/${id}/edit`}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit User
                </Link>
                <button
                  onClick={toggleUserStatus}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    user.status === 'active'
                      ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  }`}
                >
                  {user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                </button>
                <Link
                  href="/man-user/sub-users"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to List
                </Link>
              </div>
            </div>

            {/* User Stats */}
            <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">User Statistics</h3>
              </div>
              <div className="p-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Account Age</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.createdAt 
                        ? Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) + ' days'
                        : 'Unknown'
                      }
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.updatedAt 
                        ? new Date(user.updatedAt).toLocaleDateString()
                        : 'Never'
                      }
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Modules Assigned</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {modulePermissions.length} modules
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}