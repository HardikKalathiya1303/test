import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';

export default function CreatePurchaseOrder() {
  const [buyers, setBuyers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    buyerId: '',
    deliveryAddress: '',
    deliveryDate: '',
    paymentTerms: '',
    notes: '',
    priority: 'normal',
    discount: 0,
    taxRate: 0,
    shippingCost: 0
  });

  const [orderProducts, setOrderProducts] = useState([
    { productId: '', quantity: 1, unitPrice: 0 }
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch buyers list
      const buyersResponse = await api.get('/man-user/buyers', { params: { limit: 100 } });
      if (buyersResponse.data.success) {
        setBuyers(buyersResponse.data.data?.buyers || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...orderProducts];
    updated[index][field] = field === 'quantity' || field === 'unitPrice' ? Number(value) : value;
    setOrderProducts(updated);
  };

  const addProduct = () => {
    setOrderProducts([...orderProducts, { productId: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeProduct = (index) => {
    if (orderProducts.length <= 1) return;
    setOrderProducts(orderProducts.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return orderProducts.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * (formData.discount || 0)) / 100;
    const afterDiscount = subtotal - discountAmount + Number(formData.shippingCost || 0);
    const taxAmount = (afterDiscount * (formData.taxRate || 0)) / 100;
    return afterDiscount + taxAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.buyerId) {
      toast.error('Please select a buyer');
      return;
    }

    const validProducts = orderProducts.filter(p => p.productId && p.quantity > 0 && p.unitPrice > 0);
    if (validProducts.length === 0) {
      toast.error('Please add at least one product with valid details');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        buyerId: formData.buyerId,
        products: validProducts,
        deliveryAddress: formData.deliveryAddress,
        deliveryDate: formData.deliveryDate || undefined,
        paymentTerms: formData.paymentTerms,
        notes: formData.notes,
        priority: formData.priority,
        discount: Number(formData.discount) || 0,
        taxRate: Number(formData.taxRate) || 0,
        shippingCost: Number(formData.shippingCost) || 0
      };

      const response = await api.post('/man-user/purchase-orders', payload);
      if (response.data.success) {
        toast.success('Purchase order created successfully');
        router.push('/man-user/purchase-orders');
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast.error(error.response?.data?.message || 'Failed to create purchase order');
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
          <Link href="/man-user/purchase-orders" className="text-blue-600 hover:text-blue-700 font-medium">
            &larr; Back to Purchase Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Create Purchase Order</h1>
          <p className="text-gray-600 mt-2">Create a new purchase order for a buyer</p>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Buyer Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Buyer</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="buyerId" className="block text-sm font-medium text-gray-700">Select Buyer *</label>
                  <select name="buyerId" id="buyerId" required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.buyerId} onChange={handleChange}>
                    <option value="">-- Select Buyer --</option>
                    {buyers.map((buyer) => (
                      <option key={buyer._id} value={buyer.userId?._id || buyer._id}>
                        {buyer.companyName || ''} - {buyer.userId?.firstName} {buyer.userId?.lastName} ({buyer.userId?.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                  <select name="priority" id="priority"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.priority} onChange={handleChange}>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Products</h3>
                <button type="button" onClick={addProduct}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                  + Add Product
                </button>
              </div>
              <div className="space-y-4">
                {orderProducts.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-lg">
                    <div className="col-span-5">
                      <label className="block text-sm font-medium text-gray-700">Product ID *</label>
                      <input type="text" placeholder="Product ID"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                        value={item.productId}
                        onChange={(e) => handleProductChange(index, 'productId', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                      <input type="number" min="1" placeholder="Qty"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                        value={item.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)} />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Unit Price *</label>
                      <input type="number" min="0" step="0.01" placeholder="Price"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                        value={item.unitPrice}
                        onChange={(e) => handleProductChange(index, 'unitPrice', e.target.value)} />
                    </div>
                    <div className="col-span-2 flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </span>
                      {orderProducts.length > 1 && (
                        <button type="button" onClick={() => removeProduct(index)}
                          className="text-red-600 hover:text-red-800 text-sm">
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%)</label>
                  <input type="number" name="discount" id="discount" min="0" max="100" step="0.1"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.discount} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                  <input type="number" name="taxRate" id="taxRate" min="0" max="100" step="0.1"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.taxRate} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="shippingCost" className="block text-sm font-medium text-gray-700">Shipping Cost ($)</label>
                  <input type="number" name="shippingCost" id="shippingCost" min="0" step="0.01"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.shippingCost} onChange={handleChange} />
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-blue-200">
                  <span>Estimated Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">Delivery Address</label>
                  <textarea name="deliveryAddress" id="deliveryAddress" rows={2}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.deliveryAddress} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
                  <input type="date" name="deliveryDate" id="deliveryDate"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.deliveryDate} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700">Payment Terms</label>
                  <input type="text" name="paymentTerms" id="paymentTerms" placeholder="e.g., Net 30"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.paymentTerms} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Internal Notes</label>
                  <textarea name="notes" id="notes" rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                    value={formData.notes} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Link href="/man-user/purchase-orders"
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 font-medium">
                Cancel
              </Link>
              <button type="submit" disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                {submitting ? 'Creating...' : 'Create Purchase Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
