// src/components/seller/AddProductForm.js
import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiCreateProducts } from "../../services/api";
import ProductList from "./ProductList"; // The reusable form fields
import LoadingSpinner from "../common/LoadingSpinner";

// A reusable modal component to wrap our forms
const Modal = ({ children, title, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>
      </div>
      <div className="p-6 overflow-y-auto">{children}</div>
    </div>
  </div>
);

const AddProductForm = ({ onComplete, onClose }) => {
  const [products, setProducts] = useState([
    {
      name: "",
      category: "Vegetables",
      description: "",
      price: "",
      stock_quantity: "",
      qunatity_unit: "kg",
    },
  ]);
  const [loading, setLoading] = useState(false);

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
        category: "Vegetables",
        description: "",
        price: "",
        stock_quantity: "",
        qunatity_unit: "kg",
      },
    ]);
  };

  const handleRemoveProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Basic validation
      for (const p of products) {
        if (!p.name || !p.price || !p.stock_quantity) {
          throw new Error("Please fill all required fields for each product.");
        }
      }
      // Reformat for API
      const productData = products.map((p) => ({
        ...p,
        price: parseFloat(p.price),
        stock_quantity: parseInt(p.stock_quantity, 10),
      }));

      await apiCreateProducts(productData);
      toast.success("Products added successfully!");
      onComplete(); // This will close the modal and refresh the dashboard
    } catch (err) {
      toast.error(err.message || "Failed to add products.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add New Products" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ProductList
          products={products}
          onProductChange={handleProductChange}
          onAddProduct={handleAddProduct}
          onRemoveProduct={handleRemoveProduct}
        />
        <div className="flex justify-end pt-4 border-t mt-4">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
          >
            {loading ? <LoadingSpinner /> : "Save Products"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductForm;
