import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';

const PAGE_TYPES = [
  { value: 'about_us', label: 'About Us' },
  { value: 'terms', label: 'Terms & Conditions' },
  { value: 'privacy', label: 'Privacy Policy' },
  { value: 'faq', label: 'FAQ' },
];

export default function AdminContent() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    pageType: 'about_us',
    title: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    status: 'published',
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/content');
      setPages(res.data.data || res.data.contentPages || res.data || []);
    } catch (error) {
      console.error('Error fetching content pages:', error);
      toast.error('Failed to load content pages');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (identifier) => {
    try {
      const res = await api.get(`/admin/content/${identifier}`);
      const page = res.data.data || res.data;
      setEditingPage(page);
      setFormData({
        pageType: page.pageType || 'about_us',
        title: page.title || '',
        content: page.content || '',
        metaTitle: page.metaTitle || '',
        metaDescription: page.metaDescription || '',
        status: page.status || 'published',
      });
      setShowForm(true);
    } catch (error) {
      toast.error('Failed to load content page');
    }
  };

  const handleCreate = () => {
    setEditingPage(null);
    setFormData({
      pageType: 'about_us',
      title: '',
      content: '',
      metaTitle: '',
      metaDescription: '',
      status: 'published',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    try {
      if (editingPage) {
        await api.put(`/admin/content/${editingPage._id || editingPage.pageType}`, formData);
        toast.success('Content updated successfully');
      } else {
        await api.post('/admin/content', formData);
        toast.success('Content created successfully');
      }
      setShowForm(false);
      fetchPages();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save content';
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this content page?')) return;
    try {
      await api.delete(`/admin/content/${id}`);
      toast.success('Content page deleted');
      fetchPages();
    } catch (error) {
      toast.error('Failed to delete content page');
    }
  };

  const getStatusColor = (status) => {
    return status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  if (loading && pages.length === 0) {
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-1">Manage About Us, Terms, Privacy, and FAQ pages</p>
          </div>
          <button onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
            <span>+</span> Create Page
          </button>
        </div>

        {/* Content Pages Grid */}
        {!showForm && (
          <>
            {/* Quick access cards for each page type */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PAGE_TYPES.map(pt => {
                const existing = (Array.isArray(pages) ? pages : []).find(p => p.pageType === pt.value);
                return (
                  <div key={pt.value} className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-semibold text-gray-900">{pt.label}</h3>
                    {existing ? (
                      <>
                        <p className="text-sm text-gray-500 mt-1">{existing.title}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(existing.status)}`}>
                          {existing.status}
                        </span>
                        <div className="mt-4 flex space-x-2">
                          <button onClick={() => handleEdit(existing._id || existing.pageType)}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100">Edit</button>
                          <button onClick={() => handleDelete(existing._id)}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100">Delete</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-400 mt-1">Not created yet</p>
                        <button onClick={() => {
                          setEditingPage(null);
                          setFormData({ ...formData, pageType: pt.value, title: pt.label });
                          setShowForm(true);
                        }} className="mt-4 px-3 py-1 bg-green-50 text-green-600 rounded text-sm hover:bg-green-100">
                          Create
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* All content pages list */}
            {Array.isArray(pages) && pages.length > 0 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">All Content Pages</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pages.map((page) => (
                        <tr key={page._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{page.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 capitalize">{(page.pageType || '').replace(/_/g, ' ')}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                              {page.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                            <button onClick={() => handleEdit(page._id || page.pageType)} className="text-blue-600 hover:text-blue-900">Edit</button>
                            <button onClick={() => handleDelete(page._id)} className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPage ? 'Edit Content Page' : 'Create Content Page'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Type</label>
                  <select value={formData.pageType}
                    onChange={(e) => setFormData({ ...formData, pageType: e.target.value })}
                    disabled={!!editingPage}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100">
                    {PAGE_TYPES.map(pt => (
                      <option key={pt.value} value={pt.value}>{pt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Page title" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML supported)</label>
                <textarea rows={12} value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="<h2>Page Content</h2><p>Your content here...</p>" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title (optional)</label>
                  <input type="text" value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SEO meta title" maxLength={100} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (optional)</label>
                  <input type="text" value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SEO meta description" maxLength={300} />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  {editingPage ? 'Update' : 'Create'} Page
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
