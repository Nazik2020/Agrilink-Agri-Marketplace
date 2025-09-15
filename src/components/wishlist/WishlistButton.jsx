import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from './WishlistContext';

const WishlistButton = ({ productId, className = "" }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist, loading } = useWishlist();
  const [localLoading, setLocalLoading] = useState(false);

  const handleWishlistToggle = async () => {
    setLocalLoading(true);
    
    try {
      const isInWishlistState = isInWishlist(productId);
      
      if (isInWishlistState) {
        const result = await removeFromWishlist(productId);
        if (result.success) {
          console.log('Removed from wishlist:', result.message);
        } else {
          console.error('Failed to remove from wishlist:', result.message);
        }
      } else {
        const result = await addToWishlist(productId);
        if (result.success) {
          console.log('Added to wishlist:', result.message);
        } else {
          console.error('Failed to add to wishlist:', result.message);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const isInWishlistState = isInWishlist(productId);
  const isLoading = loading || localLoading;

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={isLoading}
      className={`wishlist-button ${className} ${
        isInWishlistState 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
      } transition-colors duration-200 disabled:opacity-50`}
      title={isInWishlistState ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        size={20} 
        className={`transition-all duration-200 ${
          isInWishlistState ? 'fill-current' : 'fill-none'
        }`}
      />
    </button>
  );
};

export default WishlistButton; 