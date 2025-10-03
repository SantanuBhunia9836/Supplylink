// src/components/layout/SellerHeader.js
import React, { useContext, useState } from "react";
import { AuthContext } from "../../features/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileCompletionIndicator from "../common/ProfileCompletionIndicator";

// --- Icon Components ---
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
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
);
const MenuIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
);
const SpinnerIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
const XIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const SellerHeader = ({ pageTitle }) => {
  const { user, logout, logoutLoading, profileCompletion } = useContext(AuthContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 relative z-30">
      {searchOpen && (
        <div className="absolute inset-0 bg-white flex items-center px-4 animate-slideDown z-40">
          <SearchIcon className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search products, orders, or customers..."
            className="w-full h-full px-4 text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
            autoFocus
          />
          <button onClick={() => setSearchOpen(false)} className="text-gray-500 hover:text-gray-800"><XIcon className="w-6 h-6" /></button>
        </div>
      )}

      <div className={`flex items-center flex-grow transition-opacity ${searchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-500 hover:text-gray-700"><MenuIcon className="w-6 h-6" /></button>
        </div>
        <div className="hidden md:flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <img src="/supplylink-logo.png" alt="SupplyLink Logo" className="h-8 w-auto mr-3 animate-slideIn" />
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">{pageTitle}</h1>
        </div>
      </div>

      <div className={`flex items-center space-x-4 sm:space-x-6 transition-opacity ${searchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button onClick={() => setSearchOpen(true)} className="text-gray-500 hover:text-gray-700"><SearchIcon className="w-6 h-6" /></button>
        
        <div className="relative">
          <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative text-gray-500 hover:text-gray-700">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-xl z-10 border border-gray-200">
              <div className="p-3 border-b"><h3 className="font-semibold text-gray-800">Notifications</h3></div>
              <div className="py-2 max-h-96 overflow-y-auto">
                {/* Placeholder Notifications */}
                <a href="#" className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                  <div><p className="font-medium text-gray-800">New Order #SL5821</p><p className="text-gray-500 text-xs">You have received a new order.</p></div>
                </a>
              </div>
            </div>
          )}
        </div>

        {user && (
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-2">
              <ProfileCompletionIndicator profileCompletion={profileCompletion} size={40} strokeWidth={3} showPercentage={false}>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"><UserIcon className="w-5 h-5 text-gray-600" /></div>
              </ProfileCompletionIndicator>
              <span className="text-gray-700 font-medium hidden sm:block">{user?.name || "User"}</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10 border border-gray-200">
                <div className="py-2">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-medium">{user?.businessName || user?.name}</p>
                    <p className="text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  
                  {/* --- THIS IS THE FIX --- */}
                  <button
                    onClick={() => navigate("/vendor-dashboard")}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Vendor Dashboard</span>
                  </button>

                  <button onClick={handleLogout} disabled={logoutLoading} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left disabled:opacity-50">
                    {logoutLoading ? <SpinnerIcon className="w-4 h-4" /> : <LogOutIcon className="w-4 h-4" />}
                    <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default SellerHeader;