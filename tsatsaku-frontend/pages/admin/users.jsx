import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch sub-admins and man_users from their respective endpoints
      const [subAdminsRes, buyersRes] = await Promise.allSettled([
        api.get('/admin/sub-admins', { params: { page: currentPage, limit: 50 } }),
        api.get('/admin/buyers', { params: { page: currentPage, limit: 50 } }),
      ]);

      let allUsers = [];

      if (subAdminsRes.status === 'fulfilled') {
        const subs = subAdminsRes.value.data.subAdmins || subAdminsRes.value.data.data || [];
        allUsers = [...allUsers, ...subs.map(u => ({ ...u, userType: 'Sub-Admin' }))];
      }

      if (buyersRes.status === 'fulfilled') {
        const buyers = buyersRes.value.data.buyers || buyersRes.value.data.data || [];
        allUsers = [...allUsers, ...buyers.map(u => ({ ...u, userType: 'Buyer' }))];
      }

      // Filter by search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        allUsers = allUsers.filter(u =>
          (u.firstName || u.name || '').toLowerCase().includes(term) ||
          (u.lastName || '').toLowerCase().includes(term) ||
          (u.email || '').toLowerCase().includes(term)
        );
      }

      // Filter by role/type
      if (roleFilter !== 'all') {
        allUsers = allUsers.filter(u => u.userType === roleFilter);
      }

      setUsers(allUsers);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const getName = (user) => {
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    return user.name || user.companyName || 'N/A';
  };

  if (loading && users.length === 0) {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">View and manage all users in the system</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input type="text" placeholder="Search users by name or email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="Sub-Admin">Sub-Admins</option>
              <option value="Buyer">Buyers</option>
            </select>
            <button onClick={fetchUsers} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
              Refresh
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-700">
                                {getName(user).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{getName(user)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.userType === 'Sub-Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>{user.userType}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            (user.isActive !== false && user.status !== 'inactive')
                              ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>{(user.isActive !== false && user.status !== 'inactive') ? 'Active' : 'Inactive'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
