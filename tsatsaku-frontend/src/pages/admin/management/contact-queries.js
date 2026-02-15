import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import authService from '../../../services/authService';
import api from '../../../services/api';
import showToast from '../../../utils/toast';

export default function AdminContactQueries() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadQueries();
    }
  }, [currentPage, searchTerm, statusFilter]);

  const checkAuth = async () => {
    try {
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser || currentUser.role !== 'admin') {
        router.push('/login');
        return;
      }

      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  };

  const loadQueries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : ''
      });

      const response = await api.get(`/admin/management/contact-queries?${params}`);
      if (response.data.success && response.data.data) {
        setQueries(response.data.data.queries || []);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to load queries:', error);
      showToast.error('Failed to load contact queries');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) {
      showToast.error('Please enter a response message');
      return;
    }

    setSending(true);
    try {
      const response = await api.post(`/admin/management/contact-queries/${selectedQuery._id}/respond`, {
        response: responseText
      });
      if (response.data.success) {
        showToast.success('Response sent successfully');
        setShowDetailModal(false);
        setSelectedQuery(null);
        setResponseText('');
        await loadQueries();
      }
    } catch (error) {
      console.error('Failed to send response:', error);
      showToast.error(error.response?.data?.message || 'Failed to send response');
    } finally {
      setSending(false);
    }
  };

  const handleMarkAsResolved = async (queryId) => {
    try {
      const response = await api.put(`/admin/management/contact-queries/${queryId}`, {
        status: 'resolved'
      });
      if (response.data.success) {
        showToast.success('Query marked as resolved');
        await loadQueries();
      }
    } catch (error) {
      console.error('Failed to update query:', error);
      showToast.error('Failed to update query');
    }
  };

  const openDetailModal = (query) => {
    setSelectedQuery(query);
    setResponseText('');
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading Contact Queries...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Contact Queries | Tsatsaku Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Contact Queries</h1>
            <p className="text-gray-500 mt-1">Manage customer contact queries and responses</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="responded">Responded</option>
                <option value="resolved">Resolved</option>
              </select>
              <button
                onClick={() => loadQueries()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Queries Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {queries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queries.map((query) => (
                      <tr key={query._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{query.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{query.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{query.subject}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            query.status === 'resolved' ? 'bg-green-100 text-green-700' :
                            query.status === 'responded' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {query.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(query.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => openDetailModal(query)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No contact queries found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
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
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Query Details</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-gray-600 text-sm">Name</label>
                <p className="text-gray-900 font-medium">{selectedQuery.name}</p>
              </div>
              <div>
                <label className="text-gray-600 text-sm">Email</label>
                <p className="text-gray-900 font-medium">{selectedQuery.email}</p>
              </div>
              <div>
                <label className="text-gray-600 text-sm">Phone</label>
                <p className="text-gray-900 font-medium">{selectedQuery.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-600 text-sm">Subject</label>
                <p className="text-gray-900 font-medium">{selectedQuery.subject}</p>
              </div>
              <div>
                <label className="text-gray-600 text-sm">Message</label>
                <p className="text-gray-900">{selectedQuery.message}</p>
              </div>
              <div>
                <label className="text-gray-600 text-sm">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  selectedQuery.status === 'resolved' ? 'bg-green-100 text-green-700' :
                  selectedQuery.status === 'responded' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedQuery.status}
                </span>
              </div>
              {selectedQuery.response && (
                <div className="bg-gray-50 p-4 rounded">
                  <label className="text-gray-600 text-sm">Our Response</label>
                  <p className="text-gray-900 mt-2">{selectedQuery.response}</p>
                </div>
              )}
            </div>

            {selectedQuery.status !== 'resolved' && (
              <div className="space-y-4 border-t pt-4">
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSendResponse}
                    disabled={sending}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {sending ? 'Sending...' : 'Send Response'}
                  </button>
                  <button
                    onClick={() => handleMarkAsResolved(selectedQuery._id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setShowDetailModal(false);
                setSelectedQuery(null);
              }}
              className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}