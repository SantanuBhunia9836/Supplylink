import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";

// --- Icon Components ---
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2h12v-2h-1.258A6.002 6.002 0 0118 8zm-6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" /></svg>;
const CreditCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;

const steps = [
  { name: "Shipping", icon: UserIcon },
  { name: "Delivery", icon: TruckIcon },
  { name: "Payment", icon: CreditCardIcon },
];

const CheckoutPage = () => {
  const { cartItems, totalPrice, cartCount, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    // Simulate API call for order processing
    setTimeout(() => {
        setIsProcessing(false);
        clearCart();
        // Pass order details to the success page via state
        navigate("/order-success", { state: { orderDetails: { ...shippingInfo, deliveryMethod }, items: cartItems, total: finalPrice } });
    }, 2000);
  };

  const deliveryCost = deliveryMethod === "express" ? 150 : 0;
  const finalPrice = totalPrice + deliveryCost;

  if (cartCount === 0 && !isProcessing) {
      return (
          <div className="text-center py-20">
              <h2 className="text-2xl font-semibold">Your cart is empty.</h2>
              <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
                  Shop Now
              </button>
          </div>
      );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Shipping
        return (
          <form onSubmit={handleNext}>
            <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="email" name="email" value={shippingInfo.email} onChange={handleInputChange} placeholder="Email Address" required className="p-3 border rounded-lg w-full" />
              <input type="text" name="name" value={shippingInfo.name} onChange={handleInputChange} placeholder="Full Name" required className="p-3 border rounded-lg w-full" />
              <input type="text" name="address" value={shippingInfo.address} onChange={handleInputChange} placeholder="Street Address" required className="p-3 border rounded-lg w-full md:col-span-2" />
              <input type="text" name="city" value={shippingInfo.city} onChange={handleInputChange} placeholder="City" required className="p-3 border rounded-lg" />
              <input type="text" name="state" value={shippingInfo.state} onChange={handleInputChange} placeholder="State / Province" required className="p-3 border rounded-lg" />
              <input type="text" name="zip" value={shippingInfo.zip} onChange={handleInputChange} placeholder="ZIP / Postal Code" required className="p-3 border rounded-lg" />
            </div>
            <button type="submit" className="mt-8 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">Continue to Delivery</button>
          </form>
        );
      case 1: // Delivery
        return (
            <div>
              <h2 className="text-2xl font-bold mb-6">Delivery Method</h2>
              <div className="space-y-4">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${deliveryMethod === 'standard' ? 'border-blue-600 ring-2 ring-blue-300' : ''}`}>
                      <input type="radio" name="deliveryMethod" value="standard" checked={deliveryMethod === 'standard'} onChange={(e) => setDeliveryMethod(e.target.value)} className="mr-4" />
                      <div>
                          <p className="font-semibold">Standard Shipping</p>
                          <p className="text-sm text-gray-500">4-6 business days</p>
                      </div>
                      <span className="ml-auto font-bold text-green-600">FREE</span>
                  </label>
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${deliveryMethod === 'express' ? 'border-blue-600 ring-2 ring-blue-300' : ''}`}>
                      <input type="radio" name="deliveryMethod" value="express" checked={deliveryMethod === 'express'} onChange={(e) => setDeliveryMethod(e.target.value)} className="mr-4" />
                      <div>
                          <p className="font-semibold">Express Shipping</p>
                          <p className="text-sm text-gray-500">1-2 business days</p>
                      </div>
                      <span className="ml-auto font-bold">₹150.00</span>
                  </label>
              </div>
              <div className="flex justify-between mt-8">
                  <button onClick={() => setCurrentStep(0)} className="text-gray-600 font-bold py-3">‹ Back to Shipping</button>
                  <button onClick={handleNext} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">Continue to Payment</button>
              </div>
          </div>
        );
      case 2: // Payment
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Payment Details</h2>
            <p className="text-sm text-gray-500 mb-6">
              This is a demo. Please do not enter real card details.
            </p>
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="space-y-4">
                <input type="text" placeholder="Card Number" className="p-3 border rounded-lg w-full" />
                <input type="text" placeholder="Name on Card" className="p-3 border rounded-lg w-full" />
                <div className="flex space-x-4">
                  <input type="text" placeholder="MM / YY" className="p-3 border rounded-lg w-1/2" />
                  <input type="text" placeholder="CVC" className="p-3 border rounded-lg w-1/2" />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={() => setCurrentStep(1)} className="text-gray-600 font-bold py-3">‹ Back to Delivery</button>
              <button onClick={handlePlaceOrder} disabled={isProcessing} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-wait">
                {isProcessing ? 'Processing...' : `Pay ₹${finalPrice.toFixed(2)}`}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-center text-4xl font-extrabold mb-2">Checkout</h1>
            <p className="text-center text-gray-500 mb-8"><LockIcon /> Secure checkout process</p>
            {/* Stepper */}
            <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step.name}>
                        <div className="flex items-center flex-col md:flex-row">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                <step.icon />
                            </div>
                            <span className={`mt-2 md:mt-0 md:ml-3 font-semibold ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>{step.name}</span>
                        </div>
                        {index < steps.length - 1 && <div className={`flex-1 h-1 mx-4 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Side: Form */}
          <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-lg">
            {renderStepContent()}
          </div>
          
          {/* Right Side: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold border-b pb-4 mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="font-semibold">{item.name} <span className="text-gray-500">x {item.quantity}</span></span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{totalPrice.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>₹{deliveryCost.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg mt-2"><span>Total</span><span>₹{finalPrice.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;