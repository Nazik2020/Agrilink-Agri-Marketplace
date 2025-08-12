import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from './WishlistContext';

const SimpleWishlistButton = ({ productId, className = "" }) => {
  const [loading, setLoading] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const handleWishlistToggle = async () => {
    setLoading(true);
    
    try {
      if (isInWishlist(productId)) {
        // Remove from wishlist
        await removeFromWishlist(productId);
      } else {
        // Add to wishlist
        await addToWishlist(productId);
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
        isInWishlist(productId)
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
      } transition-colors duration-200 disabled:opacity-50`}
      title={isInWishlist(productId) ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        size={20} 
        className={`transition-all duration-200 ${
          isInWishlist(productId) ? 'fill-current' : 'fill-none'
        } ${loading ? 'animate-pulse' : ''}`}
      />
    </button>
  );
};

export default SimpleWishlistButton; 