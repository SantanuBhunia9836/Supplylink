// src/components/layout/Sidebar.js
import React, { useContext } from 'react';
// ... existing code ...
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../features/auth/AuthContext'; // Corrected path
// ... existing code ...

// Icon components
const HomeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);

const PlusCircleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
);

const ShoppingCartIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
);

const PackageIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>
);

const Sidebar = ({ activePage }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = {
    shop: [
      { id: 'overview', icon: <HomeIcon className="w-5 h-5"/>, label: 'Overview', path: '/dashboard' },
      { id: 'create-order', icon: <PlusCircleIcon className="w-5 h-5"/>, label: 'Create Order', path: '/dashboard/create-order' },
      { id: 'orders', icon: <ShoppingCartIcon className="w-5 h-5"/>, label: 'My Orders', path: '/dashboard/orders' },
    ],
    vendor: [
      { id: 'overview', icon: <HomeIcon className="w-5 h-5"/>, label: 'Overview', path: '/dashboard' },
      { id: 'incoming-orders', icon: <PackageIcon className="w-5 h-5"/>, label: 'Incoming Orders', path: '/dashboard/incoming-orders' },
      { id: 'deliveries', icon: <ShoppingCartIcon className="w-5 h-5"/>, label: 'Deliveries', path: '/dashboard/deliveries' },
    ]
  };

  const currentNavItems = user ? navItems[user.role] || [] : [];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (itemPath) => {
    return location.pathname === itemPath || 
           (itemPath === '/dashboard' && location.pathname === '/dashboard/overview');
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex-col hidden md:flex">
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
        SupplyLink
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {currentNavItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              isActive(item.path) ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 