import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import authService from '../../../services/authService';
import api from '../../../services/api';
import showToast from '../../../utils/toast';

export default function WarehousesManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    capacity: 0,
    manager: '',
    phone: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadWarehouses();
    }
  }, [currentPage, searchTerm]);

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
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        search: searchTerm
      });

      const response = await api.get(`/man-user/warehouses?${params}`);
      if (response.data.success && response.data.data) {
        setWarehouses(response.data.data.warehouses || []);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to load warehouses:', error);
      showToast.error('Failed to load warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWarehouse = async () => {
    if (!formData.name || !formData.location) {
      showToast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await api.post('/man-user/warehouses', formData);
      if (response.data.success) {
        showToast.success('Warehouse created successfully');
        setShowCreateModal(false);
        setFormData({ name: '', location: '', address: '', capacity: 0, manager: '', phone: '' });
        await loadWarehouses();
      }
    } catch (error) {
      console.error('Failed to create warehouse:', error);
      showToast.error(error.response?.data?.message || 'Failed to create warehouse');
    }
  };

  const handleUpdateWarehouse = async () => {
    try {
      const response = await api.put(`/man-user/warehouses/${selectedWarehouse._id}`, formData);
      if (response.data.success) {
        showToast.success('Warehouse updated successfully');
        setShowEditModal(false);
        setSelectedWarehouse(null);
        await loadWarehouses();
      }
    } catch (error) {
      console.error('Failed to update warehouse:', error);
      showToast.error(error.response?.data?.message || 'Failed to update warehouse');
    }
  };

  const handleDeleteWarehouse = async (warehouseId) => {
    if (!confirm('Are you sure you want to delete this warehouse?')) return;

    try {
      const response = await api.delete(`/man-user/warehouses/${warehouseId}`);
      if (response.data.success) {
        showToast.success('Warehouse deleted successfully');
        await loadWarehouses();
      }
    } catch (error) {
      console.error('Failed to delete warehouse:', error);
      showToast.error(error.response?.data?.message || 'Failed to delete warehouse');
    }
  };

  const openEditModal = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      location: warehouse.location,
      address: warehouse.address || '',
      capacity: warehouse.capacity || 0,
      manager: warehouse.manager || '',
      phone: warehouse.phone || ''
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading Warehouses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Warehouses Management | Tsatsaku</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Warehouse Management</h1>
              <p className="text-gray-500 mt-1">Manage storage and warehouse facilities</p>
            </div>
            <button
              onClick={() => {
                setFormData({ name: '', location: '', address: '', capacity: 0, manager: '', phone: '' });
                setShowCreateModal(true);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Warehouse
            </button>
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <input
              type="text"
              placeholder="Search warehouses..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Warehouses Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {warehouses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Capacity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Manager</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warehouses.map((warehouse) => (
                      <tr key={warehouse._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{warehouse.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{warehouse.location}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{warehouse.address || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{warehouse.capacity || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{warehouse.manager || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => openEditModal(warehouse)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteWarehouse(warehouse._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No warehouses found</p>
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Warehouse</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Warehouse Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Manager Name"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreateWarehouse}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Warehouse</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Warehouse Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Manager Name"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleUpdateWarehouse}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedWarehouse(null);
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