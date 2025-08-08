// src/components/shop/SellerListing.js
import React, { useState, useEffect, useCallback } from "react";
// --- LocationContext now provides locationLoading and locationError ---
import { useLocation } from "../../context/LocationContext";
import { searchSellers } from "../../services/api";
import FilterSection from "./FilterSection";
import SellerCard from "./SellerCard";

const SellerListing = () => {
  // --- 1. GET THE FULL LOCATION STATE ---
  const { location, locationLoading, locationError } = useLocation();
  const [sellers, setSellers] = useState([]);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [filters, setFilters] = useState({
    city: "",
    sellerType: "",
    range: "",
    sortBy: "distance",
  });

  // --- 2. REWORK THE SEARCH FUNCTION ---
  // This function now depends only on location and filters.
  const searchSellersData = useCallback(async () => {
    if (!location) return; // Guard clause

    setSearchLoading(true);
    setSearchError(null);
    try {
      const sellersData = await searchSellers(
        location.latitude,
        location.longitude,
        filters
      );
      setSellers(sellersData);
    } catch (err) {
      setSearchError(
        err.message || "An error occurred while fetching sellers."
      );
      setSellers([]);
    } finally {
      setSearchLoading(false);
    }
  }, [location, filters]); // Dependencies for the search

  // --- 3. UPDATE useEffect TO TRIGGER SEARCH ---
  // This effect runs whenever the location or filters change.
  useEffect(() => {
    if (location && !searchInitiated) {
      searchSellersData();
      setSearchInitiated(true); // Ensure initial search runs only once
    } else if (searchInitiated) {
      // This part handles re-searching when filters are changed
      searchSellersData();
    }
  }, [location, filters, searchSellersData, searchInitiated]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Skeleton loader remains the same
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    // We no longer need the ref and intersection observer
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Find Your Nearby Sellers
          </h1>
          {/* --- 4. IMPROVE UI MESSAGES BASED ON LOCATION STATE --- */}
          {locationLoading && (
            <p className="text-gray-500 text-lg">Getting your location...</p>
          )}
          {locationError && (
            <p className="text-red-600 text-lg">{locationError}</p>
          )}
          {location && !locationError && (
            <p className="text-gray-700 text-lg">
              Discover trusted sellers near you
              {location.city ? ` in ${location.city}.` : "."}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <FilterSection
                onFilterChange={handleFilterChange}
                filters={filters}
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            {/* --- 5. RENDER BASED ON SEARCH STATE --- */}
            {searchLoading ? (
              renderSkeletons()
            ) : searchError ? (
              <div className="text-red-600 text-center p-6 bg-red-50 rounded-lg">
                {searchError}
              </div>
            ) : sellers.length === 0 && searchInitiated ? (
              <div className="text-center py-8 text-gray-600">
                No sellers found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* --- FIX: Using seller.seller_id as the unique key --- */}
                {sellers.map((seller) => (
                  <SellerCard key={seller.seller_id} seller={seller} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerListing;
