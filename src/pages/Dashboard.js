// src/pages/Dashboard.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Import the page components
import ShopOverview from './dashboard/ShopOverview';
import CreateOrder from './dashboard/CreateOrder';
import ShopOrders from './dashboard/ShopOrders';

// --- ICONS ---
const HomeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const PlusCircleIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
);
const ShoppingCartIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
);
const UserIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const LogOutIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);
const BellIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
);

// --- LAYOUT COMPONENTS ---
const Sidebar = ({ activePage, setPage }) => {
    const { user } = useContext(AuthContext);
    const navItems = {
        shop: [
            { id: 'overview', icon: <HomeIcon className="w-5 h-5"/>, label: 'Overview' },
            { id: 'create-order', icon: <PlusCircleIcon className="w-5 h-5"/>, label: 'Create Order' },
            { id: 'orders', icon: <ShoppingCartIcon className="w-5 h-5"/>, label: 'My Orders' },
        ],
        vendor: [ /* Add vendor items here later */ ]
    };
    const currentNavItems = user ? navItems[user.role] : [];

    return (
        <div className="w-64 bg-gray-800 text-white flex-col hidden md:flex">
            <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">SupplyLink</div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {currentNavItems.map(item => (
                    <a key={item.id} href="#" onClick={(e) => { e.preventDefault(); setPage(item.id); }}
                        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${activePage === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                        {item.icon}<span>{item.label}</span>
                    </a>
                ))}
            </nav>
        </div>
    );
};

const Header = ({ pageTitle }) => {
    const { user, logout } = useContext(AuthContext);
    const [profileOpen, setProfileOpen] = useState(false);
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
            <div className="flex items-center space-x-6">
                <button className="relative text-gray-500 hover:text-gray-700"><BellIcon className="w-6 h-6"/><span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span></button>
                <div className="relative">
                    <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-2">
                        <UserIcon className="w-8 h-8 text-gray-600 bg-gray-200 rounded-full p-1"/>
                        <span className="text-gray-700 font-medium hidden sm:block">{user?.name}</span>
                    </button>
                    {profileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10">
                            <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <LogOutIcon className="w-4 h-4"/><span>Logout</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
    const [page, setPage] = useState('overview');
    const { user } = useContext(AuthContext);

    const renderPage = () => {
        if (user.role === 'shop') {
            switch (page) {
                case 'overview': return <ShopOverview />;
                case 'create-order': return <CreateOrder />;
                case 'orders': return <ShopOrders />;
                default: return <ShopOverview />;
            }
        }
        if (user.role === 'vendor') {
            return <div>Vendor Dashboard Overview</div>;
        }
    };
    
    const pageTitle = page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ');

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar activePage={page} setPage={setPage} />
            <div className="flex-1 flex flex-col">
                <Header pageTitle={pageTitle} />
                <main className="flex-1 overflow-y-auto p-6">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
