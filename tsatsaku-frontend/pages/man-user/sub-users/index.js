import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';

export default function SubUsers() {
  const router = useRouter();
  const [subUsers, setSubUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchSubUsers();
  }, []);

  const fetchSubUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/man-user/sub-users');
      if (response.data.success) {
        setSubUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching sub-users:', error);
      toast.error('Failed to fetch sub-users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await api.patch(`/man-user/sub-users/${userId}/status`, {
        status: newStatus
      });
      if (response.data.success) {
        toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        fetchSubUsers();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const filteredSubUsers = Array.isArray(subUsers) ? subUsers.filter(user =>
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubUsers.length / itemsPerPage);

  const getModuleNames = (moduleAccess) => {
    if (!moduleAccess || typeof moduleAccess !== 'object') return 'None';
    const modules = Object.entries(moduleAccess)
      .filter(([, val]) => {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'object' && val) return val.view || val.add || val.edit;
        return false;
      })
      .map(([key]) => key);
    return modules.length > 0 ? modules.join(', ') : 'None';
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
            <h1 className="text-3xl font-bold text-gray-900">Sub-Users Management</h1>
            <p className="text-gray-600 mt-1">Manage your sub-users and their permissions</p>
          </div>
          <button
            onClick={() => router.push('/man-user/sub-users/create')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
          >
            Add Sub-User
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <button onClick={fetchSubUsers} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {currentItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module Access</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-xs bg-gray-100 rounded px-2 py-1">{getModuleNames(user.moduleAccess)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>{user.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onClick={() => router.push(`/man-user/sub-users/${user._id}`)} className="text-blue-600 hover:text-blue-900">View</button>
                        <button onClick={() => router.push(`/man-user/sub-users/${user._id}/edit`)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button
                          onClick={() => toggleUserStatus(user._id, user.status)}
                          className={user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No sub-users found</div>
              <p className="text-gray-400 mt-2">Create your first sub-user to get started</p>
              <button onClick={() => router.push('/man-user/sub-users/create')} className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
                Create Sub-User
              </button>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">{Math.min(indexOfLastItem, filteredSubUsers.length)}</span> of{' '}
              <span className="font-medium">{filteredSubUsers.length}</span> results
            </p>
            <nav className="inline-flex rounded-md shadow-sm -space-x-px">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border text-sm font-medium ${
                    page === currentPage ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}>{page}</button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
