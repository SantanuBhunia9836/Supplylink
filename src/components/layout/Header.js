// src/components/layout/Header.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

// Icon components
const BellIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
);

const UserIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const LogOutIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);

const SearchIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
);

const Header = ({ pageTitle }) => {
  const { user, logout } = useContext(AuthContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleBecomeSeller = () => {
    setProfileOpen(false);
    navigate('/seller-registration');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
      <div className="flex items-center space-x-6">
        <button className="relative text-gray-500 hover:text-gray-700">
          <BellIcon className="w-6 h-6"/>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Search Icon */}
        <button className="text-gray-500 hover:text-gray-700">
          <SearchIcon className="w-6 h-6"/>
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)} 
            className="flex items-center space-x-2"
          >
            <UserIcon className="w-8 h-8 text-gray-600 bg-gray-200 rounded-full p-1"/>
            <span className="text-gray-700 font-medium hidden sm:block">
              {user?.name || 'User'}
            </span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10 border border-gray-200">
              <div className="py-2">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <p className="font-medium">{user?.name || user?.businessName}</p>
                  <p className="text-gray-500 capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    // Navigate to dashboard or account page
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <UserIcon className="w-4 h-4"/>
                  <span>My Account</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/dashboard');
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <UserIcon className="w-4 h-4"/>
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={handleBecomeSeller}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left border-t border-gray-100"
                >
                  <UserIcon className="w-4 h-4"/>
                  <span>Become a Seller</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <LogOutIcon className="w-4 h-4"/>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 