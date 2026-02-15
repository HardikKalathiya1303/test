import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../../components/layouts/DashboardLayout';
import { api } from '../../../../services/api';
import { toast } from 'react-toastify';

export default function EditSubUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    modules: [],
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const availableModules = [
    { id: 'buyers', label: 'Buyer Management' },
    { id: 'purchase-orders', label: 'Purchase Orders' },
    { id: 'inventory', label: 'Inventory Reports' }
  ];

  useEffect(() => {
    if (id) {
      fetchSubUser();
    }
  }, [id]);

  const fetchSubUser = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/man-user/sub-users/${id}`);
      const user = response.data;
      setFormData({
        name: user.name,
        email: user.email,
        modules: user.modules,
        isActive: user.isActive
      });
    } catch (error) {
      console.error('Error fetching sub-user:', error);
      toast.error('Failed to fetch sub-user details');
      router.push('/man-user/sub-users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleModuleChange = (moduleId) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter(m => m !== moduleId)
        : [...prev.modules, moduleId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.modules.length === 0) {
      toast.error('Please select at least one module');
      return;
    }

    try {
      setSubmitting(true);
      await api.put(`/man-user/sub-users/${id}`, formData);
      
      toast.success('Sub-user updated successfully');
      router.push(`/man-user/sub-users/${id}`);
    } catch (error) {
      console.error('Error updating sub-user:', error);
      toast.error(error.response?.data?.message || 'Failed to update sub-user');
    } finally {
      setSubmitting(false);
    }
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

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              href={`/man-user/sub-users/${id}`}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Sub-User
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Sub-User</h1>
          <p className="text-gray-600 mt-2">Update sub-user information and module access</p>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Module Access */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Module Access *</h3>
              <div className="space-y-3">
                {availableModules.map((module) => (
                  <div key={module.id} className="flex items-center">
                    <input
                      id={module.id}
                      type="checkbox"
                      checked={formData.modules.includes(module.id)}
                      onChange={() => handleModuleChange(module.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={module.id} className="ml-3 text-sm text-gray-700">
                      {module.label}
                    </label>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Select the modules this sub-user will have access to
              </p>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
              <div className="flex items-center">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-3 text-sm text-gray-700">
                  Active (user can log in)
                </label>
              </div>
            </div>

            {/* Password Change Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Password Change
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      To change the password, the user will need to use the "Forgot Password" feature or 
                      contact an administrator to reset their password.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6">
              <Link 
                href={`/man-user/sub-users/${id}`}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Updating...' : 'Update Sub-User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}