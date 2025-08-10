// src/components/shop/SellerListing.js
import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "../../context/LocationContext";
import { searchSellers } from "../../services/api";
import FilterSection from "./FilterSection";
import SellerCard from "./SellerCard";

const SellerListing = () => {
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

  const searchSellersData = useCallback(async () => {
    if (!location) return;

    setSearchLoading(true);
    setSearchError(null);
    try {
      const sellersData = await searchSellers(
        location.latitude,
        location.longitude,
        filters
      );

      // --- THIS IS THE FIX ---
      // We prepare the data here to prevent crashes in the SellerCard component.
      const preparedSellers = sellersData.map((seller) => ({
        ...seller,
        // 1. Rename 'distance_km' from the API to 'distance' which SellerCard expects.
        // 2. If 'distance_km' is missing or not a number, set it to null so it doesn't crash.
        distance:
          typeof seller.distance_km === "number" ? seller.distance_km : null,
      }));
      // --- END OF FIX ---

      setSellers(preparedSellers); // Use the cleaned and prepared data
    } catch (err) {
      setSearchError(
        err.message || "An error occurred while fetching sellers."
      );
      setSellers([]);
    } finally {
      setSearchLoading(false);
    }
  }, [location, filters]);

  useEffect(() => {
    if (location && !searchInitiated) {
      searchSellersData();
      setSearchInitiated(true);
    } else if (searchInitiated) {
      searchSellersData();
    }
  }, [location, filters, searchSellersData, searchInitiated]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Find Your Nearby Sellers
          </h1>
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
