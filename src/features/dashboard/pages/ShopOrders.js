// src/pages/dashboard/ShopOrders.js
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const ShopOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD-001',
          date: '2024-01-15',
          status: 'completed',
          total: 1250,
          items: ['Onions', 'Tomatoes', 'Chicken Breast'],
          vendor: 'Fresh Foods Ltd'
        },
        {
          id: 'ORD-002',
          date: '2024-01-14',
          status: 'out_for_delivery',
          total: 800,
          items: ['Rice', 'Oil', 'Spices'],
          vendor: 'Grocery Mart'
        },
        {
          id: 'ORD-003',
          date: '2024-01-13',
          status: 'pending',
          total: 2100,
          items: ['Vegetables', 'Fruits', 'Dairy'],
          vendor: 'Local Market'
        },
        {
          id: 'ORD-004',
          date: '2024-01-12',
          status: 'completed',
          total: 950,
          items: ['Bread', 'Milk', 'Eggs'],
          vendor: 'Daily Essentials'
        }
      ];
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (isLoading) return <LoadingSpinner text="Loading orders..." />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Orders</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('out_for_delivery')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'out_for_delivery' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              In Transit
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">No orders match your current filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                    <p className="text-sm text-gray-500">Ordered on {new Date(order.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Vendor: {order.vendor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">₹{order.total}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Items:</p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopOrders;
