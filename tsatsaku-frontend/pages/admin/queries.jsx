import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, [statusFilter]);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await api.get('/admin/contact-queries', { params });
      setQueries(res.data.data || res.data.contactQueries || res.data || []);
    } catch (error) {
      console.error('Error fetching queries:', error);
      toast.error('Failed to load contact queries');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuery = async (queryId) => {
    try {
      const res = await api.get(`/admin/contact-queries/${queryId}`);
      const query = res.data.data || res.data;
      setSelectedQuery(query);
      setResponseText(query.response || '');
      setShowModal(true);
      // Mark as read if unread
      if (query.status === 'unread') {
        await api.put(`/admin/contact-queries/${queryId}`, { status: 'read' });
        fetchQueries();
      }
    } catch (error) {
      toast.error('Failed to load query details');
    }
  };

  const handleRespond = async () => {
    if (!responseText.trim()) {
      toast.error('Please enter a response');
      return;
    }
    try {
      await api.put(`/admin/contact-queries/${selectedQuery._id}`, {
        status: 'responded',
        response: responseText,
      });
      toast.success('Response sent successfully');
      setShowModal(false);
      fetchQueries();
    } catch (error) {
      toast.error('Failed to send response');
    }
  };

  const handleDelete = async (queryId) => {
    if (!confirm('Are you sure you want to delete this query?')) return;
    try {
      await api.delete(`/admin/contact-queries/${queryId}`);
      toast.success('Query deleted successfully');
      fetchQueries();
    } catch (error) {
      toast.error('Failed to delete query');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      unread: 'bg-red-100 text-red-800',
      read: 'bg-yellow-100 text-yellow-800',
      responded: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading && queries.length === 0) {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Queries</h1>
          <p className="text-gray-600 mt-1">Manage and respond to customer inquiries</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
          {['all', 'unread', 'read', 'responded'].map(status => (
            <button key={status} onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
          <button onClick={fetchQueries} className="ml-auto px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm">
            Refresh
          </button>
        </div>

        {/* Queries Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {Array.isArray(queries) && queries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {queries.map((query) => (
                    <tr key={query._id} className={`hover:bg-gray-50 ${query.status === 'unread' ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{query.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{query.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{query.subject || 'No Subject'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                          {query.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(query.priority)}`}>
                          {query.priority || 'medium'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {query.createdAt ? new Date(query.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onClick={() => handleViewQuery(query._id)} className="text-blue-600 hover:text-blue-900">View</button>
                        <button onClick={() => handleDelete(query._id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No contact queries found</p>
              <p className="text-gray-400 mt-1">Queries submitted via the contact form will appear here</p>
            </div>
          )}
        </div>

        {/* Query Detail / Response Modal */}
        {showModal && selectedQuery && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900">Query Details</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">From</p>
                    <p className="text-gray-900">{selectedQuery.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedQuery.email}</p>
                  </div>
                  {selectedQuery.phone && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">{selectedQuery.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-gray-900">{selectedQuery.createdAt ? new Date(selectedQuery.createdAt).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Subject</p>
                  <p className="text-gray-900">{selectedQuery.subject || 'No Subject'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Message</p>
                  <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded">{selectedQuery.message}</p>
                </div>

                {selectedQuery.response && selectedQuery.status === 'responded' && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Previous Response</p>
                    <p className="text-gray-900 whitespace-pre-wrap bg-green-50 p-3 rounded">{selectedQuery.response}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Response</label>
                  <textarea rows={4} value={responseText} onChange={(e) => setResponseText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type your response here..." />
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Cancel</button>
                <button onClick={handleRespond}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Send Response</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
