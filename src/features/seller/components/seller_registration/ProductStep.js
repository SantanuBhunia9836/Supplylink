import React, { useState } from "react";
import { apiCreateProducts } from "../../../../services/api"; // Corrected path
import ProductList from "../ProductList"; // Reusing the product fields component
import LoadingSpinner from "../../../../components/common/LoadingSpinner"; // Corrected path

// ... rest of the file remains the same ...

const ProductStep = ({ sellerId, factoryId, onComplete }) => {
  const [products, setProducts] = useState([
    {
      name: "",
      description: "",
      price: "",
      stock_quantity: "",
      qunatity_unit: "kg",
      category: "Vegetables",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        qunatity_unit: "kg",
        category: "Vegetables",
      },
    ]);
  };

  const handleRemoveProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const productsPayload = products.map((p) => {
        if (!p.name || !p.price || !p.stock_quantity) {
          throw new Error("Please fill all required fields for each product.");
        }
        return {
          ...p,
          seller_id: sellerId,
          factory_id: factoryId,
          price: parseFloat(p.price),
          stock_quantity: parseInt(p.stock_quantity, 10),
        };
      });
      await apiCreateProducts(productsPayload);
      onComplete(); // Signal completion to the parent
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Add Your Products
      </h3>
      <p className="text-gray-500 mb-6">
        Add one or more products to get started. You can add more later from
        your dashboard.
      </p>
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}
      <ProductList
        products={products}
        onProductChange={handleProductChange}
        onAddProduct={handleAddProduct}
        onRemoveProduct={handleRemoveProduct}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 mt-6"
      >
        {isLoading ? <LoadingSpinner /> : "Finish Registration"}
      </button>
    </form>
  );
};

export default ProductStep;
