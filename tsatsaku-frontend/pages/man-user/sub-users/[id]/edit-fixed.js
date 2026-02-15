import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../../components/layouts/DashboardLayout';
import { api } from '../../../../services/api';
import { toast } from 'react-toastify';

export default function EditSubUser() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    moduleAccess: {},
    status: 'active'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const availableModules = [
    { id: 'buyers', label: 'Buyer Management', description: 'Manage buyer information and profiles' },
    { id: 'purchaseOrders', label: 'Purchase Orders', description: 'View and manage purchase orders' },
    { id: 'inventory', label: 'Inventory Reports', description: 'Access inventory reports and analytics' },
    { id: 'dashboard', label: 'Dashboard', description: 'Access to dashboard overview and statistics' }
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
      if (response.data.success) {
        const user = response.data.data;
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          moduleAccess: user.moduleAccess || {},
          status: user.status || 'active'
        });
      }
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

  const handleModulePermissionChange = (moduleId, permissionType, checked) => {
    setFormData(prev => ({
      ...prev,
      moduleAccess: {
        ...prev.moduleAccess,
        [moduleId]: {
          ...prev.moduleAccess[moduleId],
          [permissionType]: checked
        }
      }
    }));
  };

  const hasModuleAccess = (moduleId) => {
    const modulePerms = formData.moduleAccess[moduleId];
    return modulePerms && (modulePerms.view || modulePerms.add || modulePerms.edit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if at least one module has some permission
    const hasAnyAccess = Object.values(formData.moduleAccess).some(perms => 
      perms && (perms.view || perms.add || perms.edit)
    );
    
    if (!hasAnyAccess) {
      toast.error('Please grant at least one module permission');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.put(`/man-user/sub-users/${id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        moduleAccess: formData.moduleAccess,
        status: formData.status
      });

      if (response.data.success) {
        toast.success('Sub-user updated successfully');
        router.push(`/man-user/sub-users/${id}`);
      }
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              href={`/man-user/sub-users/${id}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Sub-User
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Sub-User</h1>
          <p className="text-gray-600 mt-2">Update sub-user information and module access permissions</p>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.lastName}
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Module Access Permissions */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Module Access Permissions *</h3>
              <p className="text-sm text-gray-500 mb-6">Select the modules and specific permissions for this user</p>
              
              <div className="space-y-6">
                {availableModules.map((module) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <h4 className={`font-medium ${hasModuleAccess(module.id) ? 'text-gray-900' : 'text-gray-600'}`}>
                          {module.label}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                        
                        <div className="flex space-x-6 mt-3">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.moduleAccess[module.id]?.view || false}
                              onChange={(e) => handleModulePermissionChange(module.id, 'view', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">View</span>
                          </label>
                          
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.moduleAccess[module.id]?.add || false}
                              onChange={(e) => handleModulePermissionChange(module.id, 'add', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Add</span>
                          </label>
                          
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.moduleAccess[module.id]?.edit || false}
                              onChange={(e) => handleModulePermissionChange(module.id, 'edit', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Edit</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === 'active'}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Active</span>
                    <p className="text-sm text-gray-500">User can log in and access assigned modules</p>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === 'inactive'}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Inactive</span>
                    <p className="text-sm text-gray-500">User account is disabled and cannot log in</p>
                  </div>
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
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Link 
                href={`/man-user/sub-users/${id}`}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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