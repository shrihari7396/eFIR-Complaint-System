// Login — Navy/saffron card-based layout with credentials + OTP methods
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosInstance.js';
import { FiUser, FiMail } from 'react-icons/fi';
import { injectCitizenDummyData } from '../utils/mockDataInjector.js';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState('credentials');

  const [credentials, setCredentials] = useState({ username: '', password: '', verified: true });
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await API.post('/user/login', { 
        username: credentials.username, 
        password: credentials.password, 
        verified: credentials.verified, 
        role: "USER" 
      });

      if (response.status === 200) {
        const token = response.data;
        const success = await login(token);
        if (success) {
          toast.success('Login successful!');
          navigate('/dashboard');
        } else {
          toast.error("Email verification needed");
          navigate('/verification');
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Invalid username or password');
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await API.post(`/user/sendOtp?email=${encodeURIComponent(email)}`);
      if (response.status === 200) {
        setOtpSent(true);
        toast.success('OTP has been sent to your email');
      }
    } catch (error) {
      if (error.response?.status === 405) {
        toast.error('Please register first');
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await API.post(`/user/verifyOtp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
      if (response.status === 200) {
        const token = response.data;
        toast.success('Login successful!');
        const success = await login(token);
        if (success) navigate('/dashboard');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Invalid OTP. Please try again.');
      } else {
        toast.error('Failed to verify OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center civic-pattern py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-navy-700 flex items-center justify-center">
            <FiUser className="w-8 h-8 text-saffron-400" />
          </div>
          <h1 className="text-2xl font-bold text-navy-700">Citizen Login</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your eFIR account</p>
        </div>

        {/* Method Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setLoginMethod('credentials')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${loginMethod === 'credentials' ? 'bg-navy-700 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <FiUser className="w-4 h-4" /> Password
          </button>
          <button
            onClick={() => { setLoginMethod('otp'); setOtpSent(false); setOtp(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${loginMethod === 'otp' ? 'bg-navy-700 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <FiMail className="w-4 h-4" /> Email OTP
          </button>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          {loginMethod === 'credentials' && (
            <form className="space-y-5" onSubmit={handleCredentialsLogin}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input id="username" name="username" type="text" required value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="input-field" placeholder="Enter your username" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input id="password" name="password" type="password" required value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="input-field" placeholder="Enter your password" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full btn-primary py-3">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {loginMethod === 'otp' && (
            <form className="space-y-5" onSubmit={otpSent ? handleOtpVerification : handleSendOtp}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input id="email" name="email" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)} disabled={otpSent}
                  className="input-field disabled:bg-gray-100" placeholder="Enter your email" />
              </div>
              {otpSent && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">One-Time Password</label>
                  <input id="otp" name="otp" type="text" required value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input-field text-center text-xl tracking-[0.5em] font-mono"
                    placeholder="• • • • • •" maxLength={6} />
                </div>
              )}
              <button type="submit" disabled={isLoading} className="w-full btn-primary py-3">
                {isLoading ? (otpSent ? 'Verifying...' : 'Sending OTP...') : (otpSent ? 'Verify OTP' : 'Send OTP')}
              </button>
              {otpSent && (
                <button type="button" onClick={() => setOtpSent(false)}
                  className="w-full text-sm text-navy-600 hover:text-navy-800 font-medium">
                  Change email or resend OTP
                </button>
              )}
            </form>
          )}
        </div>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-2">
          {import.meta.env.DEV && (
            <button
              onClick={() => {
                injectCitizenDummyData();
                toast.success('Test mode active! Using dummy data.');
                window.location.href = '/dashboard';
              }}
              className="w-full btn-secondary text-sm py-2 mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
            >
              🚀 Bypass Login (Test Mode)
            </button>
          )}
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-navy-700 hover:text-saffron-500">Register here</Link>
          </p>
          <p className="text-sm text-gray-500">
            <Link to="/police-login" className="font-medium text-gray-500 hover:text-navy-700">Police Officer? Login here →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;