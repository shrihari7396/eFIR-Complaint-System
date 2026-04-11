// Complaints — Status-badged card list
import ComplaintList from "../ComplaintList.jsx";
import { useEffect, useState } from "react";
import { decryptComplaint } from "../../context/DecryptionHelper.js";
import { FiArrowLeft } from 'react-icons/fi';

const Complaints = () => {
  const [activeComplaints, setActiveComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const encrypted = sessionStorage.getItem("complaints");
    if (encrypted) {
      let complaintsArr;
      try { complaintsArr = JSON.parse(encrypted); } catch (e) { complaintsArr = []; }
      if (Array.isArray(complaintsArr)) {
        const data = complaintsArr.map(c => decryptComplaint(c));
        setActiveComplaints(data);
      } else { setActiveComplaints([]); }
    }
  }, []);

  const handleComplaintClick = (complaint) => setSelectedComplaint(complaint);

  const getStatusBadge = (status) => {
    if (status === 'SUCCEEDED') return 'badge-success';
    if (status === 'REJECTED') return 'badge-rejected';
    return 'badge-pending';
  };

  const renderAddress = (addr) => addr ? [addr.street, addr.city, addr.state, addr.zip, addr.country].filter(Boolean).join(', ') : 'N/A';

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-700 mb-6">My Complaints</h2>
      {selectedComplaint ? (
        <div className="card p-6">
          <button
            onClick={() => setSelectedComplaint(null)}
            className="mb-5 text-navy-600 hover:text-navy-800 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Complaints
          </button>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-navy-700">Complaint Details</h3>
              <span className={getStatusBadge(selectedComplaint.status)}>{selectedComplaint.status}</span>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h4 className="font-semibold text-navy-700 mb-3 text-sm uppercase tracking-wide">Incident</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium text-gray-600">Date:</span> {selectedComplaint.incidence?.date}</p>
                <p><span className="font-medium text-gray-600">Time:</span> {selectedComplaint.incidence?.time}</p>
                <p><span className="font-medium text-gray-600">Type:</span> {selectedComplaint.incidence?.crimetype}</p>
                <p className="md:col-span-2"><span className="font-medium text-gray-600">Address:</span> {renderAddress(selectedComplaint.incidence?.address)}</p>
                <p className="md:col-span-2"><span className="font-medium text-gray-600">Description:</span> {selectedComplaint.incidence?.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-navy-50 rounded-xl p-5">
                <h4 className="font-semibold text-navy-700 mb-3 text-sm uppercase tracking-wide">Victim</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium text-gray-600">Name:</span> {selectedComplaint.victim?.firstName} {selectedComplaint.victim?.lastName}</p>
                  <p><span className="font-medium text-gray-600">Phone:</span> {selectedComplaint.victim?.phone}</p>
                  <p><span className="font-medium text-gray-600">Address:</span> {renderAddress(selectedComplaint.victim?.address)}</p>
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-5">
                <h4 className="font-semibold text-red-700 mb-3 text-sm uppercase tracking-wide">Accused</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium text-gray-600">Name:</span> {selectedComplaint.accused?.firstName} {selectedComplaint.accused?.lastName}</p>
                  <p><span className="font-medium text-gray-600">Phone:</span> {selectedComplaint.accused?.phone}</p>
                  <p><span className="font-medium text-gray-600">Address:</span> {renderAddress(selectedComplaint.accused?.address)}</p>
                </div>
              </div>
            </div>

            {selectedComplaint.evidenceLink && (
              <div className="bg-saffron-50 rounded-xl p-5">
                <h4 className="font-semibold text-saffron-700 mb-2 text-sm uppercase tracking-wide">Evidence</h4>
                <a href={selectedComplaint.evidenceLink} target="_blank" rel="noopener noreferrer"
                  className="text-navy-600 hover:text-navy-800 underline text-sm break-all">{selectedComplaint.evidenceLink}</a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <ComplaintList complaints={activeComplaints} onSelect={handleComplaintClick} />
      )}
    </div>
  );
};

export default Complaints;