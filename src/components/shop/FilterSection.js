import React, { useState } from 'react';

const FilterSection = ({ onFilterChange, filters }) => {
  const [localFilters, setLocalFilters] = useState({
    city: filters.city || '',
    sellerType: filters.sellerType || '',
    range: filters.range || '',
    sortBy: filters.sortBy || 'distance'
  });

  const sellerTypes = [
    'Grocery Store',
    'Restaurant',
    'Pharmacy',
    'Hardware Store',
    'Electronics',
    'Clothing',
    'Furniture',
    'Automotive',
    'Other'
  ];

  const rangeOptions = [
    { value: '5', label: '5 km' },
    { value: '10', label: '10 km' },
    { value: '15', label: '15 km' },
    { value: '20', label: '20 km' },
    { value: '50', label: '50 km' }
  ];

  const sortOptions = [
    { value: 'distance', label: 'Distance (Nearest)' },
    { value: 'rating', label: 'Rating (Highest)' },
    { value: 'name', label: 'Name (A-Z)' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      city: '',
      sellerType: '',
      range: '',
      sortBy: 'distance'
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:scale-105 transition-transform duration-200"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={localFilters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            placeholder="Enter city name"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
          />
        </div>

        {/* Seller Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seller Type
          </label>
          <select
            value={localFilters.sellerType}
            onChange={(e) => handleFilterChange('sellerType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
          >
            <option value="">All Types</option>
            {sellerTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance Range
          </label>
          <select
            value={localFilters.range}
            onChange={(e) => handleFilterChange('range', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
          >
            <option value="">Any Distance</option>
            {rangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={localFilters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Filters
          </label>
          <div className="space-y-2">
                         <button
               onClick={() => handleFilterChange('range', '5')}
               className="w-full text-left px-4 py-3 text-sm bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-300"
             >
               Within 5 km
             </button>
             <button
               onClick={() => handleFilterChange('sellerType', 'Grocery Store')}
               className="w-full text-left px-4 py-3 text-sm bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-300"
             >
               Grocery Stores
             </button>
             <button
               onClick={() => handleFilterChange('sellerType', 'Restaurant')}
               className="w-full text-left px-4 py-3 text-sm bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-300"
             >
               Restaurants
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection; 