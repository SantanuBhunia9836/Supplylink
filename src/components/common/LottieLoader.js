// src/components/common/LottieLoader.js
import React from 'react';

const LottieLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <iframe 
        src="https://lottiefiles.com/iframe/j7BG8cPg6H"
        style={{ border: 'none', width: '300px', height: '300px' }}
        title="Loading Animation"
      ></iframe>
      <p className="text-gray-600 font-medium -mt-8">Finding nearby sellers...</p>
    </div>
  );
};

export default LottieLoader;