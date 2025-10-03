import React, { useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext"; 
import { Home } from "lucide-react";

// Import the two distinct dashboard components
import SellerDashboard from "../../seller/components/SellerDashboard";
import VendorDashboard from "../../vendor/components/VendorDashboard"; // <-- Import the new component

/**
 * This component is the main router for all authenticated users.
 * It determines which dashboard to display based on the user's role,
 * acting as a mother component to SellerDashboard and VendorDashboard.
 */
const Dashboard = () => {
  const { user, authLoading } = useContext(AuthContext);

  // While checking authentication, show a full-screen loader.
  if (authLoading) return null;

  // If the check is complete and there's no user, redirect to the homepage.
  if (!user) {
    return <Navigate to="/" />;
  }
  
  // The main return wraps the specific dashboard with a global home button.
  return (
    <>
      {/* Floating Home Button to navigate to the main site homepage */}
      <Link 
        to="/" 
        title="Go to Home Page"
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform transform hover:scale-110"
      >
        <Home size={24} />
      </Link>

      {/* Render the correct dashboard based on the user's seller status. */}
      {user.is_seller ? <SellerDashboard /> : <VendorDashboard />}
    </>
  );
};

export default Dashboard;

