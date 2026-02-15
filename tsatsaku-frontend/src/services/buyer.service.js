import api from '@/lib/api';

// Get dashboard stats
export const getDashboardStats = async () => {
  const response = await api.get('/buyer/dashboard-stats');
  return response.data;
};

// Get purchase orders
export const getPurchaseOrders = async (params = {}) => {
  const response = await api.get('/buyer/purchase-orders', { params });
  return response.data;
};

// Get single purchase order
export const getPurchaseOrder = async (poId) => {
  const response = await api.get(`/buyer/purchase-orders/${poId}`);
  return response.data;
};
