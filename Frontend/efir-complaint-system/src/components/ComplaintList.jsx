// ComplaintList — Navy-themed card list with status badges
const renderAddress = (address) => {
  if (!address) return 'N/A';
  return [address.street, address.city, address.state, address.zip, address.country].filter(Boolean).join(', ');
};

const renderCrimeType = (crimetype) => {
  if (Array.isArray(crimetype)) return crimetype.join(', ');
  if (typeof crimetype === 'string') {
    try { const arr = JSON.parse(crimetype); if (Array.isArray(arr)) return arr.join(', '); return crimetype; }
    catch { return crimetype; }
  }
  return 'Unknown Crime Type';
};

const getStatusBadge = (status) => {
  if (status === 'SUCCEEDED') return 'badge-success';
  if (status === 'REJECTED') return 'badge-rejected';
  if (status === 'PROCESSING') return 'badge-processing';
  return 'badge-pending';
};

const ComplaintList = ({ complaints, onSelect }) => {
  if (!Array.isArray(complaints) || complaints.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="font-medium">No complaints found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <div
          key={complaint.id}
          onClick={() => onSelect && onSelect(complaint)}
          className="card p-5 cursor-pointer hover:shadow-md hover:border-navy-200 transition-all group"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h3 className="font-semibold text-navy-700 group-hover:text-navy-800">
              {renderCrimeType(complaint.incidence?.crimetype)}
            </h3>
            <span className={getStatusBadge(complaint.status)}>
              {complaint.status || 'PENDING'}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {complaint.incidence?.description || 'No description provided'}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
            <span>📅 {complaint.incidence?.date || 'N/A'}</span>
            <span>🕐 {complaint.incidence?.time || 'N/A'}</span>
            <span>📍 {renderAddress(complaint.incidence?.address)}</span>
          </div>

          {/* People */}
          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
            <div>
              <span className="font-medium text-gray-600">Victim:</span> {complaint.victim?.firstName} {complaint.victim?.lastName}
            </div>
            <div>
              <span className="font-medium text-gray-600">Accused:</span> {complaint.accused?.firstName} {complaint.accused?.lastName}
            </div>
          </div>

          {/* ID */}
          <div className="text-[10px] text-gray-300 mt-3">ID: {complaint.id}</div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintList;