// src/components/common/ProfileCompletionDetails.js
import React from 'react';

const ProfileCompletionDetails = ({ profileCompletion, compact = false }) => {
  const { 
    profile_done, 
    profile_creds, 
    seller_profile_done, 
    seller_profile_creds 
  } = profileCompletion;

  // Define all possible profile fields
  const allProfileFields = ['shop', 'location', 'contact'];
  const allSellerFields = ['factories', 'location', 'products', 'pricing'];

  // Calculate missing fields
  const missingProfileFields = allProfileFields.filter(field => !profile_creds.includes(field));
  const missingSellerFields = allSellerFields.filter(field => !seller_profile_creds.includes(field));

  // Get field display names
  const getFieldDisplayName = (field) => {
    const fieldNames = {
      shop: 'Shop Information',
      location: 'Location',
      contact: 'Contact Details',
      factories: 'Factory Information',
      products: 'Product Catalog',
      pricing: 'Pricing Information'
    };
    return fieldNames[field] || field;
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg p-4 max-w-xs">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Profile Completion</h3>
        
        {/* Overall Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Overall</span>
            <span className="text-sm font-bold text-gray-800">
              {Math.max(profile_done, seller_profile_done)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(profile_done, seller_profile_done)}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-600">Basic:</span>
            <span className="font-medium text-blue-600 ml-1">{profile_done}%</span>
          </div>
          <div>
            <span className="text-gray-600">Seller:</span>
            <span className="font-medium text-purple-600 ml-1">{seller_profile_done}%</span>
          </div>
        </div>

        {/* Missing Items */}
        {missingProfileFields.length > 0 || missingSellerFields.length > 0 ? (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Missing:</p>
            <div className="space-y-1">
              {missingProfileFields.slice(0, 2).map(field => (
                <div key={field} className="text-xs text-red-600">
                  ✗ {getFieldDisplayName(field)}
                </div>
              ))}
              {missingSellerFields.slice(0, 2).map(field => (
                <div key={field} className="text-xs text-red-600">
                  ✗ {getFieldDisplayName(field)}
                </div>
              ))}
              {(missingProfileFields.length + missingSellerFields.length) > 4 && (
                <div className="text-xs text-gray-500">
                  +{(missingProfileFields.length + missingSellerFields.length) - 4} more
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="text-xs text-green-600 font-medium">
              ✓ Profile Complete!
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Completion</h3>
      
      {/* Basic Profile Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Basic Profile</h4>
          <span className="text-sm font-bold text-blue-600">{profile_done}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${profile_done}%` }}
          ></div>
        </div>
        
        {/* Completed Fields */}
        {profile_creds.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-600 mb-1">Completed:</p>
            <div className="flex flex-wrap gap-1">
              {profile_creds.map(field => (
                <span 
                  key={field}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  ✓ {getFieldDisplayName(field)}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Missing Fields */}
        {missingProfileFields.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-600 mb-1">Missing:</p>
            <div className="flex flex-wrap gap-1">
              {missingProfileFields.map(field => (
                <span 
                  key={field}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  ✗ {getFieldDisplayName(field)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Seller Profile Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Seller Profile</h4>
          <span className="text-sm font-bold text-purple-600">{seller_profile_done}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${seller_profile_done}%` }}
          ></div>
        </div>
        
        {/* Completed Seller Fields */}
        {seller_profile_creds.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-600 mb-1">Completed:</p>
            <div className="flex flex-wrap gap-1">
              {seller_profile_creds.map(field => (
                <span 
                  key={field}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  ✓ {getFieldDisplayName(field)}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Missing Seller Fields */}
        {missingSellerFields.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-600 mb-1">Missing:</p>
            <div className="flex flex-wrap gap-1">
              {missingSellerFields.map(field => (
                <span 
                  key={field}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  ✗ {getFieldDisplayName(field)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Overall Progress */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-lg font-bold text-gray-800">
            {Math.max(profile_done, seller_profile_done)}%
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Complete your profile to unlock more features and improve your visibility.
        </p>
      </div>
    </div>
  );
};

export default ProfileCompletionDetails; 