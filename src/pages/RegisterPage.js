// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Reusable Icon Components ---
const TruckIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 18H3c0-1.1.9-2 2-2v4c-1.1 0-2-.9-2-2z"/><path d="M19 18h2c0-1.1-.9-2-2-2v4c1.1 0 2-.9 2-2z"/><path d="M10 18h4"/><path d="M17 18v-5.17c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2V18"/><path d="M7 11V7.17c0-1.1.9-2 2-2h4l4 4"/><path d="M19 12h-4"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>
);

const ArrowLeftIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);

// --- Password Strength Checker ---
const checkPasswordStrength = (password) => {
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    if (score <= 2) return { strength: 'weak', color: 'text-red-500', bgColor: 'bg-red-50' };
    if (score <= 3) return { strength: 'fair', color: 'text-yellow-500', bgColor: 'bg-yellow-50' };
    if (score <= 4) return { strength: 'good', color: 'text-blue-500', bgColor: 'bg-blue-50' };
    return { strength: 'strong', color: 'text-green-500', bgColor: 'bg-green-50' };
};

// --- Form Input Component ---
const Input = ({ id, label, type = 'text', placeholder, value, onChange, error, showPasswordStrength = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    const passwordStrength = showPasswordStrength && value ? checkPasswordStrength(value) : null;
    
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                <input
                    type={showPasswordStrength && showPassword ? 'text' : type}
                    id={id}
                    name={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${error ? 'border-red-500' : 'border-gray-300'} ${showPasswordStrength ? 'pr-10' : ''}`}
                />
                {showPasswordStrength && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {showPassword ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            ) : (
                                <>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </>
                            )}
                        </svg>
                    </button>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            {passwordStrength && (
                <div className={`mt-2 p-2 rounded-md ${passwordStrength.bgColor}`}>
                    <p className={`text-xs font-medium ${passwordStrength.color}`}>
                        Password strength: {passwordStrength.strength}
                    </p>
                    <div className="mt-1 flex space-x-1">
                        {['length', 'lowercase', 'uppercase', 'numbers', 'special'].map((check) => (
                            <div
                                key={check}
                                className={`w-2 h-2 rounded-full ${
                                    checkPasswordStrength(value)[check] ? 'bg-green-400' : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
// --- API Registration Function ---
const apiVendorRegister = async (registrationData) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://vend-sell.onrender.com';
    const endpoint = `${API_BASE_URL}/vendor/create`;
    
    const payload = {
        name: String(registrationData.name),
        email: String(registrationData.email),
        password: String(registrationData.password),
        phone: String(registrationData.phone)
    };
    
    console.log('Registration payload:', payload);
    
    try {
        const response = await fetch(endpoint, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(payload) 
        });
        
        console.log('Registration response status:', response.status);
        
        let responseData;
        try {
            responseData = await response.json();
            console.log('Registration response data:', responseData);
        } catch (parseError) {
            console.log('Failed to parse response as JSON');
            responseData = await response.text();
            console.log('Response as text:', responseData);
        }
        
        if (!response.ok) {
            let errorMessage = 'Registration failed';
            if (responseData) {
                if (typeof responseData === 'string') {
                    errorMessage = responseData;
                } else if (typeof responseData === 'object') {
                    if (responseData.message) {
                        errorMessage = responseData.message;
                    } else if (responseData.error) {
                        errorMessage = responseData.error;
                    } else if (responseData.detail) {
                        errorMessage = responseData.detail;
                    } else {
                        const errorValues = Object.values(responseData).flat();
                        if (errorValues.length > 0) {
                            errorMessage = errorValues.join(', ');
                        }
                    }
                }
            }
            throw new Error(errorMessage);
        }
        
        return responseData;
    } catch (error) {
        if (error.name === 'TypeError') {
            throw new Error('Network error. Please check your connection.');
        }
        throw error;
    }
};

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', // Business name
        email: '',
        password: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
             setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Business name is required.';
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid.';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters.';
        } else {
            const strength = checkPasswordStrength(formData.password);
            if (strength.strength === 'weak') {
                newErrors.password = 'Please choose a stronger password. Consider using uppercase, lowercase, numbers, and special characters.';
            }
        }
        if (!formData.phone) newErrors.phone = 'Phone number is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            setErrors({});
            try {
                const result = await apiVendorRegister(formData);
                console.log("Registration successful!", result);
                alert("Registration complete! You can now log in.");
                navigate('/login'); // Redirect to login page on success
            } catch (error) {
                console.error("Registration error:", error);
                setErrors({ form: error.message }); // Display form-wide error
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white p-8 rounded-xl shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <TruckIcon className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Join SupplyLink</h2>
                        <p className="text-gray-500 mt-2">Create your vendor account</p>
                    </div>
                    
                    {/* Password Security Notice */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h4 className="text-sm font-medium text-blue-800 mb-1">Password Security</h4>
                                <p className="text-xs text-blue-700">
                                    If your browser shows a warning about the password being found in a database, 
                                    this is a security feature to protect you. Consider using a unique, strong password 
                                    that you haven't used elsewhere.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Input 
                                id="name" 
                                label="Business Name" 
                                placeholder="e.g., Fresh Foods Ltd" 
                                value={formData.name} 
                                onChange={handleInputChange} 
                                error={errors.name} 
                            />
                            <Input 
                                id="email" 
                                type="email" 
                                label="Email Address" 
                                placeholder="you@example.com" 
                                value={formData.email} 
                                onChange={handleInputChange} 
                                error={errors.email} 
                            />
                            <Input 
                                id="password" 
                                type="password" 
                                label="Password" 
                                placeholder="••••••••" 
                                value={formData.password} 
                                onChange={handleInputChange} 
                                error={errors.password}
                                showPasswordStrength={true}
                            />
                            <Input 
                                id="phone" 
                                type="tel" 
                                label="Phone Number" 
                                placeholder="+91 12345 67890" 
                                value={formData.phone} 
                                onChange={handleInputChange} 
                                error={errors.phone} 
                            />
                        </div>
                        
                        {errors.form && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 text-center">{errors.form}</p>
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Vendor Account'}
                        </button>
                    </form>
                </div>
                
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button onClick={() => navigate('/login')} className="font-medium text-blue-600 hover:underline">
                            Log in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
