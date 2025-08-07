// src/components/layout/LandingPageFooter.js
import React from 'react';

const LandingPageFooter = () => {
    return (
        <footer className="bg-gray-800 text-white py-10">
            <div className="container mx-auto px-6 text-center">
                <p>&copy; {new Date().getFullYear()} SupplyLink. All Rights Reserved.</p>
                <p className="text-sm text-gray-400 mt-2">
                    Made with ❤️ for the local businesses of Dankuni, West Bengal.
                </p>
            </div>
        </footer>
    );
};

export default LandingPageFooter;
