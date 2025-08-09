// src/components/layout/MobileNavigation.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ProfileCompletionIndicator from '../common/ProfileCompletionIndicator';

// --- Icon Components ---
const HomeIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const UserIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const DashboardIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const LocationIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const LogOutIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
const CloseIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const AccountMenu = ({ user, profileName, onClose, onLogout, onLocationClick }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50" onClick={onClose}>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 pb-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4"><div className="text-left"><p className="font-bold text-lg text-gray-800">{profileName}</p><p className="text-sm text-gray-500 capitalize">{user?.role} account</p></div><button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><CloseIcon /></button></div>
                <div className="space-y-2"><button onClick={onLocationClick} className="w-full flex items-center space-x-3 text-lg p-3 text-gray-700 hover:bg-gray-100 rounded-lg"><LocationIcon className="w-6 h-6" /><span>Location</span></button><button onClick={onLogout} className="w-full flex items-center space-x-3 text-lg p-3 text-red-600 hover:bg-red-50 rounded-lg"><LogOutIcon className="w-6 h-6" /><span>Logout</span></button></div>
            </div>
        </div>
    );
};

const MobileNavigation = ({ onLocationClick }) => {
    const { user, logout, profileCompletion } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [profileName, setProfileName] = useState('Account');

    useEffect(() => {
        if (user) {
            const possibleNames = [user.name, user.businessName, user.full_name, `${user.first_name || ""} ${user.last_name || ""}`.trim(), user.email?.split("@")[0], user.username,].filter(Boolean);
            setProfileName(possibleNames[0] || "Account");
        }
    }, [user]);

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        setIsAccountMenuOpen(false);
    }

    return (
        <>
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-lg z-40">
                <div className="flex justify-around items-center h-16">
                    <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 w-1/3">
                        <HomeIcon className="w-7 h-7" />
                        <span className="text-xs font-medium mt-1">Home</span>
                    </button>

                     {/* ALIGNMENT FIX: Using a layered approach for perfect centering */}
                    <button onClick={() => setIsAccountMenuOpen(true)} className="-mt-8 relative w-16 h-16 flex items-center justify-center">
                        {/* Layer 1: The main button look (background, border, shadow) */}
                        <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                            <UserIcon className="w-8 h-8 text-white" />
                        </div>
                        {/* Layer 2: The completion ring, positioned absolutely inside the border */}
                        <div className="absolute top-[4px] left-[4px] right-[4px] bottom-[4px]">
                            <ProfileCompletionIndicator
                                profileCompletion={profileCompletion}
                                size={56} // Inner size: 64px button - (2 * 4px border)
                                strokeWidth={3}
                                showPercentage={false}
                            />
                        </div>
                    </button>

                    <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 w-1/3">
                        <DashboardIcon className="w-7 h-7" />
                        <span className="text-xs font-medium mt-1">Dashboard</span>
                    </button>
                </div>
            </div>

            {isAccountMenuOpen && (
                <AccountMenu
                    user={user}
                    profileName={profileName}
                    onClose={() => setIsAccountMenuOpen(false)}
                    onLogout={handleLogout}
                    onLocationClick={() => {
                        onLocationClick();
                        setIsAccountMenuOpen(false);
                    }}
                />
            )}
        </>
    );
};

export default MobileNavigation;