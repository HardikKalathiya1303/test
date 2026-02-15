import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';

export default function ProductCategoryDetail() {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    parentCategory: '',
    description: '',
    status: 'active'
  });
  const [parentCategories, setParentCategories] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchCategoryDetail();
      fetchParentCategories();
    }
  }, [id]);

  const fetchCategoryDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/product-categories/${id}`);
      setCategory(response.data);
      
      // Initialize form data for editing
      setFormData({
        name: response.data.name,
        parentCategory: response.data.parentCategory?._id || '',
        description: response.data.description || '',
        status: response.data.status
      });
    } catch (error) {
      console.error('Error fetching product category:', error);
      toast.error('Failed to fetch product category details');
      if (error.response?.status === 404) {
        router.push('/admin/product-categories');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchParentCategories = async () => {
    try {
      const response = await api.get('/admin/product-categories', {
        params: { format: 'tree', status: 'active' }
      });
      setParentCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching parent categories:', error);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        parentCategory: formData.parentCategory || null
      };

      await api.put(`/admin/product-categories/${id}`, submitData);
      toast.success('Product category updated successfully');
      setShowEditModal(false);
      fetchCategoryDetail();
    } catch (error) {
      console.error('Error updating product category:', error);
      toast.error(error.response?.data?.message || 'Failed to update product category');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product category?')) return;

    try {
      await api.delete(`/admin/product-categories/${id}`);
      toast.success('Product category deleted successfully');
      router.push('/admin/product-categories');
    } catch (error) {
      console.error('Error deleting product category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product category');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getIndentedName = (category) => {
    const indent = '─'.repeat(category.level * 2);
    return category.level > 0 ? `${indent} ${category.name}` : category.name;
  };

  const getCategoryPath = (category) => {
    if (!category.parentCategory) return category.name;
    return `${category.parentCategory.name} > ${category.name}`;
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

  if (!category) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-900">Category Not Found</h1>
          <p className="text-gray-600 mt-2">The requested product category could not be found.</p>
          <Link 
            href="/admin/product-categories"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Categories
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/admin" className="text-gray-400 hover:text-gray-500">
                Admin
              </Link>
            </li>
            <li>
              <span className="text-gray-400 mx-2">/</span>
              <Link href="/admin/product-categories" className="text-gray-400 hover:text-gray-500">
                Product Categories
              </Link>
            </li>
            <li>
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-500">{category.name}</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-gray-600 mt-1">Category Details & Management</p>
            {category.parentCategory && (
              <div className="text-sm text-gray-500 mt-2">
                Path: {getCategoryPath(category)}
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleEdit}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Edit Category
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete Category
            </button>
          </div>
        </div>

        {/* Category Information */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{category.name}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Parent Category</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {category.parentCategory ? (
                        <Link 
                          href={`/admin/product-categories/${category.parentCategory._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {category.parentCategory.name}
                        </Link>
                      ) : (
                        'Root Category'
                      )}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Level</dt>
                    <dd className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Level {category.level}
                      </span>
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        category.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {category.description || 'No description provided'}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Children Categories</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {category.childrenCount || 0} subcategories
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Products</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {category.productsCount || 0} products
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Child Categories */}
        {category.children && category.children.length > 0 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Child Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.children.map((child) => (
                  <div key={child._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <Link 
                      href={`/admin/product-categories/${child._id}`}
                      className="block"
                    >
                      <h4 className="font-semibold text-gray-900 hover:text-blue-600">
                        {child.name}
                      </h4>
                      {child.description && (
                        <p className="text-sm text-gray-500 mt-1">{child.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          child.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {child.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          Level {child.level}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href={`/admin/products?category=${category._id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">View Products</div>
                <div className="text-sm text-gray-500">See all products in this category</div>
              </Link>
              
              <button
                onClick={() => router.push(`/admin/product-categories/new?parent=${category._id}`)}
                className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">Add Subcategory</div>
                <div className="text-sm text-gray-500">Create a child category</div>
              </button>
              
              <button
                onClick={handleEdit}
                className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">Edit Category</div>
                <div className="text-sm text-gray-500">Modify category details</div>
              </button>
              
              <Link
                href="/admin/product-categories"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">All Categories</div>
                <div className="text-sm text-gray-500">Return to categories list</div>
              </Link>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Edit Product Category
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Parent Category
                    </label>
                    <select
                      name="parentCategory"
                      value={formData.parentCategory}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">No Parent (Root Category)</option>
                      {parentCategories.map((cat) => (
                        <option 
                          key={cat._id} 
                          value={cat._id}
                          disabled={cat._id === category._id}
                        >
                          {getIndentedName(cat)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}