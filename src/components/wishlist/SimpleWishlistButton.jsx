import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';

const SimpleWishlistButton = ({ productId, className = "", onWishlistChange }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get user info from localStorage
  const getUser = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    return null;
  };

  // Get guest wishlist from localStorage
  const getGuestWishlist = () => {
    try {
      return JSON.parse(localStorage.getItem('guestWishlist') || '[]');
    } catch (error) {
      console.error('Error parsing guest wishlist:', error);
      return [];
    }
  };

  // Save guest wishlist to localStorage
  const saveGuestWishlist = (productIds) => {
    localStorage.setItem('guestWishlist', JSON.stringify(productIds));
  };

  // Check if product is in wishlist
  const checkWishlistStatus = () => {
    const user = getUser();
    
    if (user && user.role === 'customer') {
      // For logged-in users, you might want to check against the database
      // For now, we'll use a simple approach
      return false;
    } else {
      // Guest user
      const guestWishlist = getGuestWishlist();
      return guestWishlist.includes(productId);
    }
  };

  // Initialize wishlist status
  React.useEffect(() => {
    setIsInWishlist(checkWishlistStatus());
  }, [productId]);

  const handleWishlistToggle = async () => {
    setLoading(true);
    
    try {
      const user = getUser();
      
      if (user && user.role === 'customer') {
        // Logged-in customer
        const endpoint = isInWishlist ? 'remove_from_wishlist.php' : 'add_to_wishlist.php';
        const data = isInWishlist 
          ? { productId, customerId: user.id }
          : { productId, customerId: user.id };

        const response = await axios.post(`http://localhost/backend/${endpoint}`, data);
        
        if (response.data.success) {
          setIsInWishlist(!isInWishlist);
          if (onWishlistChange) {
            onWishlistChange(!isInWishlist, productId);
          }
        }
      } else {
        // Guest user
        const guestWishlist = getGuestWishlist();
        
        if (isInWishlist) {
          // Remove from wishlist
          const updatedWishlist = guestWishlist.filter(id => id !== productId);
          saveGuestWishlist(updatedWishlist);
          setIsInWishlist(false);
        } else {
          // Add to wishlist
          if (!guestWishlist.includes(productId)) {
            const updatedWishlist = [...guestWishlist, productId];
            saveGuestWishlist(updatedWishlist);
            setIsInWishlist(true);
          }
        }
        
        if (onWishlistChange) {
          onWishlistChange(!isInWishlist, productId);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={loading}
      className={`wishlist-button ${className} ${
        isInWishlist 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
      } transition-colors duration-200 disabled:opacity-50`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        size={20} 
        className={`transition-all duration-200 ${
          isInWishlist ? 'fill-current' : 'fill-none'
        } ${loading ? 'animate-pulse' : ''}`}
      />
    </button>
  );
};

export default SimpleWishlistButton; 