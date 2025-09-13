import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Home, ShoppingCart, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';


// Child Page Components
import ShopOverview from "../../dashboard/pages/ShopOverview"; // Corrected path
import CreateOrder from "../../dashboard/pages/CreateOrder"; // Corrected path
import ShopOrders from "../../dashboard/pages/ShopOrders"; // Corrected path

// --- Reusable Layout Components ---

const Header = ({ pageTitle }) => (
    <header className="bg-white shadow-sm p-4 z-10">
        <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
    </header>
);

const Sidebar = ({ activePage }) => {
    const navItems = [
        { id: 'overview', icon: Home, label: 'Overview', path: '/dashboard/overview' },
        { id: 'create-order', icon: ShoppingCart, label: 'Create Order', path: '/dashboard/create-order' },
        { id: 'orders', icon: Package, label: 'My Orders', path: '/dashboard/orders' },
    ];

    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-6 text-2xl font-bold border-b border-gray-700">
                SupplyLink
            </div>
            <nav className="flex-1 px-4 py-4">
                {navItems.map(item => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`flex items-center gap-4 px-4 py-3 my-1 rounded-lg transition-colors ${
                            activePage === item.id
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                 <Link to="/seller-registration" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg">
                    Become a Seller
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </aside>
    );
};


/**
 * This component is the dashboard for VENDORS who are NOT sellers.
 * It manages its own layout, sidebar, header, and nested routes.
 */
const VendorDashboard = () => {
    const location = useLocation();

    const getCurrentPage = () => {
        const path = location.pathname;
        if (path.includes("/create-order")) return "create-order";
        if (path.includes("/orders")) return "orders";
        return "overview";
    };

    const getPageTitle = () => {
        switch (getCurrentPage()) {
            case "create-order": return "Create New Order";
            case "orders": return "My Orders";
            default: return "Shop Overview";
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar activePage={getCurrentPage()} />
            <div className="flex-1 flex flex-col">
                <Header pageTitle={getPageTitle()} />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <Routes>
                        <Route path="/" element={<ShopOverview />} />
                        <Route path="/overview" element={<ShopOverview />} />
                        <Route path="/create-order" element={<CreateOrder />} />
                        <Route path="/orders" element={<ShopOrders />} />
                        <Route path="*" element={<Navigate to="/dashboard/overview" />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default VendorDashboard;
