import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Fallback if the page is accessed directly without order state
    const { orderDetails, items, total } = location.state || { 
        orderDetails: { name: 'Valued Customer', address: 'Your saved address' }, 
        items: [], 
        total: 0 
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-2xl w-full text-center transform hover:scale-105 transition-transform duration-500">
                <div className="mx-auto w-24 h-24 flex items-center justify-center bg-green-100 rounded-full">
                    <svg className="w-16 h-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-gray-800">Thank You!</h1>
                <p className="mt-2 text-lg text-gray-600">Your order has been placed successfully.</p>
                
                <div className="text-left bg-gray-50 p-6 rounded-lg mt-8 border">
                    <h2 className="font-bold text-xl mb-4">Order Summary</h2>
                    <p><strong>Order Number:</strong> #{(Math.random() * 1000000).toFixed(0)}</p>
                    <p><strong>Shipping to:</strong> {orderDetails.name}, {orderDetails.address}</p>
                    <p><strong>Total Paid:</strong> <span className="font-bold text-green-700">₹{total.toFixed(2)}</span></p>
                </div>

                <button
                    onClick={() => navigate("/")}
                    className="mt-10 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default OrderSuccessPage;