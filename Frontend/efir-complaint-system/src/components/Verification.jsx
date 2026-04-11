// Verification — Card-wrapped OTP page with 6-box input style
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { FiMail, FiCheck } from 'react-icons/fi';

const Verification = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/sendotp?email=${(email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setOtpSent(true);
        toast.success('OTP has been sent to your email');
      } else if (response.status === 405) {
        toast.error('Please register first');
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/verifyOtp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        localStorage.clear();
        const token = await response.text();
        toast.success('Verification successful!');
        if (login(token)) {
          navigate('/dashboard');
        }
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.');
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
            {otpSent ? <FiCheck className="w-8 h-8 text-saffron-400" /> : <FiMail className="w-8 h-8 text-saffron-400" />}
          </div>
          <h1 className="text-2xl font-bold text-navy-700">
            {otpSent ? 'Enter Verification Code' : 'Email Verification'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {otpSent ? `We've sent a code to ${email}` : 'Verify your email to activate your account'}
          </p>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          <form className="space-y-5" onSubmit={otpSent ? handleOtpVerification : handleSendOtp}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                id="email" name="email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
                className="input-field disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="Enter your registered email"
              />
            </div>

            {otpSent && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                <input
                  id="otp" name="otp" type="text" required
                  value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-field text-center text-2xl tracking-[0.6em] font-mono"
                  placeholder="• • • • • •"
                  maxLength={6}
                  autoComplete="one-time-code"
                />
                <p className="text-xs text-gray-400 mt-2 text-center">Enter the 6-digit code sent to your email</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full btn-primary py-3">
              {isLoading
                ? (otpSent ? 'Verifying...' : 'Sending OTP...')
                : (otpSent ? 'Verify & Continue' : 'Send Verification Code')}
            </button>

            {otpSent && (
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-sm text-navy-600 hover:text-navy-800 font-medium"
              >
                Change email or resend code
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verification;