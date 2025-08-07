// src/components/common/ProfileCompletionDemo.js
import React, { useState } from 'react';
import ProfileCompletionIndicator from './ProfileCompletionIndicator';
import ProfileCompletionDetails from './ProfileCompletionDetails';

const ProfileCompletionDemo = () => {
  // Sample API response data
  const [demoData, setDemoData] = useState({
    "is_login": true,
    "is_seller": true,
    "profile_done": 66,
    "profile_creds": ["shop"],
    "seller_profile_done": 25,
    "seller_profile_creds": ["factories", "location", "products"]
  });

  const updateDemoData = (newData) => {
    setDemoData(newData);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Completion Demo</h1>
        
        {/* API Response Display */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">API Response</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(demoData, null, 2)}
          </pre>
        </div>

        {/* Demo Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Demo Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Profile Completion</h3>
              <input
                type="range"
                min="0"
                max="100"
                value={demoData.profile_done}
                onChange={(e) => updateDemoData({
                  ...demoData,
                  profile_done: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{demoData.profile_done}%</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Seller Profile Completion</h3>
              <input
                type="range"
                min="0"
                max="100"
                value={demoData.seller_profile_done}
                onChange={(e) => updateDemoData({
                  ...demoData,
                  seller_profile_done: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{demoData.seller_profile_done}%</span>
            </div>
          </div>
        </div>

        {/* Profile Completion Indicator Demo */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Completion Indicator</h2>
          <div className="flex flex-wrap gap-8 items-center">
            {/* Small indicator */}
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Small (32px)</h3>
              <ProfileCompletionIndicator 
                profileCompletion={demoData}
                size={32}
                strokeWidth={2}
                showPercentage={true}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </ProfileCompletionIndicator>
            </div>

            {/* Medium indicator */}
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Medium (48px)</h3>
              <ProfileCompletionIndicator 
                profileCompletion={demoData}
                size={48}
                strokeWidth={3}
                showPercentage={true}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </ProfileCompletionIndicator>
            </div>

            {/* Large indicator */}
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Large (64px)</h3>
              <ProfileCompletionIndicator 
                profileCompletion={demoData}
                size={64}
                strokeWidth={4}
                showPercentage={false}
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </ProfileCompletionIndicator>
            </div>
          </div>
        </div>

        {/* Profile Completion Details Demo */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Completion Details</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Compact version */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Compact Version (Dropdown)</h3>
              <ProfileCompletionDetails profileCompletion={demoData} compact={true} />
            </div>
            
            {/* Full version */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Full Version</h3>
              <ProfileCompletionDetails profileCompletion={demoData} compact={false} />
            </div>
          </div>
        </div>

        {/* Color Legend */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Color Legend</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-700">0-39% (Red)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-700">40-59% (Orange)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">60-79% (Yellow)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">80-100% (Green)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionDemo; 