import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutAllCustomers } from '../utils/authSession';

export default function ForceLogout() {
  useEffect(() => {
    // Call backend logout first to destroy PHP session
    const backendLogout = async () => {
      try {
        await fetch("http://localhost/Agrilink-Agri-Marketplace/backend/logout.php", {
          method: "POST",
          credentials: "include",
        });
      } catch (e) {
        // Ignore network errors, continue with client logout
      }
      
      // Clear ALL client storage
      logoutAllCustomers();
      
      // Force a complete reload to home, which will reset React state
      window.location.href = '/';
    };
    
    backendLogout();
    
    return () => {}; // Cleanup function
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-700">Logging out...</h2>
        <p className="text-gray-500 mt-2">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}