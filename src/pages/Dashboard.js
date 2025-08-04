// src/pages/Dashboard.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

// Import the page components
import ShopOverview from './dashboard/ShopOverview';
import CreateOrder from './dashboard/CreateOrder';
import ShopOrders from './dashboard/ShopOrders';

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Get the current page from the URL path
    const getCurrentPage = () => {
        const path = location.pathname;
        if (path.includes('/create-order')) return 'create-order';
        if (path.includes('/orders')) return 'orders';
        return 'overview';
    };

    const currentPage = getCurrentPage();

    const renderPage = () => {
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
        if (user.role === 'vendor') {
            return (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">Vendor Dashboard</h2>
                    <p>Vendor dashboard features coming soon!</p>
                </div>
            );
        }
        return <Navigate to="/" />;
    };
    
    const getPageTitle = () => {
        switch (currentPage) {
            case 'create-order': return 'Create Order';
            case 'orders': return 'My Orders';
            default: return 'Overview';
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar activePage={currentPage} />
            <div className="flex-1 flex flex-col">
                <Header pageTitle={getPageTitle()} />
                <main className="flex-1 overflow-y-auto p-6">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
