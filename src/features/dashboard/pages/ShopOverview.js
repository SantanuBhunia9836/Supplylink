import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, DollarSign } from 'lucide-react';

const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-6">
        <div className={`rounded-full p-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

// Helper to assign colors based on status for the recent orders table
const getStatusColor = (status) => {
    switch (status) {
        case 'Shipped': return 'bg-blue-100 text-blue-800';
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const ShopOverview = ({ stats, recentOrders }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            {/* Statistic Cards - Now using props */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<ShoppingBag size={28} className="text-blue-600"/>} title="Total Orders Placed" value={stats.totalOrders} color="bg-blue-100" />
                <StatCard icon={<Clock size={28} className="text-yellow-600"/>} title="Pending Orders" value={stats.pendingOrders} color="bg-yellow-100" />
                <StatCard icon={<DollarSign size={28} className="text-green-600"/>} title="Total Spend" value={`₹${stats.totalSpend.toLocaleString('en-IN')}`} color="bg-green-100" />
            </div>

             {/* Recent Orders Table - Now using props */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-4 text-sm font-medium text-gray-600">Order ID</th>
                                <th className="p-4 text-sm font-medium text-gray-600">Seller</th>
                                <th className="p-4 text-sm font-medium text-gray-600">Date</th>
                                <th className="p-4 text-sm font-medium text-gray-600">Total</th>
                                <th className="p-4 text-sm font-medium text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-800">{order.id}</td>
                                    <td className="p-4 text-gray-600">{order.seller}</td>
                                    <td className="p-4 text-gray-600">{order.date}</td>
                                    <td className="p-4 font-semibold text-gray-800">{order.total}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShopOverview;