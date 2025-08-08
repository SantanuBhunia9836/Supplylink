import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails } from "../services/api";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProductData = async () => {
      if (!id) {
        setError("No product ID provided.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const productData = await getProductDetails(id);
        setProduct(productData);
      } catch (err) {
        setError(err.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [id]);

  const InfoCard = ({ label, value, className = "" }) => (
    <div className={`bg-gray-100 p-4 rounded-lg ${className}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800 capitalize">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-gray-200">
              <img
                src={`https://placehold.co/600x600/EBF4FF/76A9FA?text=${product.name.replace(
                  /\s/g,
                  "+"
                )}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 flex flex-col">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-xl text-gray-500 capitalize mb-6">
                {product.category}
              </p>

              <p className="text-gray-700 text-base mb-8 flex-grow">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <InfoCard
                  label="Price"
                  value={`₹${product.price} / ${product.qunatity_unit}`}
                />
                <InfoCard
                  label="Stock Status"
                  value={
                    product.stock_quantity > 0
                      ? `${product.stock_quantity} available`
                      : "Out of Stock"
                  }
                />
              </div>

              <button className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Add to Cart (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
