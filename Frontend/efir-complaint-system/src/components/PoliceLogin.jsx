// PoliceLogin — Dark navy theme with badge icon
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import API from '../api/axiosInstance.js';
import { FiShield } from 'react-icons/fi';
import { injectPoliceDummyData } from '../utils/mockDataInjector.js';

const PoliceLogin = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '', verified: true, role: "POLICE" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await API.post('/user/login/police', { ...credentials });
      if (response.status === 200) {
        const token = response.data;
        const success = await login(token);
        if (success) {
          toast.success('Login successful!');
          localStorage.setItem('token', token);
          navigate('/police-dashboard');
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Invalid username or password');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-navy-700 border-4 border-saffron-400 flex items-center justify-center shadow-lg shadow-saffron-400/20">
            <FiShield className="w-10 h-10 text-saffron-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Police Officer Login</h1>
          <p className="text-navy-300 text-sm mt-1">Authorized personnel only</p>
        </div>

        {/* Form Card */}
        <div className="bg-navy-800 rounded-2xl border border-navy-600 p-8 shadow-2xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-navy-200 mb-1">Badge / Username</label>
              <input
                id="username" name="username" type="text" required
                className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-saffron-400 transition-all"
                placeholder="Enter your badge number" value={credentials.username} onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-navy-200 mb-1">Password</label>
              <input
                id="password" name="password" type="password" required
                className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-saffron-400 transition-all"
                placeholder="Enter your password" value={credentials.password} onChange={handleChange}
              />
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full px-6 py-3 bg-saffron-400 text-navy-900 font-semibold rounded-lg hover:bg-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:ring-offset-2 focus:ring-offset-navy-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? (
                <><div className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" /> Signing in...</>
              ) : (
                <><FiShield className="w-5 h-5" /> Sign In</>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 space-y-4">
          {import.meta.env.DEV && (
            <button
              onClick={() => {
                injectPoliceDummyData();
                toast.success('Test mode active! Using dummy data.');
                window.location.href = '/police-dashboard';
              }}
              className="w-full text-sm py-2 bg-navy-800 hover:bg-navy-700 text-saffron-400 border border-saffron-400/30 rounded-lg transition-colors font-medium cursor-pointer"
            >
              🚀 Bypass Login (Test Mode)
            </button>
          )}
          <Link to="/login" className="block text-sm text-navy-400 hover:text-saffron-400 font-medium transition-colors">
            ← Back to Citizen Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PoliceLogin;