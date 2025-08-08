import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

// Import the page components
import ShopOverview from './dashboard/ShopOverview';
import CreateOrder from './dashboard/CreateOrder';
import ShopOrders from './dashboard/ShopOrders';
// --- FIX: Import the new SellerDashboard ---
import SellerDashboard from './dashboard/seller/SellerDashboard';


const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // This logic is for the 'shop' role sidebar. It's not used by the seller view.
    const getCurrentPage = () => {
        const path = location.pathname;
        if (path.includes('/create-order')) return 'create-order';
        if (path.includes('/orders')) return 'orders';
        return 'overview';
    };

    const currentPage = getCurrentPage();

    const renderPage = () => {
        // Prioritize the seller view
        if (user.is_seller) {
            // The new SellerDashboard handles its own internal state and layout
            return <SellerDashboard />;
        }

        // Fallback for the 'shop' role
        if (user.role === 'shop') {
            return (
                <Routes>
                    <Route path="/" element={<ShopOverview />} />
                    <Route path="/overview" element={<ShopOverview />} />
                    <Route path="/create-order" element={<CreateOrder />} />
                    <Route path="/orders" element={<ShopOrders />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            );
        }
        
        // Fallback if role is not recognized
        return <Navigate to="/" />;
    };
    
    const getPageTitle = () => {
        if (user.is_seller) return 'Seller Dashboard';
        switch (currentPage) {
            case 'create-order': return 'Create Order';
            case 'orders': return 'My Orders';
            default: return 'Overview';
        }
    };

    // --- FIX: Conditionally set padding on the main content area ---
    // The seller dashboard has its own padding, so we remove the parent's padding for a correct fit.
    const mainContentClass = user.is_seller ? "flex-1 overflow-y-auto" : "flex-1 overflow-y-auto p-6";


    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Conditionally render sidebar. It will be hidden for sellers. */}
            {!user.is_seller && <Sidebar activePage={currentPage} />}
            
            <div className="flex-1 flex flex-col">
                <Header pageTitle={getPageTitle()} />
                <main className={mainContentClass}>
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
