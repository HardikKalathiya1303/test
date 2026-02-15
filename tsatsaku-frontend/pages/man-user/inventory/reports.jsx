import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';

export default function InventoryReports() {
  const [inventoryReport, setInventoryReport] = useState([]);
  const [warehouseReport, setWarehouseReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [inventoryResponse, warehouseResponse] = await Promise.all([
        api.get('/man-user/reports/inventory'),
        api.get('/man-user/reports/warehouse-stock')
      ]);

      if (inventoryResponse.data.success) {
        setInventoryReport(inventoryResponse.data.data || []);
      }
      if (warehouseResponse.data.success) {
        setWarehouseReport(warehouseResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching inventory reports:', error);
      toast.error('Failed to fetch inventory reports');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  // Filter inventory report
  const filteredInventory = inventoryReport.filter(item =>
    item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.productDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Flatten warehouse report for filtering
  const flatWarehouseProducts = warehouseReport.flatMap(group =>
    (group.products || []).map(p => ({
      ...p,
      warehouseName: group.warehouse?.name || 'Unknown',
      warehouseLocation: group.warehouse?.location || group.warehouse?.city || ''
    }))
  );

  const filteredWarehouse = flatWarehouseProducts.filter(item =>
    item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.warehouseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute summary stats
  const totalProducts = inventoryReport.length;
  const totalQuantity = inventoryReport.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
  const totalWarehouses = warehouseReport.length;

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
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Inventory Reports</h1>
          <button onClick={fetchReports}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Refresh Data
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11h14V7l-7-5z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Quantity</p>
                <p className="text-2xl font-bold text-gray-900">{totalQuantity.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-500 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Warehouses</p>
                <p className="text-2xl font-bold text-gray-900">{totalWarehouses}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button onClick={() => setActiveTab('inventory')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inventory'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                Inventory Overview
              </button>
              <button onClick={() => setActiveTab('warehouse')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'warehouse'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                Warehouse Stock
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Search */}
            <div className="mb-6">
              <input type="text" placeholder="Search products or warehouses..."
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {/* Inventory Overview Table */}
            {activeTab === 'inventory' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouses</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInventory.map((item, index) => (
                      <tr key={item._id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.productName || '-'}</div>
                          {item.productDescription && (
                            <div className="text-sm text-gray-500">{item.productDescription}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {(item.totalQuantity || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {(item.warehouses || []).map((wh, i) => (
                              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {wh.warehouseName}: {wh.quantity}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredInventory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No inventory data found</div>
                )}
              </div>
            )}

            {/* Warehouse Stock Table */}
            {activeTab === 'warehouse' && (
              <div className="overflow-x-auto">
                {warehouseReport.length > 0 ? (
                  <div className="space-y-8">
                    {warehouseReport.map((group, groupIndex) => (
                      <div key={groupIndex}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-md font-semibold text-gray-900">
                            {group.warehouse?.name || 'Unknown Warehouse'}
                            {group.warehouse?.location && (
                              <span className="text-gray-500 font-normal ml-2">({group.warehouse.location})</span>
                            )}
                          </h4>
                          <div className="text-sm text-gray-500">
                            {group.totalProducts} products | {group.totalQuantity?.toLocaleString()} total units
                          </div>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {(group.products || []).map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{item.product?.name || '-'}</div>
                                  {item.product?.description && (
                                    <div className="text-sm text-gray-500">{item.product.description}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                  {(item.quantity || 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No warehouse stock data found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
