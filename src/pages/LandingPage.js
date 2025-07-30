// src/pages/LandingPage.js
import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';

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
// New Icons for Categories
const CarrotIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 21.5c1.4-1.4 2.1-3.3 2-5.2s-1-3.8-2.5-5.3c-1.5-1.5-3.3-2.1-5.2-2s-3.8 1-5.3 2.5c-1.4 1.4-2.1 3.3-2 5.2s1 3.8 2.5 5.3c1.6 1.5 3.4 2 5.3 2s3.8-.5 5.3-2Z"/><path d="M16 16s-2-2-4-4 2-4 4-4 4 2 4 4-2 4-4 4Z"/><path d="m22 2-1.5 1.5"/></svg>;
const DrumstickIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15.42 8.42 12 12l-3.42-3.42a5 5 0 1 1 7.07-7.07l-1.59 1.59a2 2 0 0 0 0 2.82l.01.01a2 2 0 0 0 2.82 0L19 4.41a5 5 0 1 1-7.07 7.07l-3.42-3.42"/><path d="m12 12-1.41 1.41a2 2 0 0 0 0 2.83l1.41 1.41a2 2 0 0 0 2.83 0l1.41-1.41"/><path d="M12 12a2 2 0 0 0 2.83 0l1.41-1.41a2 2 0 0 0 0-2.83L14.83 6.34"/></svg>;
const ShoppingBasketIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 11-1 9"/><path d="m9 11 1 9"/><path d="M2 7h20"/><path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/><path d="M12 11v10"/></svg>;
const ShirtIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>;
const SmartphoneIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>;
const GridIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 12h18"/><path d="M12 3v18"/></svg>;


// --- Guest Details Popup ---
const GuestModal = ({ isOpen, onClose }) => {
    const { setGuest } = useContext(AuthContext);
    const [name, setName] = useState('');
    if (!isOpen) return null;
    const handleSubmit = () => {
        if (name) setGuest({ name });
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-in fade-in-0">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center transform transition-all" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl">&times;</button>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to SupplyLink!</h2>
                <p className="text-gray-500 mb-6">Enter your name to personalize your experience, or skip ahead.</p>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name (optional)" className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg shadow-inner placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                <button onClick={handleSubmit} className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">Continue</button>
            </div>
        </div>
    );
};


// --- Main Landing Page Component ---
const LandingPage = ({ onShowLogin, onShowRegister }) => {
    const [isGuestModalOpen, setGuestModalOpen] = useState(false);
    
    const homeRef = useRef(null);
    const categoriesRef = useRef(null);
    const howItWorksRef = useRef(null);
    const featuresRef = useRef(null);

    const scrollTo = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useEffect(() => {
        const hasVisited = sessionStorage.getItem('hasVisitedSupplyLink');
        if (!hasVisited) {
            setGuestModalOpen(true);
            sessionStorage.setItem('hasVisitedSupplyLink', 'true');
        }
    }, []);

    const categoryCards = [
        { icon: <CarrotIcon className="w-12 h-12"/>, title: "Vegetables", color: "text-green-500" },
        { icon: <DrumstickIcon className="w-12 h-12"/>, title: "Meat & Poultry", color: "text-red-500" },
        { icon: <ShoppingBasketIcon className="w-12 h-12"/>, title: "Groceries", color: "text-yellow-500" },
        { icon: <ShirtIcon className="w-12 h-12"/>, title: "Apparel", color: "text-purple-500" },
        { icon: <SmartphoneIcon className="w-12 h-12"/>, title: "Electronics", color: "text-sky-500" },
        { icon: <ZapIcon className="w-12 h-12"/>, title: "And More!", color: "text-gray-500" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20 md:pb-0">
            <GuestModal isOpen={isGuestModalOpen} onClose={() => setGuestModalOpen(false)} />
            
            <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => scrollTo(homeRef)}>SupplyLink</h1>
                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button onClick={() => scrollTo(categoriesRef)} className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">Categories</button>
                        <button onClick={() => scrollTo(howItWorksRef)} className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">How It Works</button>
                        <button onClick={() => scrollTo(featuresRef)} className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">Features</button>
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                        <button onClick={onShowLogin} className="font-semibold px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">Login</button>
                        <button onClick={onShowRegister} className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">Sign Up</button>
                    </div>
                </div>
            </nav>

            <header ref={homeRef} className="relative bg-gradient-to-b from-blue-50 to-white overflow-hidden">
                <div className="container mx-auto px-6 py-24 md:py-32 text-center">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 animate-in fade-in slide-in-from-top-4 duration-1000">Connecting Local Shops with Reliable Vendors.</h2>
                    <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-6 duration-1000 delay-300">Streamline your procurement. Find the best local suppliers for your daily needs, all in one place.</p>
                    <button onClick={onShowRegister} className="mt-10 bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold text-lg px-10 py-4 rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-in fade-in zoom-in-95 duration-1000 delay-500">Create a Free Account</button>
                </div>
            </header>

            <section ref={categoriesRef} id="categories" className="py-20 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <h3 className="text-3xl md:text-4xl font-bold mb-16">Browse Categories</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                        {categoryCards.map((card, index) => (
                            <div key={index} className={`bg-gray-100 p-6 rounded-xl flex flex-col items-center justify-center space-y-3 transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${card.color}`}>
                                {card.icon}
                                <span className="font-semibold text-gray-800">{card.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
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
                    <button onClick={() => scrollTo(homeRef)} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                        <HomeIcon className="w-6 h-6 mb-1"/>
                        <span className="text-xs font-medium">Home</span>
                    </button>
                    <button onClick={() => scrollTo(categoriesRef)} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                        <GridIcon className="w-6 h-6 mb-1"/>
                        <span className="text-xs font-medium">Browse</span>
                    </button>
                    <button onClick={onShowLogin} className="text-white bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg -mt-8 border-4 border-white">
                        <StoreIcon className="w-8 h-8"/>
                    </button>
                    <button onClick={() => scrollTo(howItWorksRef)} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                        <CompassIcon className="w-6 h-6 mb-1"/>
                        <span className="text-xs font-medium">How It Works</span>
                    </button>
                    <button onClick={onShowRegister} className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                        <UserPlusIcon className="w-6 h-6 mb-1"/>
                        <span className="text-xs font-medium">Sign Up</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
