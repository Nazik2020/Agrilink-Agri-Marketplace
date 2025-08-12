import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSessionValidation } from '../../hooks/useSessionValidation';

/**
 * Protected Route Component
 * Validates user session and prevents banned users from accessing protected routes
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isValidating, sessionValid, error, validateSession, isLoggedIn, getCurrentUser } = useSessionValidation();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      if (!isLoggedIn()) {
        setIsChecking(false);
        return;
      }

      const user = getCurrentUser();
      
      // Check role-based access
      if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        setIsChecking(false);
        return;
      }

      // Validate session with backend
      await validateSession();
      setIsChecking(false);
    };

    checkAccess();
  }, [location.pathname]);

  // Show loading while checking
  if (isChecking || isValidating) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">Validating session...</span>
      </div>
    );
  }

  // Redirect to login if not logged in
  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show error message if session is invalid
  if (!sessionValid) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Access Denied
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error || 'Your session is invalid. Please log in again.'}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.href = '/login'}
                  className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render children if everything is valid
  return children;
};

export default ProtectedRoute;










