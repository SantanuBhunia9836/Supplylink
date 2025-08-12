// src/components/shop/SellerListing.js
import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "../../context/LocationContext";
import { searchSellers } from "../../services/api";
import FilterSection from "./FilterSection";
import SellerCard from "./SellerCard";
import MobileFilterHeader from "../layout/MobileFilterHeader";

const SellerListing = () => {
  const { location, locationLoading, locationError } = useLocation();
  const [sellers, setSellers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(true); // Start with true to show initial skeletons
  const [searchError, setSearchError] = useState(null);
  const [filters, setFilters] = useState({
    city: "",
    sellerType: "",
    range: "",
    sortBy: "distance",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /**
   * This function is responsible for fetching seller data from the API.
   * It is wrapped in `useCallback` to ensure it only gets recreated when
   * the actual location coordinates or filters change.
   */
  const searchSellersData = useCallback(async () => {
    // Do not proceed if location data is not yet available.
    if (!location?.latitude || !location?.longitude) {
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    try {
      const sellersData = await searchSellers(
        location.latitude,
        location.longitude,
        filters
      );

      if (Array.isArray(sellersData)) {
        const preparedSellers = sellersData.map((seller) => {
          // The API response provides distance as a string, so we parse it.
          const distanceNum = parseFloat(seller.distance);
          return {
            ...seller,
            // Pass the numeric distance to the SellerCard.
            // If conversion fails (returns NaN), pass null instead.
            distance: !isNaN(distanceNum) ? distanceNum : null,
          };
        });
        setSellers(preparedSellers);
      } else {
        console.error("API did not return an array of sellers:", sellersData);
        setSellers([]); // Ensure sellers is always an array
      }
    } catch (err) {
      setSearchError(
        err.message || "An error occurred while fetching sellers."
      );
      setSellers([]); // Clear sellers on error
    } finally {
      setSearchLoading(false);
    }
    // By depending on the primitive values of lat/long, we prevent re-runs
    // caused by the location object reference changing unnecessarily.
  }, [location?.latitude, location?.longitude, filters]); // Dependencies for the useCallback

  /**
   * This `useEffect` hook triggers the API call with a debounce.
   * This prevents multiple API calls from firing in rapid succession, which can
   * happen in React's Strict Mode during development.
   */
  useEffect(() => {
    // Set a timer to execute the search.
    const handler = setTimeout(() => {
      searchSellersData();
    }, 300); // A 300ms delay is usually enough to prevent double calls.

    // This cleanup function is crucial. It runs when the component unmounts
    // or when the effect re-runs. It cancels the previously scheduled timer.
    return () => {
      clearTimeout(handler);
    };
  }, [searchSellersData]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // A component to render skeleton loaders while data is being fetched.
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="animate-pulse p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-3 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-xl w-full mt-6"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <MobileFilterHeader onFilterClick={() => setIsFilterOpen(true)} />

      <div className="container mx-auto px-4 py-8">
        <div className="hidden lg:block mb-8 text-center">
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
              Discover trusted sellers near you{" "}
              {location.city ? ` in ${location.city}.` : "."}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterSection
              onFilterChange={handleFilterChange}
              filters={filters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          <div className="lg:col-span-3">
            {searchLoading ? (
              renderSkeletons()
            ) : searchError ? (
              <div className="text-red-600 text-center p-6 bg-red-50 rounded-lg">
                <h3 className="font-bold">Oops! Something went wrong.</h3>
                <p>{searchError}</p>
              </div>
            ) : sellers.length === 0 ? (
              <div className="text-center py-8 px-4 text-gray-600 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">No Sellers Found</h3>
                <p>Try adjusting your filters or checking back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sellers.map((seller) => (
                  <SellerCard key={seller.factory_id} seller={seller} />
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
