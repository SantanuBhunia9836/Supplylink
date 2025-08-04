import React, { useState, useEffect } from 'react';
import { useLocation } from '../../context/LocationContext';
import { searchSellers } from '../../services/api';
import FilterSection from './FilterSection';
import SellerCard from './SellerCard';

const SellerListing = () => {
  const { location } = useLocation();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    sellerType: '',
    range: '',
    sortBy: 'distance'
  });

  // Mock data for development - replace with actual API call
  const mockSellers = [
    {
      id: 1,
      name: 'Fresh Grocery Store',
      businessType: 'Grocery Store',
      city: 'Kolkata',
      state: 'West Bengal',
      distance: '2.1',
      rating: '4.5',
      specialties: ['Fresh Vegetables', 'Dairy Products', 'Organic Items']
    },
    {
      id: 2,
      name: 'Spice Bazaar',
      businessType: 'Grocery Store',
      city: 'Kolkata',
      state: 'West Bengal',
      distance: '3.2',
      rating: '4.2',
      specialties: ['Spices', 'Dry Fruits', 'Beverages']
    },
    {
      id: 3,
      name: 'Tech Solutions',
      businessType: 'Electronics',
      city: 'Kolkata',
      state: 'West Bengal',
      distance: '1.8',
      rating: '4.7',
      specialties: ['Mobile Phones', 'Laptops', 'Accessories']
    },
    {
      id: 4,
      name: 'PharmaCare',
      businessType: 'Pharmacy',
      city: 'Kolkata',
      state: 'West Bengal',
      distance: '4.5',
      rating: '4.3',
      specialties: ['Medicines', 'Health Supplements', 'First Aid']
    },
    {
      id: 5,
      name: 'Taste of India',
      businessType: 'Restaurant',
      city: 'Kolkata',
      state: 'West Bengal',
      distance: '2.7',
      rating: '4.6',
      specialties: ['Indian Cuisine', 'Tandoori', 'Biryani']
    },
    {
      id: 6,
      name: 'Hardware Hub',
      businessType: 'Hardware Store',
      city: 'Kolkata',
      state: 'West Bengal',
      distance: '5.1',
      rating: '4.1',
      specialties: ['Tools', 'Building Materials', 'Electrical']
    }
  ];

  const searchSellersData = async () => {
    if (!location) {
      setError('Location not available. Please enable location services.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For now, using mock data. Replace with actual API call:
      // const response = await searchSellers(location.latitude, location.longitude, filters);
      // const sellersData = JSON.parse(response);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock data based on current filters
      let filteredSellers = [...mockSellers];
      
      if (filters.city) {
        filteredSellers = filteredSellers.filter(seller => 
          seller.city.toLowerCase().includes(filters.city.toLowerCase())
        );
      }
      
      if (filters.sellerType) {
        filteredSellers = filteredSellers.filter(seller => 
          seller.businessType === filters.sellerType
        );
      }
      
      if (filters.range) {
        const maxDistance = parseFloat(filters.range);
        filteredSellers = filteredSellers.filter(seller => 
          parseFloat(seller.distance) <= maxDistance
        );
      }
      
      // Sort sellers
      switch (filters.sortBy) {
        case 'distance':
          filteredSellers.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
          break;
        case 'rating':
          filteredSellers.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
          break;
        case 'name':
          filteredSellers.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
      
      setSellers(filteredSellers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      searchSellersData();
    }
  }, [location, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (!location) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Getting your location...</p>
          <p className="text-sm text-gray-500 mt-2">Please enable location services to find nearby sellers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Find Local Sellers</h1>
          <p className="text-gray-700 text-lg">
            Discover trusted sellers near you in {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <FilterSection onFilterChange={handleFilterChange} filters={filters} />
            </div>
          </div>

          {/* Seller Listing */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Searching for sellers...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            ) : sellers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No sellers found</h3>
                <p className="text-gray-600">Try adjusting your filters or expanding your search area.</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {sellers.length} seller{sellers.length !== 1 ? 's' : ''} found
                  </h2>
                  <div className="text-sm text-gray-600">
                    Showing results sorted by {filters.sortBy === 'distance' ? 'distance' : filters.sortBy === 'rating' ? 'rating' : 'name'}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sellers.map((seller) => (
                    <SellerCard key={seller.id} seller={seller} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerListing; 