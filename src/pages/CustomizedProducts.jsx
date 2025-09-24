import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizedProductsSection from '../components/RequestCustomization/CustomizedProductsSection';
import Footer from '../components/common/Footer';

// Helper to get current user from sessionStorage
function getCurrentUser() {
  try {
    const userString = sessionStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    return null;
  }
}

const CustomizedProducts = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'customer') {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">My Customized Products</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {currentUser.full_name || currentUser.username}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CustomizedProductsSection customerId={currentUser.id} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomizedProducts;



