// src/pages/LandingPage.js
import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import LocationPanel from '../components/common/LocationPanel';
import SellerListing from '../components/shop/SellerListing';
import TestProfile from '../components/common/TestProfile';

// --- Reusable Icon Components ---
const StoreIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7.88V10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7.88"/></svg>
);
const TruckIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 18H3c0-1.1.9-2 2-2v4c-1.1 0-2-.9-2-2z"/><path d="M19 18h2c0-1.1-.9-2-2-2v4c1.1 0 2-.9 2-2z"/><path d="M10 18h4"/><path d="M17 18v-5.17c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2V18"/><path d="M7 11V7.17c0-1.1.9-2 2-2h4l4 4"/><path d="M19 12h-4"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>
);
const ZapIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const ShieldCheckIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);
const BarChartIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
);
const HomeIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const CompassIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
);
const UserPlusIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
);



// --- Login Popup Component ---
const LoginPopup = ({ isOpen, onClose, onLogin }) => {
    const [step, setStep] = useState('email'); // 'email' or 'password'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
        setError('');
        setStep('password');
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!password) {
            setError('Please enter your password');
            return;
        }
        setError('');
        
        try {
            const credentials = { username: email, password, role: 'vendor' };
            console.log('Login credentials being sent:', credentials);
            await onLogin(credentials);
        } catch (err) {
            console.error('Login error in popup:', err);
            setError(err.message);
        }
    };

    const handleSkip = () => {
        onClose();
        // You can add logic here for guest mode
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 login-popup">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl">&times;</button>
                
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to SupplyLink</h2>
                    <p className="text-gray-600">Sign in to your vendor account</p>
                </div>

                {step === 'email' ? (
                    <form onSubmit={handleEmailSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Enter your email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Continue
                        </button>
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="text-sm text-gray-500 hover:text-gray-700 underline"
                            >
                                Skip for now
                            </button>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        // Navigate to register page
                                        window.location.href = '/register';
                                    }}
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Enter your password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Login
                        </button>
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => setStep('email')}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                ← Back to email
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

// --- Account Dropdown Component ---
const AccountDropdown = ({ isOpen, onClose, onDashboard, onLogout, onBecomeSeller, onLocation }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48 z-50 account-dropdown">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDashboard();
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onBecomeSeller();
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Become a Seller
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onLocation();
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
            </button>
            <hr className="my-1" />
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onLogout();
                }}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
            </button>
        </div>
    );
};

// --- Guest Details Popup ---
const GuestModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const handleSubmit = () => {
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-in fade-in-0">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center transform transition-all" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl">&times;</button>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to SupplyLink!</h2>
                <p className="text-gray-500 mb-6">Click continue to explore our platform.</p>
                <button onClick={handleSubmit} className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">Continue</button>
            </div>
        </div>
    );
};


// --- Main Landing Page Component ---
const LandingPage = () => {
    const [isGuestModalOpen, setGuestModalOpen] = useState(false);
    const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [isLocationPanelOpen, setIsLocationPanelOpen] = useState(false);
    const navigate = useNavigate();
    const { login, user, logout } = useContext(AuthContext);
    const { location, getCurrentLocation, locationLoading, locationError } = useLocation();
    
    const homeRef = useRef(null);
    const howItWorksRef = useRef(null);
    const featuresRef = useRef(null);

    const scrollTo = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useEffect(() => {
        const hasVisited = sessionStorage.getItem('hasVisitedSupplyLink');
        if (!hasVisited) {
            setIsLoginPopupOpen(true);
            sessionStorage.setItem('hasVisitedSupplyLink', 'true');
        }
        
        // Request location access when user enters the site
        if (!location) {
            getCurrentLocation();
        }
    }, [location, getCurrentLocation]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isAccountDropdownOpen && !event.target.closest('.account-dropdown')) {
                setIsAccountDropdownOpen(false);
            }
        };

        if (isAccountDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAccountDropdownOpen]);



    // Helper function to get display name
    const getDisplayName = (user) => {
        if (!user) return 'Account';
        
        // Based on the vendor profile API structure from https://vend-sell.onrender.com/vendor/profile/
        // The API returns: { "id": 0, "name": "string", "email": "string", "phone": "string", ... }
        const possibleNames = [
            user.name,                    // Primary name field from vendor profile
            user.businessName,            // Fallback for business name
            user.full_name,              // Alternative name field
            user.first_name,             // First name if available
            `${user.first_name || ''} ${user.last_name || ''}`.trim(), // Combined first + last
            user.email?.split('@')[0],   // Email username as fallback
            user.username                // Username field
        ].filter(Boolean); // Remove empty/null values
        
        return possibleNames[0] || 'Account';
    };

    // Check if profile is still loading (no name field yet)
    const isProfileLoading = user && !user.name && !user.businessName && !user.email;

    const handleLogin = async (credentials) => {
        try {
            await login(credentials);
            // Add a smooth fade-out animation
            const popup = document.querySelector('.login-popup');
            if (popup) {
                popup.style.transition = 'opacity 0.5s ease-out';
                popup.style.opacity = '0';
                setTimeout(() => {
                    setIsLoginPopupOpen(false);
                    popup.style.opacity = '1';
                    popup.style.transition = '';
                }, 500);
            } else {
                setIsLoginPopupOpen(false);
            }
        } catch (error) {
            throw error;
        }
    };



    const displayName = getDisplayName(user);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20 md:pb-0">
            <GuestModal isOpen={isGuestModalOpen} onClose={() => setGuestModalOpen(false)} />
            <LoginPopup 
                isOpen={isLoginPopupOpen} 
                onClose={() => setIsLoginPopupOpen(false)}
                onLogin={handleLogin}
            />
            <LocationPanel 
                isOpen={isLocationPanelOpen} 
                onClose={() => setIsLocationPanelOpen(false)}
                onSuccess={(result) => {
                    console.log('Location saved:', result);
                }}
            />
            
            <nav className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-40">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer" onClick={() => scrollTo(homeRef)}>SupplyLink</h1>
                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button onClick={() => scrollTo(howItWorksRef)} className="font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105">How It Works</button>
                        <button onClick={() => scrollTo(featuresRef)} className="font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105">Features</button>
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                        {user ? (
                            <>
                                <button 
                                    onClick={() => setIsLocationPanelOpen(true)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 border border-gray-200 hover:border-blue-300"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Location</span>
                                </button>

                                <div className="relative account-dropdown">
                                <button 
                                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                    className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="font-medium">{isProfileLoading ? 'Loading...' : displayName}</span>
                                    <svg className={`w-4 h-4 transition-transform duration-300 ${isAccountDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <AccountDropdown
                                    isOpen={isAccountDropdownOpen}
                                    onClose={() => setIsAccountDropdownOpen(false)}
                                    onDashboard={() => {
                                        setIsAccountDropdownOpen(false);
                                        navigate('/dashboard');
                                    }}
                                    onLogout={() => {
                                        setIsAccountDropdownOpen(false);
                                        logout();
                                    }}
                                    onBecomeSeller={() => {
                                        setIsAccountDropdownOpen(false);
                                        navigate('/seller-registration');
                                    }}
                                    onLocation={() => {
                                        setIsAccountDropdownOpen(false);
                                        setIsLocationPanelOpen(true);
                                    }}
                                />
                            </div>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setIsLoginPopupOpen(true)} className="font-semibold px-6 py-3 rounded-xl text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105">Login</button>
                                <button onClick={() => navigate('/register')} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">Sign Up</button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <header ref={homeRef} className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                <div className="container mx-auto px-6 py-24 md:py-32 text-center relative z-10">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-in fade-in slide-in-from-top-4 duration-1000">Connecting Local Shops with Reliable Vendors.</h2>
                    <p className="text-lg md:text-xl text-gray-700 mt-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-6 duration-1000 delay-300 font-medium">Streamline your procurement. Find the best local suppliers for your daily needs, all in one place.</p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button onClick={() => setIsLoginPopupOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            Get Started
                        </button>
                        <button onClick={() => scrollTo(howItWorksRef)} className="border-2 border-blue-600 text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105">
                            Learn More
                        </button>
                    </div>
                </div>
            </header>

            {/* Seller Listing Section */}
            <SellerListing />

             {/* Test Profile Component */}
            <div className="container mx-auto px-6 py-8">
                <TestProfile />
            </div>

            <section ref={howItWorksRef} id="how-it-works" className="py-20 bg-gray-100">
                <div className="container mx-auto px-6">
                    <h3 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h3>
                    <div className="grid md:grid-cols-2 gap-10 md:gap-12">
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center mb-4"><div className="p-3 bg-blue-100 rounded-full mr-4"><StoreIcon className="w-8 h-8 text-blue-600" /></div><h4 className="text-2xl font-bold">For Shops & Restaurants</h4></div>
                            <ol className="list-decimal list-inside space-y-3 text-gray-600">
                                <li><strong>Post Your Needs:</strong> Quickly create a list of all the supplies you need.</li>
                                <li><strong>Get Matched:</strong> Our app finds the nearest, highest-rated vendors.</li>
                                <li><strong>Receive Your Order:</strong> A single delivery brings all your items to your doorstep.</li>
                            </ol>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center mb-4"><div className="p-3 bg-green-100 rounded-full mr-4"><TruckIcon className="w-8 h-8 text-green-600" /></div><h4 className="text-2xl font-bold">For Vendors & Suppliers</h4></div>
                            <ol className="list-decimal list-inside space-y-3 text-gray-600">
                                <li><strong>Receive Orders:</strong> Get notified about new orders from shops in your area.</li>
                                <li><strong>Accept & Prepare:</strong> Accept the orders you can fulfill and prepare them for pickup.</li>
                                <li><strong>Fulfill & Get Paid:</strong> Our system consolidates your deliveries into efficient routes.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={featuresRef} id="features" className="py-20 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <h3 className="text-3xl md:text-4xl font-bold mb-16">Why Choose SupplyLink?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        <div className="p-6"><ZapIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" /><h4 className="text-xl font-semibold mb-2">Efficiency Boost</h4><p className="text-gray-600">Save hours every day by replacing multiple phone calls with a single order on our app.</p></div>
                        <div className="p-6"><ShieldCheckIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" /><h4 className="text-xl font-semibold mb-2">Verified Suppliers</h4><p className="text-gray-600">We partner with trusted, high-quality local vendors to ensure you get the best products.</p></div>
                        <div className="p-6 sm:col-span-2 md:col-span-1"><BarChartIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" /><h4 className="text-xl font-semibold mb-2">Smart Analytics</h4><p className="text-gray-600">Track your spending and order history with our easy-to-use dashboard analytics.</p></div>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-800 text-white py-10">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; 2025 SupplyLink. All Rights Reserved.</p>
                    <p className="text-sm text-gray-400 mt-2">Made with ❤️ for the local businesses of Dankuni, West Bengal.</p>
                </div>
            </footer>

            {/* --- Mobile Bottom Navigation --- */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-lg z-40">
                <div className="flex justify-around items-center h-16">
                    {user ? (
                        <>
                            <button onClick={() => scrollTo(homeRef)} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                                <HomeIcon className="w-6 h-6 mb-1"/>
                                <span className="text-xs font-medium">Home</span>
                            </button>

                            <div className="relative">
                                <button 
                                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                    className="text-white bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg -mt-8 border-4 border-white"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </button>

                            </div>
                            <button onClick={() => scrollTo(howItWorksRef)} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                                <CompassIcon className="w-6 h-6 mb-1"/>
                                <span className="text-xs font-medium">How It Works</span>
                            </button>
                            <button onClick={() => setIsLocationPanelOpen(true)} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-xs font-medium">Location</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => scrollTo(homeRef)} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                                <HomeIcon className="w-6 h-6 mb-1"/>
                                <span className="text-xs font-medium">Home</span>
                            </button>

                            <button onClick={() => setIsLoginPopupOpen(true)} className="text-white bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg -mt-8 border-4 border-white">
                                <StoreIcon className="w-8 h-8"/>
                            </button>
                            <button onClick={() => scrollTo(howItWorksRef)} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                                <CompassIcon className="w-6 h-6 mb-1"/>
                                <span className="text-xs font-medium">How It Works</span>
                            </button>
                            <button onClick={() => navigate('/register')} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                                <UserPlusIcon className="w-6 h-6 mb-1"/>
                                <span className="text-xs font-medium">Sign Up</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            {/* Location Panel */}
            <LocationPanel 
                isOpen={isLocationPanelOpen}
                onClose={() => setIsLocationPanelOpen(false)}
                onSuccess={() => setIsLocationPanelOpen(false)}
            />
            
            {/* Login Popup */}
            <LoginPopup 
                isOpen={isLoginPopupOpen}
                onClose={() => setIsLoginPopupOpen(false)}
                onLogin={handleLogin}
            />
            
            {/* Guest Modal */}
            <GuestModal 
                isOpen={isGuestModalOpen}
                onClose={() => setGuestModalOpen(false)}
            />
        </div>
    );
};

export default LandingPage;
