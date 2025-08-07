// src/pages/dashboard/ShopOverview.js
import React, { useState, useEffect } from 'react';
import { getShopDashboardData } from '../../services/api';
import Skeleton from '../../components/common/Skeleton'; // Import Skeleton

// Create a new component for the loading state
const ShopOverviewLoading = () => (
  <div className="space-y-6">
    {/* Welcome Section Skeleton */}
    <Skeleton className="h-24 w-full" />

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
    </div>

    {/* Recent Orders Skeleton */}
    <div className="bg-white p-6 rounded-lg shadow">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  </div>
);

const ShopOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getShopDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Use the new skeleton component for the loading state
  if (isLoading) return <ShopOverviewLoading />;

  // ... (the rest of your component remains the same)
  return (
    <div className="space-y-6">
      {/* ... */}
    </div>
  );
};

export default ShopOverview;