// src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { testApiConnection } from '../services/api';
import { toast } from 'react-toastify';

// --- Reusable Icon Components ---
const TruckIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 18H3c0-1.1.9-2 2-2v4c-1.1 0-2-.9-2-2z"/><path d="M19 18h2c0-1.1-.9-2-2-2v4c1.1 0 2-.9 2-2z"/><path d="M10 18h4"/><path d="M17 18v-5.17c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2V18"/><path d="M7 11V7.17c0-1.1.9-2 2-2h4l4 4"/><path d="M19 12h-4"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>
);

// --- Modern Loading Spinner ---
const LoadingSpinner = () => (
    <>
        <style>{`
            @keyframes spinner-rotation {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
        <div 
            className="animate-spin" 
            style={{
                width: '24px',
                height: '24px',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spinner-rotation 1s linear infinite'
            }}
        ></div>
    </>
);


const LoginPage = () => {
    const { login, loading, authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'vendor',
    });
    const [validationErrors, setValidationErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Email is required.';
        if (!formData.password) newErrors.password = 'Password is required.';
        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await login(formData);
                toast.success("Login successful! Redirecting...");
                // The navigation will be handled by the AuthContext state change
            } catch (err) {
                console.error("Login attempt failed on page:", err);
                toast.error(err.message || "An unexpected error occurred during login.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex">
                {/* Form Panel */}
                <div className="w-full lg:w-1/2 p-8 md:p-12">
                    <h1 className="text-2xl font-bold text-blue-600 mb-8">SupplyLink</h1>
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
                    <p className="text-gray-500 mt-2 mb-8">Sign in to your vendor account.</p>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" id="username" name="username" value={formData.username} onChange={handleInputChange} placeholder="user@example.com" className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm ${validationErrors.username ? 'border-red-500' : 'border-gray-300'}`} />
                                {validationErrors.username && <p className="mt-1 text-xs text-red-600">{validationErrors.username}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm ${validationErrors.password ? 'border-red-500' : 'border-gray-300'}`} />
                                {validationErrors.password && <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>}
                            </div>
                            
                            {/* The inline error message is removed in favor of toasts */}

                            <div>
                                <button 
                                    type="submit" 
                                    disabled={loading || authLoading} 
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                                >
                                    {loading ? <LoadingSpinner /> : (authLoading ? 'Initializing...' : 'Sign In')}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button onClick={() => navigate('/register')} className="font-medium text-blue-600 hover:underline">
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
                {/* Decorative Panel */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-green-500 p-12 text-white flex-col justify-center items-center text-center">
                    <TruckIcon className="w-20 h-20 mb-6"/>
                    <h2 className="text-4xl font-bold mb-3">Vendor Portal</h2>
                    <p className="text-blue-100 text-lg">Manage your deliveries and orders efficiently.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
