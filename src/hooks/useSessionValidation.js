import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook for session validation
 * Checks if user session is valid and account is not banned
 */
export const useSessionValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [sessionValid, setSessionValid] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Validate current user session
   */
  const validateSession = async () => {
    try {
      const userString = sessionStorage.getItem('user');
      if (!userString) {
        setSessionValid(false);
        setError('No user session found');
        return false;
      }

      const user = JSON.parse(userString);
      setIsValidating(true);
      setError(null);

      const response = await axios.post('http://localhost/backend/validate_session.php', {
        user: user
      });

      if (response.data.success) {
        setSessionValid(true);
        return true;
      } else {
        setSessionValid(false);
        setError(response.data.message);
        
        // If account is banned, clear session and redirect to login
        if (response.data.error_type === 'account_banned') {
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('seller_id');
          window.dispatchEvent(
            new CustomEvent('userStateChanged', {
              detail: { action: 'logout' }
            })
          );
        }
        
        return false;
      }
    } catch (error) {
      console.error('Session validation error:', error);
      setSessionValid(false);
      setError('Failed to validate session');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Check if user is logged in
   */
  const isLoggedIn = () => {
    const userString = sessionStorage.getItem('user');
    return userString !== null;
  };

  /**
   * Get current user data
   */
  const getCurrentUser = () => {
    try {
      const userString = sessionStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('seller_id');
    setSessionValid(false);
    setError(null);
    window.dispatchEvent(
      new CustomEvent('userStateChanged', {
        detail: { action: 'logout' }
      })
    );
  };

  return {
    isValidating,
    sessionValid,
    error,
    validateSession,
    isLoggedIn,
    getCurrentUser,
    logout
  };
};





