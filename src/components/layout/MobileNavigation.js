// src/components/layout/MobileNavigation.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ProfileCompletionIndicator from '../common/ProfileCompletionIndicator';

// --- Icon Components ---
const HomeIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const UserPlusIcon = (props) => <svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>;
const StoreIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7.88V10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7.88" /></svg>;


const MobileNavigation = ({ onLoginClick, onLocationClick }) => {
    const { user, authLoading, profileCompletion } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-lg z-40">
            <div className="flex justify-around items-center h-16">
                {authLoading ? (
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-gray-500">Checking...</span>
                    </div>
                ) : user ? (
                    <>
                        <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600">
                            <HomeIcon className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">Home</span>
                        </button>

                        <div className="relative">
                            <button onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)} className="text-white bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg -mt-8 border-4 border-white">
                                <ProfileCompletionIndicator 
                                    profileCompletion={profileCompletion}
                                    size={64}
                                    strokeWidth={3}
                                    showPercentage={false}
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </ProfileCompletionIndicator>
                            </button>
                        </div>

                        <button onClick={onLocationClick} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600">
                            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className="text-xs font-medium">Location</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600">
                            <HomeIcon className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">Home</span>
                        </button>

                        <button onClick={onLoginClick} className="text-white bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg -mt-8 border-4 border-white">
                            <StoreIcon className="w-8 h-8" />
                        </button>

                        <button onClick={() => navigate("/register")} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600">
                            <UserPlusIcon className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">Sign Up</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MobileNavigation;
