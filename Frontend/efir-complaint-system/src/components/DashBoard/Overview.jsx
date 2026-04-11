// Overview — Navy-themed stats cards, recent complaints
import { useEffect, useState } from "react";
import { FiFileText, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Overview = () => {
  const [activeComplaints, setActiveComplaints] = useState([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("complaints");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setActiveComplaints(Array.isArray(data) ? data : []);
      } catch { setActiveComplaints([]); }
    }
  }, []);

  const stats = [
    { label: 'Total Complaints', count: activeComplaints.length, icon: <FiFileText className="w-6 h-6" />, bg: 'bg-navy-50', text: 'text-navy-700', iconBg: 'bg-navy-100' },
    { label: 'Processing', count: activeComplaints.filter(c => c.status === 'PROCESSING').length, icon: <FiClock className="w-6 h-6" />, bg: 'bg-yellow-50', text: 'text-yellow-700', iconBg: 'bg-yellow-100' },
    { label: 'Accepted', count: activeComplaints.filter(c => c.status === 'SUCCEEDED').length, icon: <FiCheckCircle className="w-6 h-6" />, bg: 'bg-green-50', text: 'text-green-700', iconBg: 'bg-green-100' },
    { label: 'Rejected', count: activeComplaints.filter(c => c.status === 'REJECTED').length, icon: <FiXCircle className="w-6 h-6" />, bg: 'bg-red-50', text: 'text-red-700', iconBg: 'bg-red-100' },
  ];

  const getStatusBadge = (status) => {
    if (status === 'SUCCEEDED') return 'badge-success';
    if (status === 'REJECTED') return 'badge-rejected';
    return 'badge-pending';
  };

  const renderCrimeType = (ct) => {
    if (!ct) return 'Unknown';
    if (Array.isArray(ct)) return ct.join(', ');
    try { const arr = JSON.parse(ct); return Array.isArray(arr) ? arr.join(', ') : ct; } catch { return ct; }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-navy-700">Dashboard Overview</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`card p-5 ${s.bg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{s.label}</p>
                <p className={`text-3xl font-bold mt-1 ${s.text}`}>{s.count}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${s.iconBg} ${s.text} flex items-center justify-center`}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div>
        <h3 className="text-lg font-semibold text-navy-700 mb-4">Recent Complaints</h3>
        <div className="space-y-3">
          {activeComplaints.slice(0, 5).map(complaint => (
            <div key={complaint.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-navy-700 text-sm">
                    {renderCrimeType(complaint.incidence?.crimetype)}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {complaint.incidence?.description || 'No description'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{complaint.incidence?.date}</span>
                  <span className={getStatusBadge(complaint.status)}>{complaint.status || 'PENDING'}</span>
                </div>
              </div>
            </div>
          ))}
          {activeComplaints.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <FiFileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No complaints filed yet</p>
              <p className="text-sm mt-1">Click "New Complaint" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;