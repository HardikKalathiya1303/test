import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import authService from '../../../services/authService';
import api from '../../../services/api';
import showToast from '../../../utils/toast';

export default function AdminEmailLogs() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadEmailLogs();
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

  const loadEmailLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : ''
      });

      const response = await api.get(`/admin/management/email-logs?${params}`);
      if (response.data.success && response.data.data) {
        setEmails(response.data.data.logs || []);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to load email logs:', error);
      showToast.error('Failed to load email logs');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async (emailId) => {
    if (!confirm('Are you sure you want to resend this email?')) return;

    try {
      const response = await api.post(`/admin/management/email-logs/${emailId}/resend`);
      if (response.data.success) {
        showToast.success('Email resent successfully');
        await loadEmailLogs();
      }
    } catch (error) {
      console.error('Failed to resend email:', error);
      showToast.error(error.response?.data?.message || 'Failed to resend email');
    }
  };

  const openDetailModal = (email) => {
    setSelectedEmail(email);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading Email Logs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Email Logs | Tsatsaku Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Email Logs</h1>
            <p className="text-gray-500 mt-1">View and manage system email communications</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search by recipient email..."
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
                <option value="sent">Sent</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <button
                onClick={() => loadEmailLogs()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Email Logs Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {emails.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emails.map((email) => (
                      <tr key={email._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{email.to}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{email.subject}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{email.type || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            email.status === 'sent' ? 'bg-green-100 text-green-700' :
                            email.status === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {email.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(email.sentAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => openDetailModal(email)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            View
                          </button>
                          {email.status === 'failed' && (
                            <button
                              onClick={() => handleResendEmail(email._id)}
                              className="text-orange-600 hover:text-orange-900 font-medium"
                            >
                              Resend
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No email logs found</p>
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
      {showDetailModal && selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Email Details</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-gray-600 text-sm">From</label>
                <p className="text-gray-900 font-medium">{selectedEmail.from || 'system@tsatsaku.com'}</p>
              </div>
              <div>
                <label className="text-gray-600 text-sm">To</label>
                <p className="text-gray-900 font-medium">{selectedEmail.to}</p>
              </div>
              <div>
                <label className="text-gray-600 text-sm">Subject</label>
                <p className="text-gray-900 font-medium">{selectedEmail.subject}</p>
              </div>
              <div>
                <label className="text-gray-600 text-sm">Type</label>
                <p className="text-gray-900 font-medium">{selectedEmail.type || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-600 text-sm">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  selectedEmail.status === 'sent' ? 'bg-green-100 text-green-700' :
                  selectedEmail.status === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedEmail.status}
                </span>
              </div>
              <div>
                <label className="text-gray-600 text-sm">Sent Date</label>
                <p className="text-gray-900 font-medium">{new Date(selectedEmail.sentAt).toLocaleString()}</p>
              </div>
              {selectedEmail.error && (
                <div className="bg-red-50 p-4 rounded border border-red-200">
                  <label className="text-gray-600 text-sm">Error</label>
                  <p className="text-red-900 mt-2">{selectedEmail.error}</p>
                </div>
              )}
              <div className="bg-gray-50 p-4 rounded">
                <label className="text-gray-600 text-sm">Message Body</label>
                <div className="text-gray-900 mt-2 text-sm whitespace-pre-wrap">{selectedEmail.body}</div>
              </div>
            </div>

            <div className="flex gap-2">
              {selectedEmail.status === 'failed' && (
                <button
                  onClick={() => {
                    handleResendEmail(selectedEmail._id);
                    setShowDetailModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Resend Email
                </button>
              )}
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedEmail(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}