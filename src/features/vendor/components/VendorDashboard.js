import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { Home, ShoppingCart, Package, ArrowRight, UserCircle, LogOut, Store } from 'lucide-react';

// Child Page Components (now expect props)
import ShopOverview from "../../dashboard/pages/ShopOverview";
import CreateOrder from "../../dashboard/pages/CreateOrder";
import ShopOrders from "../../dashboard/pages/ShopOrders";

// --- MOCK DATA (Centralized in the main dashboard) ---
const allOrdersData = [
    { id: 'ORD-001', date: '2025-09-12', seller: 'Global Electronics', items: 2, total: '₹15,000', status: 'Shipped' },
    { id: 'ORD-002', date: '2025-09-11', seller: 'Crafty Goods Co.', items: 5, total: '₹3,200', status: 'Delivered' },
    { id: 'ORD-003', date: '2025-09-10', seller: 'Office Supplies Inc.', items: 10, total: '₹8,500', status: 'Pending' },
    { id: 'ORD-004', date: '2025-09-09', seller: 'Fresh Produce Direct', items: 8, total: '₹1,250', status: 'Delivered' },
    { id: 'ORD-005', date: '2025-09-08', seller: 'Global Electronics', items: 1, total: '₹45,000', status: 'Cancelled' },
    { id: 'ORD-006', date: '2025-09-07', seller: 'Office Supplies Inc.', items: 3, total: '₹2,100', status: 'Pending' },
    { id: 'ORD-007', date: '2025-09-06', seller: 'Global Electronics', items: 4, total: '₹22,000', status: 'Delivered' },
    { id: 'ORD-008', date: '2025-09-05', seller: 'Crafty Goods Co.', items: 1, total: '₹950', status: 'Pending' },
];

// --- Reusable Layout Components ---

const UserMenu = ({ user, onLogout }) => (
    <div className="relative group">
        <div className="flex items-center gap-3 cursor-pointer">
            <UserCircle className="w-8 h-8 text-gray-600" />
            <div>
                <p className="font-semibold text-sm text-gray-800">{user?.name || user?.email}</p>
                <p className="text-xs text-gray-500">Vendor Account</p>
            </div>
        </div>
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {/* --- NEW: Conditional link to Seller Dashboard --- */}
            {user?.is_seller && (
                <>
                    <Link
                        to="/seller-dashboard"
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        <Store className="w-4 h-4" />
                        Seller Dashboard
                    </Link>
                    <hr className="my-1" />
                </>
            )}
            <button
                onClick={onLogout}
                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
            >
                <LogOut className="w-4 h-4" />
                Logout
            </button>
        </div>
    </div>
);


const Header = ({ pageTitle, user, onLogout }) => (
    <header className="bg-white shadow-sm p-4 z-10 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
        {user && <UserMenu user={user} onLogout={onLogout} />}
    </header>
);

const Sidebar = ({ activePage, isSeller }) => {
    const navItems = [
        { id: 'overview', icon: Home, label: 'Overview', path: '/vendor-dashboard/overview' },
        { id: 'create-order', icon: ShoppingCart, label: 'Create Order', path: '/vendor-dashboard/create-order' },
        { id: 'orders', icon: Package, label: 'My Orders', path: '/vendor-dashboard/orders' },
    ];

    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
          <div className="p-6 text-2xl font-bold border-b border-gray-700">
            <Link to="/" className="flex items-center">
              <img
                src="/supplylink-logo.png"
                alt="SupplyLink Logo"
                className="h-8 w-auto mr-3 animate-slideIn"
              />
              <span>SupplyLink</span>
            </Link>
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
            {!isSeller && (
                <div className="p-4 border-t border-gray-700">
                    <Link to="/seller-registration" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg">
                        Become a Seller
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            )}
        </aside>
    );
};


const VendorDashboard = () => {
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    const stats = {
        totalOrders: allOrdersData.length,
        pendingOrders: allOrdersData.filter(o => o.status === 'Pending').length,
        totalSpend: allOrdersData.reduce((sum, order) => {
            const amount = parseFloat(order.total.replace(/[^0-9.-]+/g, ""));
            return sum + amount;
        }, 0)
    };
    const recentOrders = allOrdersData.slice(0, 4);

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
            <Sidebar activePage={getCurrentPage()} isSeller={user?.is_seller} />
            <div className="flex-1 flex flex-col">
                <Header pageTitle={getPageTitle()} user={user} onLogout={logout} />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <Routes>
                        <Route path="/" element={<ShopOverview stats={stats} recentOrders={recentOrders} />} />
                        <Route path="/overview" element={<ShopOverview stats={stats} recentOrders={recentOrders} />} />
                        <Route path="/create-order" element={<CreateOrder />} />
                        <Route path="/orders" element={<ShopOrders allOrders={allOrdersData} />} />
                        <Route path="*" element={<Navigate to="/vendor-dashboard/overview" />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default VendorDashboard;