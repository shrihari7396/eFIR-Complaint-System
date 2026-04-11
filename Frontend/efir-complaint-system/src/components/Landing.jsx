// Landing — Civic portal homepage with hero, how-it-works, features, AI chat
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ChatBox from './ChatBox';
import Navigation from "./Navigation.jsx";
import Footer from "./Footer.jsx";
import { FiFileText, FiSearch, FiCheckCircle, FiShield, FiZap, FiLock } from 'react-icons/fi';

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsVisible(true), 100);

    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'features-section') setFeaturesVisible(true);
          else if (entry.target.id === 'chat-section') setChatVisible(true);
        }
      });
    }, observerOptions);

    setTimeout(() => {
      const el1 = document.getElementById('features-section');
      const el2 = document.getElementById('chat-section');
      if (el1) observer.observe(el1);
      if (el2) observer.observe(el2);
    }, 100);

    return () => observer.disconnect();
  }, []);

  const steps = [
    { icon: <FiFileText className="w-8 h-8" />, title: 'Register', desc: 'Create your account with Aadhar verification for secure access.' },
    { icon: <FiSearch className="w-8 h-8" />, title: 'File Complaint', desc: 'Submit your FIR digitally with victim, accused, and incident details.' },
    { icon: <FiCheckCircle className="w-8 h-8" />, title: 'Track Status', desc: 'Monitor your complaint status in real-time from your dashboard.' },
  ];

  const features = [
    { icon: <FiShield className="w-7 h-7" />, title: 'End-to-End Encrypted', desc: 'All personal data is AES-encrypted before transmission. Your privacy is non-negotiable.' },
    { icon: <FiZap className="w-7 h-7" />, title: 'Instant Processing', desc: 'Complaints are immediately dispatched to the concerned police station for faster resolution.' },
    { icon: <FiLock className="w-7 h-7" />, title: 'Tamper-Proof Records', desc: 'Every complaint is securely stored with an immutable audit trail for legal integrity.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-saffron-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-navy-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-navy-600/50 border border-navy-500/30 text-saffron-400 text-sm font-medium">
                <FiShield className="w-4 h-4" />
                Government of India Initiative
              </div>
            </div>

            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Digital FIR.{' '}
              <span className="text-saffron-400">Transparent Justice.</span>
            </h1>

            <p className={`mt-6 text-lg text-navy-200 max-w-2xl mx-auto transition-all duration-1000 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              File and track First Information Reports digitally. A secure, efficient, and transparent
              complaint management system for citizens and law enforcement.
            </p>

            <div className={`mt-10 flex flex-col sm:flex-row justify-center gap-4 transition-all duration-1000 delay-600 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Link to="/login" className="btn-saffron text-base px-8 py-3.5 text-center">
                Citizen Login
              </Link>
              <Link to="/police-login" className="btn-outline text-base px-8 py-3.5 text-center">
                Police Login
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 40L48 36C96 32 192 24 288 28C384 32 480 48 576 52C672 56 768 48 864 40C960 32 1056 24 1152 28C1248 32 1344 48 1392 56L1440 64V80H0V40Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-700 mb-3">How It Works</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Three simple steps to file your complaint digitally</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center group">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-navy-200" />
                )}
                <div className="relative z-10 w-24 h-24 mx-auto mb-6 rounded-2xl bg-navy-700 text-white flex items-center justify-center shadow-lg group-hover:bg-saffron-400 group-hover:text-navy-900 transition-all duration-300">
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-saffron-400 text-navy-900 text-xs font-bold flex items-center justify-center shadow group-hover:bg-navy-700 group-hover:text-white transition-all">{i + 1}</span>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-navy-700 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-700 mb-3">Why Use eFIR?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Built with security, speed, and transparency at its core</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className={`card p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-500 transform ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-navy-700 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section id="chat-section" className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center mb-12 transition-all duration-800 transform ${chatVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-3xl font-bold text-navy-700 mb-3">Need Help?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Our AI assistant is here to answer your questions about the complaint process, 24/7.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <ChatBox />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;