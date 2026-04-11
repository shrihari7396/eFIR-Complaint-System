// SideBar — Navy-themed collapsible sidebar with icons
import { FiHome, FiFileText, FiPlusCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SideBar = ({ select, onSelect, collapsed, onToggle }) => {
  const items = [
    { key: 'overview', label: 'Overview', icon: <FiHome className="w-5 h-5" /> },
    { key: 'complaints', label: 'My Complaints', icon: <FiFileText className="w-5 h-5" /> },
    { key: 'new-complaint', label: 'New Complaint', icon: <FiPlusCircle className="w-5 h-5" /> },
  ];

  return (
    <aside className={`bg-navy-800 text-white flex flex-col min-h-[calc(100vh-8rem)] transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="hidden lg:flex items-center justify-center h-10 text-navy-300 hover:text-white hover:bg-navy-700 transition-colors"
      >
        {collapsed ? <FiChevronRight className="w-4 h-4" /> : <FiChevronLeft className="w-4 h-4" />}
      </button>

      {/* Nav items */}
      <nav className="flex-1 py-2">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
              select === item.key
                ? 'bg-navy-700 text-saffron-400 border-l-3 border-saffron-400'
                : 'text-navy-300 hover:bg-navy-700 hover:text-white'
            } ${collapsed ? 'justify-center px-2' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
