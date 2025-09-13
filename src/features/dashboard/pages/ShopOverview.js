import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Clock, DollarSign } from 'lucide-react';

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


const recentOrders = [
    { id: 'ORD-001', seller: 'Global Electronics', date: '2025-09-12', total: '₹15,000', status: 'Shipped', statusColor: 'bg-blue-100 text-blue-800' },
    { id: 'ORD-002', seller: 'Crafty Goods Co.', date: '2025-09-11', total: '₹3,200', status: 'Delivered', statusColor: 'bg-green-100 text-green-800' },
    { id: 'ORD-003', seller: 'Office Supplies Inc.', date: '2025-09-10', total: '₹8,500', status: 'Pending', statusColor: 'bg-yellow-100 text-yellow-800' },
    { id: 'ORD-004', seller: 'Fresh Produce Direct', date: '2025-09-09', total: '₹1,250', status: 'Delivered', statusColor: 'bg-green-100 text-green-800' },
];


const ShopOverview = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            {/* Upgrade Banner */}
            <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Unlock Your Potential: Become a Seller!</h2>
                    <p className="text-blue-100 max-w-2xl">
                        Set up your own shop, list your products, and start reaching thousands of new customers today.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/seller-registration')}
                    className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105 whitespace-nowrap flex items-center gap-2"
                >
                    Get Started <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {/* Statistic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<ShoppingBag size={28} className="text-blue-600"/>} title="Total Orders Placed" value="42" color="bg-blue-100" />
                <StatCard icon={<Clock size={28} className="text-yellow-600"/>} title="Pending Orders" value="3" color="bg-yellow-100" />
                <StatCard icon={<DollarSign size={28} className="text-green-600"/>} title="Total Spend" value="₹2,45,800" color="bg-green-100" />
            </div>

             {/* Recent Orders Table */}
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
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${order.statusColor}`}>
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
