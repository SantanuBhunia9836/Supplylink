// src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
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


const LoginPage = ({ onShowRegister }) => {
    const { login, loading, error } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'shop', // Default role
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid.';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            login(formData); // Pass the whole form data object to the login function
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex">
                {/* Form Panel */}
                <div className="w-full lg:w-1/2 p-8 md:p-12">
                    <h1 className="text-2xl font-bold text-blue-600 mb-8">SupplyLink</h1>
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
                    <p className="text-gray-500 mt-2 mb-8">Please sign in to your account.</p>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="space-y-5">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">I am a...</label>
                                <div className="flex w-full rounded-md shadow-sm">
                                    <button type="button" onClick={() => setFormData({...formData, role: 'shop'})} className={`flex-1 inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-l-md transition-colors ${formData.role === 'shop' ? 'bg-blue-600 text-white border-blue-600 z-10' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                        <StoreIcon className="w-5 h-5 mr-2"/> Shop
                                    </button>
                                    <button type="button" onClick={() => setFormData({...formData, role: 'vendor'})} className={`-ml-px flex-1 inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-r-md transition-colors ${formData.role === 'vendor' ? 'bg-green-600 text-white border-green-600 z-10' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                        <TruckIcon className="w-5 h-5 mr-2"/> Vendor
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'}`} />
                                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                            </div>
                            
                            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

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
                            <button onClick={onShowRegister} className="font-medium text-blue-600 hover:underline">
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
                {/* Decorative Panel */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-green-500 p-12 text-white flex-col justify-center items-center text-center">
                    <BriefcaseIcon className="w-20 h-20 mb-6"/>
                    <h2 className="text-4xl font-bold mb-3">Powering Local Commerce</h2>
                    <p className="text-blue-100 text-lg">The all-in-one platform for your business supplies.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
