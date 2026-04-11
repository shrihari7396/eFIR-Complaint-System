// Footer — Navy themed with government disclaimer
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-saffron-400">eFIR Complaint System</h3>
            <p className="text-navy-300 text-sm leading-relaxed">
              A digital platform for filing and managing First Information Reports (FIRs) online.
              Ensuring transparency, efficiency, and accessibility for all citizens.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-saffron-400">Contact</h3>
            <div className="space-y-3 text-navy-300 text-sm">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>+91 1234567890</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>support@efir.gov.in</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Survey No. 27, Near Trimurti Chowk, Dhankawadi, Pune - 411043</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-saffron-400">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-navy-300 hover:text-saffron-400 transition-colors">Home</Link></li>
              <li><Link to="/login" className="text-navy-300 hover:text-saffron-400 transition-colors">Citizen Login</Link></li>
              <li><Link to="/police-login" className="text-navy-300 hover:text-saffron-400 transition-colors">Police Login</Link></li>
              <li><Link to="/register" className="text-navy-300 hover:text-saffron-400 transition-colors">Register</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 pt-8 border-t border-navy-700">
          <p className="text-xs text-navy-400 leading-relaxed mb-4">
            <strong className="text-navy-300">Disclaimer:</strong> This is a digital FIR filing system.
            Filing a false complaint is a punishable offence under Section 182 of the Indian Penal Code.
            All information submitted is subject to verification by the concerned police authority.
            This portal does not replace the requirement for physical verification where mandated by law.
          </p>
          <p className="text-center text-sm text-navy-400">
            &copy; {new Date().getFullYear()} eFIR Complaint System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;