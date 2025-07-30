// src/pages/dashboard/CreateOrder.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getProducts, placeOrder } from '../../services/api';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-10">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
    </div>
);

const CreateOrder = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const fetchedProducts = await getProducts();
                setProducts(fetchedProducts);
                setError(null);
            } catch (err) {
                setError('Failed to load products. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToOrder = (product) => {
        setOrderItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const handlePlaceOrder = async () => {
        if (orderItems.length === 0) return;
        setIsPlacingOrder(true);
        try {
            const result = await placeOrder(orderItems, user.id);
            alert(`Order placed successfully! Order ID: ${result.orderId}`);
            setOrderItems([]);
        } catch (err) {
            alert("There was an error placing your order.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-center text-red-500 font-semibold p-10">{error}</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-4">Select Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {products.map(product => (
                        <div key={product.id} className="border rounded-lg p-4 flex flex-col justify-between">
                            <div>
                               <p className="font-bold text-lg">{product.name}</p>
                               <p className="text-sm text-gray-500">{product.category}</p>
                               <p className="text-md font-semibold text-green-600 mt-2">{product.price}</p>
                            </div>
                            <button onClick={() => handleAddToOrder(product)} className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                Add to Order
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full lg:w-80 flex-shrink-0 bg-white p-6 rounded-lg shadow self-start sticky top-6">
                 <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                 <div className="space-y-3 text-gray-700 min-h-[100px]">
                    {orderItems.length === 0 ? (
                        <p className="text-gray-500">No items added yet.</p>
                    ) : (
                        orderItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                                <span>{item.name}</span>
                                <span className="font-semibold">x {item.quantity}</span>
                            </div>
                        ))
                    )}
                 </div>
                 <button onClick={handlePlaceOrder} disabled={isPlacingOrder || orderItems.length === 0} className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                 </button>
            </div>
        </div>
    );
};

export default CreateOrder;
