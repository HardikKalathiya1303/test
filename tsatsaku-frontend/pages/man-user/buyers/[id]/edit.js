import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../../components/layouts/DashboardLayout';
import { api } from '../../../../services/api';
import { toast } from 'react-toastify';

export default function EditBuyer() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    businessType: '',
    registrationNumber: '',
    taxId: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    status: 'active'
  });

  useEffect(() => {
    if (id) fetchBuyer();
  }, [id]);

  const fetchBuyer = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/man-user/buyers/${id}`);
      if (response.data.success) {
        const buyer = response.data.data?.buyer || response.data.data;
        setFormData({
          companyName: buyer.companyName || '',
          contactPersonName: buyer.contactPerson?.name || '',
          contactPersonEmail: buyer.contactPerson?.email || '',
          contactPersonPhone: buyer.contactPerson?.phone || '',
          businessType: buyer.companyInfo?.industry || '',
          registrationNumber: buyer.companyInfo?.registrationNumber || '',
          taxId: buyer.companyInfo?.taxId || '',
          address: buyer.address?.street || '',
          city: buyer.address?.city || '',
          state: buyer.address?.state || '',
          country: buyer.address?.country || '',
          postalCode: buyer.address?.postalCode || '',
          status: buyer.status || 'active'
        });
      }
    } catch (error) {
      console.error('Error fetching buyer:', error);
      toast.error('Failed to fetch buyer details');
      router.push('/man-user/buyers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await api.put(`/man-user/buyers/${id}`, formData);
      if (response.data.success) {
        toast.success('Buyer updated successfully');
        router.push(`/man-user/buyers/${id}`);
      }
    } catch (error) {
      console.error('Error updating buyer:', error);
      toast.error(error.response?.data?.message || 'Failed to update buyer');
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href={`/man-user/buyers/${id}`} className="text-blue-600 hover:text-blue-700 font-medium">
            &larr; Back to Buyer Details
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Buyer</h1>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
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
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">Business Type</label>
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
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                  <select name="status" id="status"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.status} onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Person</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="contactPersonName" className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" name="contactPersonName" id="contactPersonName"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.contactPersonName} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="contactPersonEmail" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" name="contactPersonEmail" id="contactPersonEmail"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.contactPersonEmail} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="contactPersonPhone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="tel" name="contactPersonPhone" id="contactPersonPhone"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.contactPersonPhone} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
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
              <Link href={`/man-user/buyers/${id}`}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 font-medium">
                Cancel
              </Link>
              <button type="submit" disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium">
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
