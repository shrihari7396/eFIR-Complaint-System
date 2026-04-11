// Full-screen and inline loading spinner with navy theme
const LoadingSpinner = ({ fullScreen = true, message = 'Loading...' }) => {
  if (!fullScreen) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-navy-200 border-t-navy-700 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-navy-200 border-t-navy-700 rounded-full animate-spin" />
        <p className="text-navy-700 font-semibold text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
