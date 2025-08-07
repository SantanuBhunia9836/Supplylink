// src/components/seller/ProductList.js
import React from 'react';

// --- Helper & Icon Components ---
const PlusIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TrashIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

const ProductList = ({ products, onProductChange, onAddProduct, onRemoveProduct }) => {
    const inputStyles = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500";
    const quantityUnitOptions = ['unit', 'kilogram', 'gram', 'liter', 'piece', 'dozen'];
    const categoryOptions = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Grains', 'Spices', 'Beverages', 'Other'];

    return (
        <div>
            {products.map((product, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg mb-4 relative">
                    <div className="md:col-span-2 flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Product {index + 1}</h3>
                        {products.length > 1 && (
                            <button type="button" onClick={() => onRemoveProduct(index)} className="text-red-500 hover:text-red-700">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" value={product.name} onChange={(e) => onProductChange(index, 'name', e.target.value)} required className={inputStyles}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select value={product.category} onChange={(e) => onProductChange(index, 'category', e.target.value)} required className={inputStyles}>
                            {categoryOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea value={product.description} onChange={(e) => onProductChange(index, 'description', e.target.value)} required className={inputStyles}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" value={product.price} onChange={(e) => onProductChange(index, 'price', e.target.value)} required className={inputStyles}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                        <input type="number" value={product.stock_quantity} onChange={(e) => onProductChange(index, 'stock_quantity', e.target.value)} required className={inputStyles}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity Unit</label>
                        <select value={product.qunatity_unit} onChange={(e) => onProductChange(index, 'qunatity_unit', e.target.value)} required className={inputStyles}>
                            {quantityUnitOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                    </div>
                </div>
            ))}
            <button type="button" onClick={onAddProduct} className="w-full flex justify-center items-center py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 hover:border-gray-400 mb-6">
                <PlusIcon className="w-5 h-5 mr-2"/> Add Another Product
            </button>
        </div>
    );
};

export default ProductList;
