// src/pages/SellerRegistration.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCreateSeller, apiCreateFactory, apiCreateFactoryLocation, apiCreateProducts } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import FactoryLocation from '../components/seller/FactoryLocation';
import ProductList from '../components/seller/ProductList';

// --- Helper & Icon Components ---
const SpinnerIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>;
const ArrowLeftIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;

const ProgressTracker = ({ currentStep }) => {
    const steps = ['Seller Details', 'Factory Info', 'Location', 'Add Products'];
    return (
        <div className="w-full px-8 pt-8">
            <div className="flex items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${currentStep > index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {currentStep > index ? '✓' : index + 1}
                            </div>
                            <span className={`ml-3 font-medium transition-colors duration-300 ${currentStep >= index ? 'text-gray-800' : 'text-gray-500'}`}>{step}</span>
                        </div>
                        {index < steps.length - 1 && <div className="flex-auto border-t-2 transition duration-500 ease-in-out mx-4 border-gray-200"></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

// --- Main Component ---
const SellerRegistration = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // State for all steps
    const [sellerId, setSellerId] = useState(null);
    const [factoryId, setFactoryId] = useState(null);
    const [sellerData, setSellerData] = useState({ email: user?.email || '', phone: user?.phone || '' });
    const [factoryData, setFactoryData] = useState({ name: '', factory_type: 'factory', contact_number: '' });
    const [locationData, setLocationData] = useState({ address_line1: '', city: '', state: '', postal_code: '', country: '', latitude: null, longitude: null });
    const [products, setProducts] = useState([
        { name: '', description: '', price: '', stock_quantity: '', qunatity_unit: 'unit', category: '' }
    ]);

    // --- Step Handlers ---
    const handleNextStep = () => setStep(prev => prev + 1);
    const handlePrevStep = () => setStep(prev => prev - 1);

    const handleSellerSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const result = await apiCreateSeller(sellerData);
            setSellerId(result.id);
            handleNextStep();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFactorySubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const payload = { ...factoryData, seller_id: sellerId };
            const result = await apiCreateFactory(payload);
            setFactoryId(result.id);
            handleNextStep();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLocationSubmit = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await apiCreateFactoryLocation({ ...locationData, factory_id: factoryId });
            handleNextStep();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const productsPayload = products.map(p => ({
            ...p,
            seller_id: sellerId,
            factory_id: factoryId,
            price: parseFloat(p.price) || 0,
            stock_quantity: parseInt(p.stock_quantity) || 0,
        }));
        try {
            await apiCreateProducts(productsPayload);
            alert("Registration and product creation complete!");
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        const inputStyles = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500";
        switch (step) {
            case 1:
                return (
                    <form onSubmit={handleSellerSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                            <input type="email" id="email" value={sellerData.email} onChange={(e) => setSellerData({...sellerData, email: e.target.value})} required className={inputStyles}/>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
                            <input type="tel" id="phone" value={sellerData.phone} onChange={(e) => setSellerData({...sellerData, phone: e.target.value})} required className={inputStyles}/>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 bg-blue-600 text-white rounded-md">
                            {isLoading ? <SpinnerIcon/> : 'Next: Add Factory'}
                        </button>
                    </form>
                );
            case 2:
                return (
                     <form onSubmit={handleFactorySubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Factory/Business Name *</label>
                            <input type="text" id="name" value={factoryData.name} onChange={(e) => setFactoryData({...factoryData, name: e.target.value})} required className={inputStyles}/>
                        </div>
                        <div>
                            <label htmlFor="factory_type" className="block text-sm font-medium text-gray-700">Business Type *</label>
                            <select id="factory_type" value={factoryData.factory_type} onChange={(e) => setFactoryData({...factoryData, factory_type: e.target.value})} className={inputStyles}>
                                <option value="factory">Factory</option>
                                <option value="warehouse">Warehouse</option>
                                <option value="store">Store</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">Contact Number *</label>
                            <input type="tel" id="contact_number" value={factoryData.contact_number} onChange={(e) => setFactoryData({...factoryData, contact_number: e.target.value})} required className={inputStyles}/>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 bg-blue-600 text-white rounded-md">
                            {isLoading ? <SpinnerIcon/> : 'Next: Set Location'}
                        </button>
                    </form>
                );
            case 3:
                return (
                    <FactoryLocation 
                        formData={locationData}
                        onFormDataChange={setLocationData}
                        onLocationSet={handleLocationSubmit}
                    />
                );
            case 4:
                return (
                    <form onSubmit={handleProductSubmit}>
                        <ProductList 
                            products={products}
                            onProductChange={(index, field, value) => {
                                const newProducts = [...products];
                                newProducts[index][field] = value;
                                setProducts(newProducts);
                            }}
                            onAddProduct={() => setProducts([...products, { name: '', description: '', price: '', stock_quantity: '', qunatity_unit: 'unit', category: '' }])}
                            onRemoveProduct={(index) => setProducts(products.filter((_, i) => i !== index))}
                        />
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 bg-blue-600 text-white rounded-md">
                            {isLoading ? <SpinnerIcon/> : 'Finish Registration'}
                        </button>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="p-6 flex items-center space-x-4 border-b">
                    <button onClick={() => step > 1 ? handlePrevStep() : navigate(-1)} className="text-gray-500">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Become a Seller</h1>
                </div>
                <ProgressTracker currentStep={step} />
                <div className="p-8">
                    {error && <div className="p-3 bg-red-100 text-red-700 rounded-md mb-6">{error}</div>}
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default SellerRegistration;
