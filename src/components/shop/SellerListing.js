// src/components/shop/SellerListing.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from '../../context/LocationContext';
import { searchSellers } from '../../services/api';
import FilterSection from './FilterSection';
import SellerCard from './SellerCard';

const SellerListing = () => {
  const { location } = useLocation();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ city: '', sellerType: '', range: '', sortBy: 'distance' });
  
  const [isVisible, setIsVisible] = useState(false);
  const sellerSectionRef = useRef(null);

  const searchSellersData = useCallback(async () => {
    if (!location) {
        setError("Please enable location services to find sellers near you.");
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const sellersData = await searchSellers(location.latitude, location.longitude, filters);
      setSellers(sellersData);
    } catch (err) {
      setError(err.message || "An error occurred while fetching sellers.");
      setSellers([]); // Clear sellers on error
    } finally {
      setLoading(false);
    }
  }, [location, filters]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -100px 0px' }
    );

    const currentRef = sellerSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      searchSellersData();
    }
  }, [isVisible, searchSellersData]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
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
    <div ref={sellerSectionRef} className="min-h-[50vh] bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Find Local Sellers</h1>
          {location ? (
            <p className="text-gray-700 text-lg">
              Discover trusted sellers near you in {location.city || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
            </p>
          ) : (
            <p className="text-gray-500 text-lg">Enable location to find sellers...</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <FilterSection onFilterChange={handleFilterChange} filters={filters} />
            </div>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              renderSkeletons()
            ) : error ? (
              <div className="text-red-600 text-center p-6 bg-red-50 rounded-lg">{error}</div>
            ) : sellers.length === 0 ? (
              <div className="text-center py-8 text-gray-600">No sellers found matching your criteria.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sellers.map((seller) => (
                  <SellerCard key={seller.id} seller={seller} />
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
