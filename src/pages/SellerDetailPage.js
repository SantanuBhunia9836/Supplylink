import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSellerProducts } from '../services/api';

const SellerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for development
  const mockSeller = {
    id: parseInt(id),
    name: 'Fresh Grocery Store',
    businessType: 'Grocery Store',
    description: 'Your trusted neighborhood grocery store providing fresh vegetables, dairy products, and organic items. We source directly from local farmers to ensure the highest quality products.',
    city: 'Kolkata',
    state: 'West Bengal',
    address: '123 Main Street, Kolkata, West Bengal 700001',
    phone: '+91 98765 43210',
    email: 'contact@freshgrocery.com',
    rating: '4.5',
    totalReviews: 127,
    distance: '2.1',
    specialties: ['Fresh Vegetables', 'Dairy Products', 'Organic Items', 'Beverages'],
    openingHours: {
      monday: '8:00 AM - 9:00 PM',
      tuesday: '8:00 AM - 9:00 PM',
      wednesday: '8:00 AM - 9:00 PM',
      thursday: '8:00 AM - 9:00 PM',
      friday: '8:00 AM - 9:00 PM',
      saturday: '8:00 AM - 8:00 PM',
      sunday: '9:00 AM - 7:00 PM'
    },
    coordinates: {
      latitude: 22.5726,
      longitude: 88.3639
    }
  };

  const mockProducts = [
    {
      id: 1,
      name: 'Fresh Tomatoes',
      category: 'Vegetables',
      price: 40,
      unit: 'kg',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'
    },
    {
      id: 2,
      name: 'Organic Milk',
      category: 'Dairy',
      price: 60,
      unit: 'liter',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'
    },
    {
      id: 3,
      name: 'Fresh Spinach',
      category: 'Vegetables',
      price: 30,
      unit: 'bunch',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'
    },
    {
      id: 4,
      name: 'Carrots',
      category: 'Vegetables',
      price: 35,
      unit: 'kg',
      inStock: false,
      image: 'https://images.unsplash.com/photo-1447175008436-170170e7900e?w=400'
    },
    {
      id: 5,
      name: 'Fresh Eggs',
      category: 'Dairy',
      price: 120,
      unit: 'dozen',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1569288063648-5bb0a565d2a8?w=400'
    },
    {
      id: 6,
      name: 'Onions',
      category: 'Vegetables',
      price: 25,
      unit: 'kg',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba654?w=400'
    }
  ];

  useEffect(() => {
    const loadSellerData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, using mock data. Replace with actual API call:
        // const sellerData = await getSellerDetails(id);
        // const productsData = await getSellerProducts(factoryId, sellerId);
        
        setSeller(mockSeller);
        setProducts(mockProducts);
      } catch (err) {
        setError('Failed to load seller details');
      } finally {
        setLoading(false);
      }
    };

    loadSellerData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seller details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 text-red-400 mx-auto mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium hover:scale-105 transition-transform duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Sellers
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Seller Header */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{seller.name}</h1>
                    <p className="text-lg text-gray-600">{seller.businessType}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(parseFloat(seller.rating)) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {seller.rating} ({seller.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{seller.distance} km away</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{seller.description}</p>

              {/* Specialties */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Specialties:</h3>
                <div className="flex flex-wrap gap-2">
                  {seller.specialties.map((specialty, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1 overflow-hidden">
                      <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image';
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ₹{product.price}/{product.unit}
                          </span>
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                            product.inStock 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Information */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">{seller.address}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700">{seller.phone}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{seller.email}</span>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Opening Hours</h3>
              <div className="space-y-2">
                {Object.entries(seller.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-700 capitalize">{day}</span>
                    <span className="text-gray-600">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-gray-600">Map View</p>
                  <p className="text-sm text-gray-500">Coordinates: {seller.coordinates.latitude}, {seller.coordinates.longitude}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDetailPage; 