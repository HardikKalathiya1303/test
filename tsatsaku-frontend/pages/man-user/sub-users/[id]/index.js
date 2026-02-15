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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">First Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.firstName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.lastName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.phone || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
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
                  {modulePermissions.length > 0 ? modulePermissions.map(({ module, permissions }) => (
                    <div key={module} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <p className="ml-3 text-sm font-medium text-gray-900 capitalize">{module.replace(/([A-Z])/g, ' $1').trim()}</p>
                      </div>
                      <div className="flex space-x-2">
                        {(typeof permissions === 'object' && permissions.view) && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">View</span>}
                        {(typeof permissions === 'object' && permissions.add) && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Add</span>}
                        {(typeof permissions === 'object' && permissions.edit) && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Edit</span>}
                        {typeof permissions === 'boolean' && permissions && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Full Access</span>}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-gray-500">No modules assigned</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href={`/man-user/sub-users/${id}/edit`}
                    className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700">
                    Edit Details
                  </Link>
                  <button onClick={toggleUserStatus}
                    className={`block w-full text-center py-2 px-4 rounded-md ${
                      user.status === 'active' ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-green-600 text-white hover:bg-green-700'
                    }`}>
                    {user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Modules</span>
                    <span className="text-sm font-medium">{modulePermissions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Account Age</span>
                    <span className="text-sm font-medium">
                      {user.createdAt ? Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) + ' days' : 'Unknown'}
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