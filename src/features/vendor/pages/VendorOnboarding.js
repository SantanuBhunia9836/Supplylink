// src/pages/vendor-dashboard/VendorOnboarding.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { ArrowRight } from 'lucide-react';

const VendorOnboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header pageTitle="Vendor Account" />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center bg-white p-10 rounded-xl shadow-md max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to SupplyLink!
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Your vendor account is ready. Complete the next step to set up your shop and start selling.
          </p>
          <button
            onClick={() => navigate('/seller-registration')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg"
          >
            Become a Seller
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default VendorOnboarding;