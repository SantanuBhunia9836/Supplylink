import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import SellerDashboard from "../components/seller/SellerDashboard";

// Import page components for the 'shop' role
import ShopOverview from "./dashboard/ShopOverview";
import CreateOrder from "./dashboard/CreateOrder";
import ShopOrders from "./dashboard/ShopOrders";
import LoadingSpinner from "../components/common/LoadingSpinner"; // Import a loader

const Dashboard = () => {
  const { user, authLoading } = useContext(AuthContext);
  const location = useLocation();

  // While the authentication status is being checked, show a loading indicator.
  // This prevents trying to access `user` when it is null.
  if (authLoading) {
    return <LoadingSpinner text="Loading dashboard..." isFullScreen={true} />;
  }

  // If loading is finished and there's still no user, redirect to the homepage.
  if (!user) {
    return <Navigate to="/" />;
  }

  // If the user is a seller, render the dedicated SellerDashboard component.
  // This component is self-contained and manages its own layout.
  if (user.is_seller) {
    return <SellerDashboard />;
  }

  // --- The following layout is ONLY for the 'shop' role ---
  const getCurrentShopPage = () => {
    const path = location.pathname;
    if (path.includes("/create-order")) return "create-order";
    if (path.includes("/orders")) return "orders";
    return "overview";
  };

  const getPageTitle = () => {
    switch (getCurrentShopPage()) {
      case "create-order":
        return "Create Order";
      case "orders":
        return "My Orders";
      default:
        return "Overview";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activePage={getCurrentShopPage()} />
      <div className="flex-1 flex flex-col">
        <Header pageTitle={getPageTitle()} />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<ShopOverview />} />
            <Route path="/overview" element={<ShopOverview />} />
            <Route path="/create-order" element={<CreateOrder />} />
            <Route path="/orders" element={<ShopOrders />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
