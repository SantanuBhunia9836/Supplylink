// src/pages/dashboard/ShopOverview.js
import React from 'react';

const ShopOverview = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Shop Overview</h2>
            <p>Welcome back! Here you can see a summary of your recent activity.</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-100 p-6 rounded-lg">
                    <h3 className="text-blue-800 text-sm font-medium">Active Orders</h3>
                    <p className="text-3xl font-bold text-blue-600">3</p>
                </div>
                <div className="bg-yellow-100 p-6 rounded-lg">
                    <h3 className="text-yellow-800 text-sm font-medium">Pending Deliveries</h3>
                    <p className="text-3xl font-bold text-yellow-500">1</p>
                </div>
                <div className="bg-green-100 p-6 rounded-lg">
                    <h3 className="text-green-800 text-sm font-medium">Monthly Spend</h3>
                    <p className="text-3xl font-bold text-green-600">₹4,150</p>
                </div>
            </div>
        </div>
    );
};

export default ShopOverview;
