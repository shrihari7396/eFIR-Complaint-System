// App — Updated routes with ErrorBoundary, NotFound, navy-themed toaster
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import PoliceLogin from './components/PoliceLogin';
import Register from './components/Register';
import Landing from './components/Landing';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import PoliceDashboard from './components/PoliceDashboard';
import Dashboard from "./components/DashBoard/Dashboard.jsx";
import Verification from "./components/Verification.jsx";
import NotFound from "./components/NotFound.jsx";
import ErrorBoundary from "./components/ui/ErrorBoundary.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              style: {
                background: '#065f46',
                color: 'white',
              },
              iconTheme: { primary: '#34d399', secondary: '#065f46' },
            },
            error: {
              duration: 4000,
              style: {
                background: '#991b1b',
                color: 'white',
              },
              iconTheme: { primary: '#fca5a5', secondary: '#991b1b' },
            },
          }}
        />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/police-login" element={<PoliceLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verification" element={<Verification />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/police-dashboard"
              element={
                <ProtectedRoute requiredRole="POLICE">
                  <PoliceDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  )
}

export default App
