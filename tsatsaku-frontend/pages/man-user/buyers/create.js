import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';

export default function CreateBuyer() {
  const [formData, setFormData] = useState({
    // User account details (required)
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    // Company details
    companyName: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    businessType: '',
    registrationNumber: '',
    taxId: '',
    // Address details
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/man-user/buyers', formData);

      if (response.data.success) {
        toast.success('Buyer created successfully');
        router.push('/man-user/buyers');
      }
    } catch (error) {
      console.error('Error creating buyer:', error);
      toast.error(error.response?.data?.message || 'Failed to create buyer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/man-user/buyers" className="text-blue-600 hover:text-blue-700 font-medium">
              &larr; Back to Buyers
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Buyer</h1>
          <p className="text-gray-600 mt-2">Add a new buyer with account credentials and business information</p>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Account Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
              <p className="text-sm text-gray-500 mb-4">These credentials will be used for the buyer to login</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name *</label>
                  <input type="text" name="firstName" id="firstName" required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.firstName} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name *</label>
                  <input type="text" name="lastName" id="lastName" required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.lastName} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <input type="email" name="email" id="email" required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.email} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password *</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" id="password" required minLength={6}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 pr-10"
                      value={formData.password} onChange={handleChange} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input type="text" name="companyName" id="companyName"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.companyName} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">Business Type / Industry</label>
                  <input type="text" name="businessType" id="businessType"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.businessType} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">Registration Number</label>
                  <input type="text" name="registrationNumber" id="registrationNumber"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.registrationNumber} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">Tax ID</label>
                  <input type="text" name="taxId" id="taxId"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.taxId} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Person</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="contactPersonName" className="block text-sm font-medium text-gray-700">Contact Name</label>
                  <input type="text" name="contactPersonName" id="contactPersonName"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.contactPersonName} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="contactPersonEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
                  <input type="email" name="contactPersonEmail" id="contactPersonEmail"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.contactPersonEmail} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="contactPersonPhone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
                  <input type="tel" name="contactPersonPhone" id="contactPersonPhone"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.contactPersonPhone} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street Address</label>
                  <input type="text" name="address" id="address"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.address} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" name="city" id="city"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.city} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                  <input type="text" name="state" id="state"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.state} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                  <input type="text" name="country" id="country"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.country} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input type="text" name="postalCode" id="postalCode"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.postalCode} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Link href="/man-user/buyers"
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 font-medium">
                Cancel
              </Link>
              <button type="submit" disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                {submitting ? 'Creating...' : 'Create Buyer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
