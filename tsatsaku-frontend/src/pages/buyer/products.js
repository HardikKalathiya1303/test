import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import authService from '../../services/authService';
import api from '../../services/api';
import showToast from '../../utils/toast';

export default function BuyerProducts() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadCategories();
      loadProducts();
      loadCart();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [currentPage, searchTerm, selectedCategory, priceRange]);

  const checkAuth = async () => {
    try {
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser || currentUser.role !== 'buyer') {
        router.push('/login');
        return;
      }

      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/buyer/product-categories?limit=100');
      if (response.data.success && response.data.data) {
        setCategories(response.data.data.categories || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        search: searchTerm,
        category: selectedCategory !== 'all' ? selectedCategory : '',
        minPrice: priceRange.min,
        maxPrice: priceRange.max
      });

      const response = await api.get(`/buyer/products?${params}`);
      if (response.data.success && response.data.data) {
        setProducts(response.data.data.products || []);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      showToast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const response = await api.get('/buyer/cart');
      if (response.data.success && response.data.data) {
        setCart(response.data.data.items || []);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await api.post('/buyer/cart/add', {
        productId: product._id,
        quantity: 1,
        unitPrice: product.price
      });
      if (response.data.success) {
        showToast.success('Product added to cart');
        await loadCart();
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Shop Products | Tsatsaku</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Shop Products</h1>
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cart ({cart.length})
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>
                
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Product name..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={priceRange.min}
                      onChange={(e) => {
                        setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 });
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={priceRange.max}
                      onChange={(e) => {
                        setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 10000000 });
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="md:col-span-3">
              {products.length > 0 ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {products.map((product) => (
                      <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                          <div className="flex justify-between items-center mb-4">
                            <div className="text-lg font-bold text-gray-900">${product.price}</div>
                            <div className="text-sm text-gray-500">{product.stock || 0} in stock</div>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.stock}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
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
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-500">No products found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {cart.length > 0 ? (
                <div>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item._id} className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">${item.quantity * item.unitPrice}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">${cartTotal}</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowCart(false);
                        router.push('/buyer/orders');
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}