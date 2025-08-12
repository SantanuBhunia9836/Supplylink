// src/components/layout/MobileFilterHeader.js
import React from "react";

// --- Icon Components ---
const SearchIcon = (props) => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
const FilterIcon = (props) => (
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
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const MobileFilterHeader = ({ onFilterClick }) => {
  return (
    // This component is hidden on desktop (md:hidden)
    <div className="p-4 bg-gray-50 border-b border-gray-200 md:hidden sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search sellers..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            // Note: You would pass props here to handle search term state
          />
        </div>
        {/* This button triggers the filter panel to open */}
        <button
          onClick={onFilterClick}
          className="flex-shrink-0 flex items-center space-x-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium active:scale-95 transition-transform"
        >
          <FilterIcon className="w-5 h-5 text-blue-600" />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
};

export default MobileFilterHeader;
