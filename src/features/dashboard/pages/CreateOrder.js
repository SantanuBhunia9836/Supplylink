import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, X, Loader2 } from 'lucide-react';

// Mock product data that would typically come from an API
const mockApiProducts = [
    { id: 1, name: 'Premium Office Chair', price: 12000, seller: 'Global Electronics', image: 'https://placehold.co/300x300/e2e8f0/4a5568?text=Chair' },
    { id: 2, name: 'Wireless Keyboard', price: 2500, seller: 'Crafty Goods Co.', image: 'https://placehold.co/300x300/e2e8f0/4a5568?text=Keyboard' },
    { id: 3, name: '4K Webcam', price: 4500, seller: 'Global Electronics', image: 'https://placehold.co/300x300/e2e8f0/4a5568?text=Webcam' },
    { id: 4, name: 'A4 Paper Ream (500 Sheets)', price: 400, seller: 'Office Supplies Inc.', image: 'https://placehold.co/300x300/e2e8f0/4a5568?text=Paper' },
    { id: 5, name: 'Leather Notebook', price: 800, seller: 'Crafty Goods Co.', image: 'https://placehold.co/300x300/e2e8f0/4a5568?text=Notebook' },
    { id: 6, name: 'Ergonomic Mouse', price: 1800, seller: 'Global Electronics', image: 'https://placehold.co/300x300/e2e8f0/4a5568?text=Mouse' },
];

const ProductCard = ({ product, onAddToCart }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
        <img className="w-full h-48 object-cover" src={product.image} alt={product.name} />
        <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Sold by: {product.seller}</p>
            <div className="flex justify-between items-center mt-4">
                <p className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                <button 
                    onClick={() => onAddToCart(product)}
                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    </div>
);

const CreateOrder = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                // Simulate an API call with a delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                setProducts(mockApiProducts);
                setError(null);
            } catch (err) {
                setError("Failed to load products. Please try again later.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };
    
    const handleQuantityChange = (productId, amount) => {
        setCart(prevCart => {
            return prevCart.map(item =>
                item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
            ).filter(item => item.quantity > 0);
        });
    };

    const handleRemoveFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        setIsPlacingOrder(true);
        try {
            // Simulate an API call to place the order
            await new Promise(resolve => setTimeout(resolve, 1500));
            // In a real app, you might use a toast notification here
            alert("Order placed successfully!");
            setCart([]);
            setIsCartOpen(false);
        } catch (err) {
            alert("There was an error placing your order.");
            console.error(err);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg">
                <h3 className="text-xl font-bold">An Error Occurred</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-8 flex items-center gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                    <input 
                        type="text" 
                        placeholder="Search for products..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button 
                    onClick={() => setIsCartOpen(true)}
                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors relative"
                >
                    Cart
                    {cart.length > 0 && 
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cart.reduce((count, item) => count + item.quantity, 0)}
                        </span>
                    }
                </button>
            </div>

            {/* Product Listing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
            </div>

             {/* Shopping Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsCartOpen(false)}></div>
            )}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                 <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-semibold text-gray-800">Shopping Cart</h2>
                    <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-800">
                        <X size={28} />
                    </button>
                </div>
                {cart.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Your cart is empty.</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                       {cart.map(item => (
                            <div key={item.id} className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                    <p className="text-sm text-gray-600">₹{item.price.toLocaleString()}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button onClick={() => handleQuantityChange(item.id, -1)} className="border rounded-md px-2 py-1 hover:bg-gray-100"><Minus size={16}/></button>
                                        <span className="font-bold">{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.id, 1)} className="border rounded-md px-2 py-1 hover:bg-gray-100"><Plus size={16}/></button>
                                    </div>
                                </div>
                                <div className="text-right">
                                     <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                                     <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-500 text-xs hover:underline mt-1">Remove</button>
                                </div>
                            </div>
                       ))}
                    </div>
                )}
                {cart.length > 0 && (
                     <div className="p-6 border-t bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-medium text-gray-600">Subtotal</span>
                            <span className="text-2xl font-bold text-gray-800">₹{subtotal.toLocaleString()}</span>
                        </div>
                        <button 
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder || cart.length === 0}
                            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isPlacingOrder ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Proceed to Checkout'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateOrder;

