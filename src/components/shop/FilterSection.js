import React, { useState, useEffect } from "react";

// --- Icon Component ---
const CloseIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const FilterSection = ({ onFilterChange, filters, isOpen, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // This ensures the local state updates if the parent's filters change (e.g., on clear)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    // Apply filters instantly as the user interacts
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      city: "",
      sellerType: "",
      range: "",
      sortBy: "distance",
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const sellerTypes = [
    "Grocery Store",
    "Restaurant",
    "Pharmacy",
    "Hardware Store",
    "Other",
  ];
  const rangeOptions = [
    { value: "5", label: "5 km" },
    { value: "10", label: "10 km" },
    { value: "20", label: "20 km" },
  ];
  const sortOptions = [
    { value: "distance", label: "Distance (Nearest)" },
    { value: "rating", label: "Rating (Highest)" },
    { value: "name", label: "Name (A-Z)" },
  ];

  return (
    <>
      {/* Overlay for mobile view */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Main Filter Panel */}
      <div
        className={`
        fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        md:sticky md:top-24 md:right-auto md:h-auto md:w-auto md:max-w-none md:translate-x-0
        md:bg-white/80 md:backdrop-blur-lg md:rounded-2xl md:shadow-xl md:border md:border-gray-100
      `}
      >
        <div className="h-full flex flex-col">
          {/* --- Mobile Header --- */}
          <div className="flex items-center justify-between p-4 border-b md:hidden">
            <h3 className="text-xl font-bold text-gray-800">Filters & Sort</h3>
            <button onClick={onClose} className="p-2 -mr-2 text-gray-500">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* --- Main content --- */}
          <div className="p-6 space-y-6 overflow-y-auto flex-grow">
            {/* Desktop Header */}
            <div className="hidden md:flex items-center justify-between">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear All
              </button>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={localFilters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                placeholder="Enter city name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Seller Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seller Type
              </label>
              <select
                value={localFilters.sellerType}
                onChange={(e) =>
                  handleFilterChange("sellerType", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
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
                onChange={(e) => handleFilterChange("range", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Distance</option>
                {rangeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
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
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* --- Mobile Footer --- */}
          <div className="p-4 bg-white border-t flex items-center space-x-2 md:hidden">
            <button
              onClick={clearFilters}
              className="w-1/2 py-3 text-gray-700 bg-gray-100 font-bold rounded-xl"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="w-1/2 py-3 bg-blue-600 text-white font-bold rounded-xl"
            >
              Show Results
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSection;
