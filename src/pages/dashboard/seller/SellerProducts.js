import React from 'react';

const SellerProducts = ({ products }) => (
    <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Products</h2>
        <p className="mb-6 text-gray-600">This section will allow you to add, edit, and manage your product listings. Full functionality is coming soon.</p>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Current Product Summary ({products?.length || 0})</h3>
            {products && products.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {products.map(p => (
                        <li key={p.id} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900">{p.name}</p>
                                <p className="text-sm text-gray-500">{p.category}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">₹{p.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">Stock: {p.stock_quantity} {p.qunatity_unit}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-center py-8">You haven't added any products yet.</p>
            )}
        </div>
    </div>
);

export default SellerProducts;
