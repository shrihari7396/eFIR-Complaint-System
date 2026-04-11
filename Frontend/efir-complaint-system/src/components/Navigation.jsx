// Navigation — Navy-themed top bar with mobile hamburger
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import logo from '../assets/image.png';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-navy-700 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img src={logo} alt="eFIR Logo" className="h-10 w-10 rounded bg-white p-0.5" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white leading-tight">eFIR</span>
              <span className="text-xs text-navy-200 leading-tight hidden sm:block">Complaint System</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-navy-200 hover:text-white text-sm font-medium transition-colors">Home</Link>

            {isAuthenticated && user?.role === 'POLICE' && (
              <Link to="/police-dashboard" className="text-navy-200 hover:text-white text-sm font-medium transition-colors">
                Dashboard
              </Link>
            )}

            {isAuthenticated && user?.role === "USER" && (
              <Link to="/dashboard" className="text-navy-200 hover:text-white text-sm font-medium transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-navy-200 text-sm font-medium">
                  {user?.firstName?.toUpperCase()}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-navy-700 bg-saffron-400 rounded-lg hover:bg-saffron-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-navy-200 hover:text-white text-sm font-medium transition-colors">
                  Citizen Login
                </Link>
                <Link to="/police-login" className="text-navy-200 hover:text-white text-sm font-medium transition-colors">
                  Police Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-navy-700 bg-saffron-400 rounded-lg hover:bg-saffron-500 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-800 border-t border-navy-600 animate-slide-down">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-navy-200 hover:text-white text-sm font-medium">Home</Link>

            {isAuthenticated && user?.role === 'POLICE' && (
              <Link to="/police-dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-navy-200 hover:text-white text-sm font-medium">
                Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === "USER" && (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-navy-200 hover:text-white text-sm font-medium">
                Dashboard
              </Link>
            )}

            <div className="pt-3 border-t border-navy-600 space-y-3">
              {isAuthenticated ? (
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left text-saffron-400 text-sm font-medium">
                  Logout ({user?.firstName})
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-navy-200 hover:text-white text-sm font-medium">Citizen Login</Link>
                  <Link to="/police-login" onClick={() => setMobileMenuOpen(false)} className="block text-navy-200 hover:text-white text-sm font-medium">Police Login</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block text-saffron-400 text-sm font-medium">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
