// PoliceDashboard — Stats bar, redesigned table, confirmation modal
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosInstance.js';
import toast from "react-hot-toast";
import { decryptComplaint } from "../context/DecryptionHelper.js";
import { getMockComplaints } from '../utils/mockDataInjector.js';
import ConfirmModal from './ui/ConfirmModal.jsx';
import LoadingSpinner from './ui/LoadingSpinner.jsx';
import Footer from './Footer.jsx';
import { FiLogOut, FiArrowLeft, FiFileText, FiClock, FiCheckCircle, FiXCircle, FiExternalLink } from 'react-icons/fi';

const PoliceDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(5);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState({ id: null, status: '', label: '' });

  const logout = () => { localStorage.clear(); navigate("/"); };

  useEffect(() => { fetchComplaints(); }, [currentPage]);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      if (!isAuthenticated) { navigate('/login'); return; }
      
      if (localStorage.getItem("TEST_MODE") === "true") {
        const dummy = getMockComplaints().map(decryptComplaint);
        setComplaints(dummy);
        setTotalPages(1);
        setError(null);
        setIsLoading(false);
        return;
      }

      const response = await API.get(`/api/police/complaints?pageNumber=${currentPage}&size=${pageSize}`);
      if (response) {
        const decryptedComplaints = response.data.complaints.map(decryptComplaint);
        setComplaints(decryptedComplaints);
        setTotalPages(Math.ceil(response.data.total / pageSize));
        setError(null);
      }
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/login'); }
      else { setError('Failed to fetch complaints. Please try again later.'); }
    } finally { setIsLoading(false); }
  };

  const display = (complaintid) => {
    const c = complaints.find(c => c.id === complaintid);
    setSelectedComplaint(c);
  };

  const openConfirmModal = (complaintId, newStatus) => {
    setModalAction({ id: complaintId, status: newStatus, label: newStatus === 'SUCCEEDED' ? 'Accept' : 'Reject' });
    setModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    setModalOpen(false);
    
    if (localStorage.getItem("TEST_MODE") === "true") {
        toast.success("Complaint updated successfully. (TEST MODE)");
        setComplaints(prev => prev.map(c => c.id === modalAction.id ? { ...c, status: modalAction.status } : c));
        if (selectedComplaint && selectedComplaint.id === modalAction.id) {
          setSelectedComplaint(prev => ({ ...prev, status: modalAction.status }));
        }
        return;
    }

    try {
      const response = await API.post(`/api/police/update?verdict=${modalAction.status}&id=${modalAction.id}`, {});
      if (response.status === 200) {
        toast.success("Complaint updated successfully.");
        setComplaints(prev => prev.map(c => c.id === modalAction.id ? { ...c, status: modalAction.status } : c));
        if (selectedComplaint && selectedComplaint.id === modalAction.id) {
          setSelectedComplaint(prev => ({ ...prev, status: modalAction.status }));
        }
      }
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/login'); }
      else { toast.error('Failed to update complaint status.'); }
    }
  };

  const handlePageChange = (newPage) => { if (newPage >= 0 && newPage < totalPages) setCurrentPage(newPage); };

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    if (s === 'SUCCEEDED') return 'badge-success';
    if (s === 'REJECTED') return 'badge-rejected';
    return 'badge-pending';
  };

  // Stats
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => !['SUCCEEDED', 'REJECTED'].includes(c.status?.toUpperCase())).length;
  const acceptedCount = complaints.filter(c => c.status?.toUpperCase() === 'SUCCEEDED').length;
  const rejectedCount = complaints.filter(c => c.status?.toUpperCase() === 'REJECTED').length;

  const stats = [
    { label: 'Total', count: totalCount, icon: <FiFileText />, color: 'text-navy-700', bg: 'bg-navy-50' },
    { label: 'Pending', count: pendingCount, icon: <FiClock />, color: 'text-yellow-700', bg: 'bg-yellow-50' },
    { label: 'Accepted', count: acceptedCount, icon: <FiCheckCircle />, color: 'text-green-700', bg: 'bg-green-50' },
    { label: 'Rejected', count: rejectedCount, icon: <FiXCircle />, color: 'text-red-700', bg: 'bg-red-50' },
  ];

  const renderAddress = (addr) => addr ? [addr.street, addr.city, addr.state, addr.zip, addr.country].filter(Boolean).join(', ') : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-navy-700 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Police Dashboard</h1>
            <p className="text-navy-200 text-sm">Manage and review complaints</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-navy-200 text-sm hidden sm:block">Officer {user?.firstName}</span>
            <button onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-navy-600 hover:bg-navy-500 rounded-lg transition-colors">
              <FiLogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className={`card p-4 ${s.bg} flex items-center gap-3`}>
              <div className={`text-xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        {!selectedComplaint ? (
          <>
            {isLoading ? (
              <LoadingSpinner fullScreen={false} message="Loading complaints..." />
            ) : (
              <>
                {/* Table */}
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-navy-700 text-white text-xs uppercase tracking-wider">
                          <th className="px-4 py-3 text-left">ID</th>
                          <th className="px-4 py-3 text-left">Accused</th>
                          <th className="px-4 py-3 text-left">Victim</th>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-left">Description</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Evidence</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {complaints.map((complaint) => (
                          <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-gray-500">{complaint.id}</td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-800">{complaint.accused?.firstName} {complaint.accused?.lastName}</div>
                              <div className="text-xs text-gray-400">{complaint.accused?.phone}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-800">{complaint.victim?.firstName} {complaint.victim?.lastName}</div>
                              <div className="text-xs text-gray-400">{complaint.victim?.phone}</div>
                            </td>
                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{complaint.incidence?.date}</td>
                            <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{complaint.incidence?.description}</td>
                            <td className="px-4 py-3"><span className={getStatusBadge(complaint.status)}>{complaint.status}</span></td>
                            <td className="px-4 py-3">
                              {complaint.evidenceLink ? (
                                <a href={complaint.evidenceLink} target="_blank" rel="noopener noreferrer"
                                  className="text-navy-600 hover:underline flex items-center gap-1 text-xs">
                                  <FiExternalLink className="w-3 h-3" /> View
                                </a>
                              ) : <span className="text-gray-300 text-xs">None</span>}
                            </td>
                            <td className="px-4 py-3">
                              <button onClick={() => display(complaint.id)}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-navy-700 hover:bg-navy-800 rounded-lg transition-colors">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500">Page {currentPage + 1} of {totalPages}</span>
                  <div className="flex gap-2">
                    {['First', 'Previous', 'Next', 'Last'].map((label, i) => {
                      const pages = [0, currentPage - 1, currentPage + 1, totalPages - 1];
                      const disabled = (i < 2 && currentPage === 0) || (i >= 2 && currentPage === totalPages - 1);
                      return (
                        <button key={label} onClick={() => handlePageChange(pages[i])} disabled={disabled}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          /* Detail View */
          <div className="card p-6">
            <button onClick={() => setSelectedComplaint(null)}
              className="mb-5 text-navy-600 hover:text-navy-800 flex items-center gap-2 text-sm font-medium transition-colors">
              <FiArrowLeft className="w-4 h-4" /> Back to Complaints
            </button>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-navy-700">Complaint #{selectedComplaint.id}</h3>
                <span className={getStatusBadge(selectedComplaint.status)}>{selectedComplaint.status}</span>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold text-navy-700 mb-3 text-sm uppercase tracking-wide">Incident</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium text-gray-500">Date:</span> {selectedComplaint.incidence?.date}</p>
                  <p><span className="font-medium text-gray-500">Time:</span> {selectedComplaint.incidence?.time}</p>
                  <p><span className="font-medium text-gray-500">Type:</span> {selectedComplaint.incidence?.crimetype}</p>
                  <p className="md:col-span-2"><span className="font-medium text-gray-500">Description:</span> {selectedComplaint.incidence?.description}</p>
                  <p className="md:col-span-2"><span className="font-medium text-gray-500">Address:</span> {renderAddress(selectedComplaint.incidence?.address)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-navy-50 rounded-xl p-5">
                  <h4 className="font-semibold text-navy-700 mb-3 text-sm uppercase tracking-wide">Victim</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium text-gray-500">Name:</span> {selectedComplaint.victim?.firstName} {selectedComplaint.victim?.lastName}</p>
                    <p><span className="font-medium text-gray-500">Phone:</span> {selectedComplaint.victim?.phone}</p>
                    <p><span className="font-medium text-gray-500">Address:</span> {renderAddress(selectedComplaint.victim?.address)}</p>
                  </div>
                </div>
                <div className="bg-red-50 rounded-xl p-5">
                  <h4 className="font-semibold text-red-700 mb-3 text-sm uppercase tracking-wide">Accused</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium text-gray-500">Name:</span> {selectedComplaint.accused?.firstName} {selectedComplaint.accused?.lastName}</p>
                    <p><span className="font-medium text-gray-500">Phone:</span> {selectedComplaint.accused?.phone}</p>
                    <p><span className="font-medium text-gray-500">Address:</span> {renderAddress(selectedComplaint.accused?.address)}</p>
                  </div>
                </div>
              </div>

              {selectedComplaint.evidenceLink && (
                <div className="bg-saffron-50 rounded-xl p-5">
                  <h4 className="font-semibold text-saffron-700 mb-2 text-sm uppercase tracking-wide">Evidence</h4>
                  <a href={selectedComplaint.evidenceLink} target="_blank" rel="noopener noreferrer"
                    className="text-navy-600 hover:text-navy-800 underline text-sm">{selectedComplaint.evidenceLink}</a>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => openConfirmModal(selectedComplaint.id, "SUCCEEDED")}
                  disabled={selectedComplaint.status?.toUpperCase() === 'SUCCEEDED'}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  ✓ Accept
                </button>
                <button onClick={() => openConfirmModal(selectedComplaint.id, "REJECTED")}
                  disabled={selectedComplaint.status?.toUpperCase() === 'REJECTED'}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  ✕ Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        title={`${modalAction.label} Complaint`}
        message={`Are you sure you want to ${modalAction.label.toLowerCase()} complaint #${modalAction.id}? This action cannot be undone.`}
        confirmText={modalAction.label}
        variant={modalAction.status === 'SUCCEEDED' ? 'success' : 'danger'}
        onConfirm={handleStatusUpdate}
        onCancel={() => setModalOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default PoliceDashboard;