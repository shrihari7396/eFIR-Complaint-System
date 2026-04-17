// ComplaintSubmission — Multi-step wizard with progress bar
import { useState } from 'react';
import toast from "react-hot-toast";
import { encryptComplaint } from "../../context/DecryptionHelper.js";
import { fetchActiveComplaints } from "../../utils/session.js";
import API from "../../api/axiosInstance.js";
import { FiUser, FiAlertTriangle, FiMapPin, FiLink, FiCheck, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

const STEPS = [
  { key: 'victim', label: 'Victim Info', icon: <FiUser className="w-4 h-4" /> },
  { key: 'accused', label: 'Accused Info', icon: <FiAlertTriangle className="w-4 h-4" /> },
  { key: 'incident', label: 'Incident Details', icon: <FiMapPin className="w-4 h-4" /> },
  { key: 'review', label: 'Evidence & Review', icon: <FiCheck className="w-4 h-4" /> },
];

const ComplaintInputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input {...props} className="input-field" />
  </div>
);

const AddressFields = ({ data, onChange, prefix = 'address' }) => (
  <div className="space-y-3 mt-3">
    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide">Address</label>
    <input name={`${prefix}.street`} value={data.street} onChange={onChange} placeholder="Street address" className="input-field" />
    <div className="grid grid-cols-2 gap-3">
      <input name={`${prefix}.city`} value={data.city} onChange={onChange} placeholder="City" className="input-field" />
      <input name={`${prefix}.state`} value={data.state} onChange={onChange} placeholder="State" className="input-field" />
      <input name={`${prefix}.zip`} value={data.zip} onChange={onChange} placeholder="ZIP code" className="input-field" />
      <input name={`${prefix}.country`} value={data.country} onChange={onChange} placeholder="Country" className="input-field" />
    </div>
  </div>
);

const ComplaintSubmission = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [evidenceLink, setEvidenceLink] = useState('');
  const [hasEvidenceLink, setHasEvidenceLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [incidence, setIncidentDetails] = useState({
    date: '', time: '', description: '',
    address: { street: '', city: '', zip: '', state: '', country: '' }
  });
  const [victim, setVictim] = useState({
    firstName: '', lastName: '', phone: '',
    address: { street: '', city: '', state: '', zip: '', country: '' }
  });
  const [accused, setAccused] = useState({
    firstName: '', lastName: '', phone: '',
    address: { street: '', city: '', state: '', zip: '', country: '' }
  });

  const handleNestedChange = (setter) => (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setter(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setter(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = { victim, accused, incidence, evidenceLink: hasEvidenceLink ? evidenceLink : null };
    const encrypted = encryptComplaint(formData);
    try {
      const response = await API.post('/complaint/save', encrypted);
      if (response.status === 200) {
        toast.success('Complaint submitted successfully!');
        // Reset
        setVictim({ firstName: '', lastName: '', phone: '', address: { street: '', city: '', state: '', zip: '', country: '' } });
        setAccused({ firstName: '', lastName: '', phone: '', address: { street: '', city: '', state: '', zip: '', country: '' } });
        setIncidentDetails({ date: '', time: '', description: '', address: { street: '', city: '', zip: '', state: '', country: '' } });
        setEvidenceLink(''); setHasEvidenceLink(false); setCurrentStep(0);
        await fetchActiveComplaints();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAddress = (addr) => addr ? [addr.street, addr.city, addr.state, addr.zip, addr.country].filter(Boolean).join(', ') : 'N/A';

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-navy-700 mb-6">File New Complaint</h2>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => (
            <div key={step.key} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 ${i <= currentStep ? 'text-navy-700' : 'text-gray-400'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  i < currentStep ? 'bg-green-500 text-white' : i === currentStep ? 'bg-navy-700 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {i < currentStep ? <FiCheck className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card p-6 mb-6">
          {/* Step 1: Victim */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy-700 flex items-center gap-2"><FiUser /> Victim Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComplaintInputField label="First Name" name="firstName" value={victim.firstName} onChange={handleNestedChange(setVictim)} placeholder="First name" type="text" />
                <ComplaintInputField label="Last Name" name="lastName" value={victim.lastName} onChange={handleNestedChange(setVictim)} placeholder="Last name" type="text" />
              </div>
              <ComplaintInputField label="Phone Number" name="phone" value={victim.phone} onChange={handleNestedChange(setVictim)} placeholder="Phone number" type="tel" />
              <AddressFields data={victim.address} onChange={handleNestedChange(setVictim)} />
            </div>
          )}

          {/* Step 2: Accused */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy-700 flex items-center gap-2"><FiAlertTriangle /> Accused Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComplaintInputField label="First Name" name="firstName" value={accused.firstName} onChange={handleNestedChange(setAccused)} placeholder="First name" type="text" />
                <ComplaintInputField label="Last Name" name="lastName" value={accused.lastName} onChange={handleNestedChange(setAccused)} placeholder="Last name" type="text" />
              </div>
              <ComplaintInputField label="Phone Number" name="phone" value={accused.phone} onChange={handleNestedChange(setAccused)} placeholder="Phone number" type="tel" />
              <AddressFields data={accused.address} onChange={handleNestedChange(setAccused)} />
            </div>
          )}

          {/* Step 3: Incident */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy-700 flex items-center gap-2"><FiMapPin /> Incident Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComplaintInputField label="Date of Incident" name="date" value={incidence.date} onChange={handleNestedChange(setIncidentDetails)} type="date" />
                <ComplaintInputField label="Time of Incident" name="time" value={incidence.time} onChange={handleNestedChange(setIncidentDetails)} type="time" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={incidence.description} onChange={handleNestedChange(setIncidentDetails)}
                  rows={5} placeholder="Provide a detailed description of the incident..."
                  className="input-field resize-none" />
              </div>
              <AddressFields data={incidence.address} onChange={handleNestedChange(setIncidentDetails)} />
            </div>
          )}

          {/* Step 4: Evidence & Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-navy-700 flex items-center gap-2"><FiLink /> Evidence & Review</h3>

              {/* Evidence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evidence Link (optional)</label>
                {hasEvidenceLink ? (
                  <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg border border-green-200">
                    <a href={evidenceLink} target="_blank" rel="noopener noreferrer" className="text-navy-600 hover:underline truncate flex-1 text-sm">{evidenceLink}</a>
                    <button type="button" onClick={() => { setEvidenceLink(''); setHasEvidenceLink(false); }} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="url" value={evidenceLink} onChange={(e) => setEvidenceLink(e.target.value)} placeholder="https://..." className="input-field flex-1" />
                    <button type="button" onClick={() => { if (evidenceLink.trim()) setHasEvidenceLink(true); }}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">Add</button>
                  </div>
                )}
              </div>

              {/* Review Summary */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <h4 className="font-semibold text-navy-700 text-sm uppercase tracking-wide">Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-500 mb-1">Victim</p>
                    <p className="text-gray-800">{victim.firstName} {victim.lastName}</p>
                    <p className="text-gray-500">{victim.phone}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 mb-1">Accused</p>
                    <p className="text-gray-800">{accused.firstName} {accused.lastName}</p>
                    <p className="text-gray-500">{accused.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-medium text-gray-500 mb-1">Incident</p>
                    <p className="text-gray-800">{incidence.date} at {incidence.time}</p>
                    <p className="text-gray-600 text-xs mt-1">{incidence.description?.substring(0, 200)}{incidence.description?.length > 200 ? '...' : ''}</p>
                    <p className="text-gray-500 text-xs mt-1">{renderAddress(incidence.address)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button type="button"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentStep === 0 ? 'invisible' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}>
            <FiArrowLeft className="w-4 h-4" /> Previous
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button type="button"
              onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
              className="flex items-center gap-2 btn-primary px-6 py-2.5 text-sm">
              Next <FiArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 btn-saffron px-6 py-2.5 text-sm">
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" /> Submitting...</>
              ) : (
                <><FiCheck className="w-4 h-4" /> Submit Complaint</>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ComplaintSubmission;
