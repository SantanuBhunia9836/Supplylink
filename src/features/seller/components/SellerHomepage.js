// src/components/seller/SellerHomepage.js
import React, { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";


const StatCard = ({ title, value, icon: Icon, color }) => (
  <div
    className={`bg-gray-50 p-5 rounded-xl border border-gray-200 flex items-center space-x-4 shadow-sm`}
  >
    <div className={`p-3 rounded-full bg-opacity-20 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);


// Icon components for the stat cards
const PackageIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
  <line x1="12" y1="22.08" x2="12" y2="12"></line>
</svg>
);

const ShoppingBagIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
  <line x1="3" y1="6" x2="21" y2="6"></line>
  <path d="M16 10a4 4 0 0 1-8 0"></path>
</svg>
);

const TruckIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
  <rect x="1" y="3" width="15" height="13"></rect>
  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
  <circle cx="5.5" cy="18.5" r="2.5"></circle>
  <circle cx="18.5" cy="18.5" r="2.5"></circle>
</svg>
);

const SellerHomepage = ({ profile }) => {
  const { user } = useContext(AuthContext);
  const productCount = profile?.products?.length || 0;
  // These are placeholders until the features are built
  const orderCount = 0;
  const deliveryCount = 0;

  const possibleNames = [
    user?.name,
    user?.businessName,
    user?.full_name,
    user?.first_name,
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
    user?.username,
    user?.email?.split("@")[0],
  ].filter(Boolean);
  const displayName = possibleNames[0] || "Seller";


  return (
    <div>
     <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Welcome back, {displayName}!
      </h2>
      <p className="text-gray-500 mb-8">
        Here's a quick overview of your store's activity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Active Products" value={productCount} icon={PackageIcon} color="text-blue-600 bg-blue-100" />
        <StatCard title="Open Orders" value={orderCount} icon={ShoppingBagIcon} color="text-green-600 bg-green-100" />
        <StatCard title="Pending Deliveries" value={deliveryCount} icon={TruckIcon} color="text-yellow-600 bg-yellow-100" />
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Next Steps</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Review your product listings to ensure they are up to date.</li>
          <li>Check the Orders tab for any new customer purchases.</li>
          <li>Prepare your delivery schedules for the upcoming week.</li>
        </ul>
      </div>
    </div>
  );
};

export default SellerHomepage;
