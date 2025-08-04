// src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// --- Reusable Icon Components ---
const StoreIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7.88V10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7.88"/></svg>
);
const TruckIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 18H3c0-1.1.9-2 2-2v4c-1.1 0-2-.9-2-2z"/><path d="M19 18h2c0-1.1-.9-2-2-2v4c1.1 0 2-.9 2-2z"/><path d="M10 18h4"/><path d="M17 18v-5.17c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2V18"/><path d="M7 11V7.17c0-1.1.9-2 2-2h4l4 4"/><path d="M19 12h-4"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>
);
const BriefcaseIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);


const LoginPage = () => {
    const { login, loading, error } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'vendor', // Only vendor role now
    });
    const [validationErrors, setValidationErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) {
            newErrors.username = 'Email is required.';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required.';
        }
        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await login(formData);
                // Navigation will be handled by the App component's routing logic
            } catch (err) {
                // Error is handled by the AuthContext, but we can log it here if needed
                console.error("Login attempt failed on page:", err);
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

                    {/* Password Security Notice */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h4 className="text-sm font-medium text-blue-800 mb-1">Browser Security Notice</h4>
                                <p className="text-xs text-blue-700">
                                    If your browser shows a warning about the password being found in a database, 
                                    this is a security feature to protect you. Your password may have been compromised 
                                    in a data breach. Consider changing your password for better security.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" id="username" name="username" value={formData.username} onChange={handleInputChange} placeholder="user@example.com" className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${validationErrors.username ? 'border-red-500' : 'border-gray-300'}`} />
                                {validationErrors.username && <p className="mt-1 text-xs text-red-600">{validationErrors.username}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${validationErrors.password ? 'border-red-500' : 'border-gray-300'}`} />
                                {validationErrors.password && <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>}
                            </div>
                            
                            {error && <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md">{error}</p>}

                            <div>
                                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                                    {loading ? 'Signing in...' : 'Sign In'}
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
