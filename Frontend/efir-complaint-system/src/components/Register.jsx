// Register — Navy/saffron theme, responsive layout, uses axiosInstance
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/image.png';
import API from '../api/axiosInstance.js';
import toast from "react-hot-toast";
import { encryptAES } from "../utils/AESEncryption.js";
import { FiUserPlus } from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', password: '', firstName: '', lastName: '',
    aadharNumber: '', email: '',
    address: { street: '', city: '', state: '', zip: '', country: '' },
    role: "USER", verified: false
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({ ...prev, address: { ...prev.address, [addressField]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const encryptData = async (formdata) => {
    return {
      ...formdata,
      firstName: encryptAES(formdata.firstName),
      lastName: encryptAES(formdata.lastName),
      aadharNumber: encryptAES(formdata.aadharNumber),
      address: {
        street: encryptAES(formdata.address.street),
        city: encryptAES(formdata.address.city),
        state: encryptAES(formdata.address.state),
        zip: encryptAES(formdata.address.zip),
        country: encryptAES(formdata.address.country)
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setIsLoading(true);
    try {
      const RequestData = await encryptData(formData);
      const response = await API.post('/user/register', RequestData);
      if (response.status === 200) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        toast.success('Registration successful!');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      let errorMessage = '';
      if (err.response) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (typeof err.response.data === 'object' && err.response.data !== null) {
          if (err.response.data.message) errorMessage = err.response.data.message;
          else if (err.response.data.error) errorMessage = err.response.data.error;
          else {
            switch (err.response.status) {
              case 208: toast.error('User already exists.'); errorMessage = 'User already exists.'; break;
              case 400: toast.error('Invalid registration data.'); errorMessage = 'Invalid registration data.'; break;
              default: errorMessage = 'Registration failed. Please try again.';
            }
          }
        } else { errorMessage = 'An unexpected error occurred.'; }
      } else if (err.request) { errorMessage = 'No response from server. Please check your connection.'; }
      else { errorMessage = 'Failed to make registration request.'; }
      if (!errorMessage) errorMessage = 'An error occurred during registration.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ label, id, ...props }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input id={id} {...props} className="input-field" />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center civic-pattern py-8 px-4">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-2xl shadow-2xl overflow-hidden">
        {/* Left — Form */}
        <div className="flex-1 p-8 md:p-12 bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-navy-700 mb-1">Create Account</h2>
            <p className="text-gray-500 text-sm">Fill in your details to get started with eFIR</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center text-sm">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 ml-2">✕</button>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="First Name" id="firstName" name="firstName" type="text" required placeholder="Enter first name" value={formData.firstName} onChange={handleChange} />
              <InputField label="Last Name" id="lastName" name="lastName" type="text" required placeholder="Enter last name" value={formData.lastName} onChange={handleChange} />
              <InputField label="Email" id="email" name="email" type="email" required placeholder="Enter email" value={formData.email} onChange={handleChange} />
              <InputField label="Username" id="username" name="username" type="text" required placeholder="Choose username" value={formData.username} onChange={handleChange} />
              <InputField label="Password" id="password" name="password" type="password" required placeholder="Create password" value={formData.password} onChange={handleChange} />
              <InputField label="Aadhar Number" id="aadharNumber" name="aadharNumber" type="text" required pattern="[0-9]{12}" maxLength="12" placeholder="12-digit Aadhar" value={formData.aadharNumber} onChange={handleChange} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-navy-700 mb-3 mt-2">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputField label="Street" id="address.street" name="address.street" type="text" required placeholder="Street address" value={formData.address.street} onChange={handleChange} />
                </div>
                <InputField label="City" id="address.city" name="address.city" type="text" required placeholder="City" value={formData.address.city} onChange={handleChange} />
                <InputField label="State" id="address.state" name="address.state" type="text" required placeholder="State" value={formData.address.state} onChange={handleChange} />
                <InputField label="ZIP Code" id="address.zip" name="address.zip" type="text" required pattern="[0-9]{6}" maxLength="6" placeholder="ZIP code" value={formData.address.zip} onChange={handleChange} />
                <InputField label="Country" id="address.country" name="address.country" type="text" required placeholder="Country" value={formData.address.country} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-4">
              {isLoading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Registering...</>
              ) : (
                <><FiUserPlus className="w-5 h-5" /> Create Account</>
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-navy-700 hover:text-saffron-500">Sign in</Link>
            </p>
          </form>
        </div>

        {/* Right — Branding Panel */}
        <div className="hidden lg:flex lg:w-80 bg-gradient-to-b from-navy-700 to-navy-900 p-12 text-white flex-col items-center justify-center relative">
          <div className="absolute top-6 right-6">
            <img src={logo} alt="Logo" className="h-16 w-16 bg-white rounded-xl p-1" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3">eFIR System</h2>
            <p className="text-navy-200 text-sm leading-relaxed">
              Join the digital initiative for transparent complaint management. Your voice matters.
            </p>
            <div className="mt-8 w-16 h-1 mx-auto bg-saffron-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;