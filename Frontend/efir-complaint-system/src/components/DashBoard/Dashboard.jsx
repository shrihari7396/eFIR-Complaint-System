// Dashboard — Navy sidebar shell with top bar, mobile menu, footer
import SideBar from "./SideBar.jsx";
import { useEffect, useState } from "react";
import { fetchActiveComplaints } from "../../utils/session.js";
import MainDashboard from "./MainDashboard.jsx";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer.jsx";
import { decryptuser } from "../../context/DecryptionHelper.js";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Dashboard = () => {
  const [platform, setplatform] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const encrypted = localStorage.getItem("user");
        if (encrypted) {
          const person = decryptuser(JSON.parse(encrypted));
          setUser(person);
        }
        if (sessionStorage.getItem("complaints") === null) {
          await fetchActiveComplaints();
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  function handlelogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("complaints");
    navigate("/");
  }

  const handlePlatformSelect = (p) => {
    setplatform(p);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden text-gray-600 p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
          <h1 className="text-lg font-bold text-navy-700">eFIR Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:block">
            Welcome, <strong className="text-navy-700">{user?.firstName} {user?.lastName}</strong>
          </span>
          <button
            onClick={handlelogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <FiLogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-20 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative z-30 w-64">
              <SideBar
                select={platform}
                onSelect={handlePlatformSelect}
                collapsed={false}
                onToggle={() => {}}
              />
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <SideBar
            select={platform}
            onSelect={setplatform}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          <MainDashboard platform={platform} />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;