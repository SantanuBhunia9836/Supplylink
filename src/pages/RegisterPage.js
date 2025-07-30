// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { apiRegister } from '../services/api'; // Import the new API function

// --- Reusable Icon Components ---
const StoreIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7.88V10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7.88"/></svg>
);
const TruckIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 18H3c0-1.1.9-2 2-2v4c-1.1 0-2-.9-2-2z"/><path d="M19 18h2c0-1.1-.9-2-2-2v4c1.1 0 2-.9 2-2z"/><path d="M10 18h4"/><path d="M17 18v-5.17c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2V18"/><path d="M7 11V7.17c0-1.1.9-2 2-2h4l4 4"/><path d="M19 12h-4"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>
);
const ArrowLeftIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);

// --- Form Input Component ---
const Input = ({ id, label, type = 'text', placeholder, value, onChange, error }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const RegisterPage = ({ onShowLogin }) => {
    const [step, setStep] = useState(1);
    const [userRole, setUserRole] = useState(null);
    const [formData, setFormData] = useState({
        businessName: '',
        email: '',
        password: '',
        address: '',
        categories: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false); // For loading state

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
             setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateStep = () => {
        const newErrors = {};
        if (step === 2) {
            if (!formData.businessName) newErrors.businessName = 'Business name is required.';
            if (!formData.email) {
                newErrors.email = 'Email is required.';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Email address is invalid.';
            }
            if (!formData.password) {
                newErrors.password = 'Password is required.';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters.';
            }
        }
        if (step === 3) {
            if (userRole === 'shop' && !formData.address) newErrors.address = 'Shop address is required.';
            if (userRole === 'vendor' && !formData.categories) newErrors.categories = 'Product categories are required.';
            if (!formData.phone) newErrors.phone = 'Phone number is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const nextStep = () => {
        if (validateStep()) {
            setStep(prev => prev + 1);
        }
    };
    const prevStep = () => setStep(prev => prev - 1);

    const handleRoleSelect = (role) => {
        setUserRole(role);
        setStep(2);
    };
    
    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        if (validateStep()) {
            setIsSubmitting(true);
            setErrors({}); // Clear previous errors
            try {
                const result = await apiRegister(formData, userRole);
                console.log("Registration successful!", result);
                alert("Registration complete! You can now log in.");
                onShowLogin(); // Redirect to login page on success
            } catch (error) {
                console.error("Registration error:", error);
                setErrors({ form: error.message }); // Display form-wide error
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Join SupplyLink</h2>
                        <p className="text-gray-500 mt-2 mb-8">First, tell us who you are.</p>
                        <div className="space-y-4">
                            <button onClick={() => handleRoleSelect('shop')} className="w-full border-2 border-blue-500 text-blue-500 py-6 rounded-lg font-semibold text-lg hover:bg-blue-500 hover:text-white transition-all duration-300 flex flex-col items-center justify-center space-y-2"><StoreIcon className="w-10 h-10"/><span>I'm a Shop or Restaurant</span></button>
                            <button onClick={() => handleRoleSelect('vendor')} className="w-full border-2 border-green-500 text-green-500 py-6 rounded-lg font-semibold text-lg hover:bg-green-500 hover:text-white transition-all duration-300 flex flex-col items-center justify-center space-y-2"><TruckIcon className="w-10 h-10"/><span>I'm a Vendor or Supplier</span></button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                        <button type="button" onClick={prevStep} className="text-sm text-gray-600 hover:text-blue-600 flex items-center mb-6"><ArrowLeftIcon className="w-4 h-4 mr-1"/> Back to role selection</button>
                        <h2 className="text-3xl font-bold text-gray-800">Create Your Account</h2>
                        <p className="text-gray-500 mt-2 mb-8">Let's get started with the basics.</p>
                        <div className="space-y-4">
                            <Input id="businessName" label="Business Name" placeholder="e.g., Momo Magic" value={formData.businessName} onChange={handleInputChange} error={errors.businessName} />
                            <Input id="email" type="email" label="Email Address" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} error={errors.email} />
                            <Input id="password" type="password" label="Password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} error={errors.password} />
                        </div>
                         <button type="submit" className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700">Next</button>
                    </form>
                );
            case 3:
                return (
                    <form onSubmit={handleFinalSubmit}>
                        <button type="button" onClick={prevStep} className="text-sm text-gray-600 hover:text-blue-600 flex items-center mb-6"><ArrowLeftIcon className="w-4 h-4 mr-1"/> Back to account details</button>
                        <h2 className="text-3xl font-bold text-gray-800">Tell Us More</h2>
                        <p className="text-gray-500 mt-2 mb-8">This helps us connect you with the right people.</p>
                        <div className="space-y-4">
                            {userRole === 'shop' && <Input id="address" label="Shop Address" placeholder="123 Main St, Dankuni" value={formData.address} onChange={handleInputChange} error={errors.address} />}
                            {userRole === 'vendor' && <Input id="categories" label="Product Categories" placeholder="e.g., Vegetables, Meat, Dairy" value={formData.categories} onChange={handleInputChange} error={errors.categories} />}
                            <Input id="phone" type="tel" label="Phone Number" placeholder="+91 12345 67890" value={formData.phone} onChange={handleInputChange} error={errors.phone} />
                        </div>
                        {errors.form && <p className="mt-4 text-sm text-red-600 text-center">{errors.form}</p>}
                        <button type="submit" disabled={isSubmitting} className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-blue-400">
                            {isSubmitting ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white p-8 rounded-xl shadow-2xl">
                    {renderStep()}
                </div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button onClick={onShowLogin} className="font-medium text-blue-600 hover:underline">
                            Log in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
