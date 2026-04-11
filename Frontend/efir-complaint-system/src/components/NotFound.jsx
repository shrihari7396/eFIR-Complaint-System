// 404 Not Found page
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-extrabold text-navy-700 mb-2">404</h1>
        <div className="w-16 h-1 mx-auto bg-saffron-400 rounded-full mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <FiHome className="w-4 h-4" /> Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
