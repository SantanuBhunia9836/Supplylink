import React, { useState } from 'react';

const getStatusColor = (status) => {
    switch (status) {
        case 'Shipped': return 'bg-blue-100 text-blue-800';
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const ShopOrders = ({ allOrders }) => { // <-- Accept allOrders as a prop
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

    const filteredOrders = allOrders.filter(order => {
        if (activeTab === 'All') return true;
        return order.status === activeTab;
    });

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">My Orders</h3>
            
            {/* Filter Tabs */}
            <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                    ? 'border-blue-600 text-blue-700'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-4 text-sm font-medium text-gray-600">Order ID</th>
                            <th className="p-4 text-sm font-medium text-gray-600">Date</th>
                            <th className="p-4 text-sm font-medium text-gray-600">Seller</th>
                            <th className="p-4 text-sm font-medium text-gray-600">Items</th>
                            <th className="p-4 text-sm font-medium text-gray-600">Total</th>
                            <th className="p-4 text-sm font-medium text-gray-600">Status</th>
                            <th className="p-4 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? filteredOrders.map(order => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{order.id}</td>
                                <td className="p-4 text-gray-600">{order.date}</td>
                                <td className="p-4 text-gray-600">{order.seller}</td>
                                <td className="p-4 text-gray-600">{order.items}</td>
                                <td className="p-4 font-semibold text-gray-800">{order.total}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                     <button className="text-blue-600 font-semibold hover:underline">View Details</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="text-center p-8 text-gray-500">
                                    No orders found for this status.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShopOrders;