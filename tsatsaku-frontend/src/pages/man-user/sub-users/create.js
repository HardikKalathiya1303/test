import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';

export default function CreateSubUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    modules: [],
    isActive: true
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const availableModules = [
    { id: 'buyers', label: 'Buyer Management' },
    { id: 'purchase-orders', label: 'Purchase Orders' },
    { id: 'inventory', label: 'Inventory Reports' }
  ];

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
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.modules.length === 0) {
      toast.error('Please select at least one module');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/man-user/sub-users', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        modules: formData.modules,
        isActive: formData.isActive
      });
      
      toast.success('Sub-user created successfully');
      router.push('/man-user/sub-users');
    } catch (error) {
      console.error('Error creating sub-user:', error);
      toast.error(error.response?.data?.message || 'Failed to create sub-user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              href="/man-user/sub-users"
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Sub-Users
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Sub-User</h1>
          <p className="text-gray-600 mt-2">Add a new sub-user with specific module access</p>
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

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    minLength="6"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    minLength="6"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.confirmPassword}
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

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6">
              <Link 
                href="/man-user/sub-users"
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Creating...' : 'Create Sub-User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}