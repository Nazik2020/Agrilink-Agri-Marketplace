import React from 'react';
import SimpleWishlistButton from './SimpleWishlistButton';

// Example of how to add wishlist functionality to existing product cards
const ProductCardWithWishlist = ({ product }) => {
  const handleWishlistChange = (isInWishlist, productId) => {
    console.log(`Product ${productId} ${isInWishlist ? 'added to' : 'removed from'} wishlist`);
    // You can add any additional logic here, like updating a wishlist count in the navbar
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="relative">
        {/* Product Image */}
        <img
          src={product.product_images ? JSON.parse(product.product_images)[0] : '/placeholder.jpg'}
          alt={product.product_name}
          className="w-full h-32 object-cover rounded-t-lg"
        />
        
        {/* Wishlist Button - positioned in top-right corner */}
        <div className="absolute top-2 right-2">
          <SimpleWishlistButton 
            productId={product.id} 
            className="bg-white rounded-full p-2 shadow-md hover:shadow-lg"
            onWishlistChange={handleWishlistChange}
          />
        </div>
      </div>
      
      {/* Product Info */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.product_name}</h3>
        <p className="text-gray-600 text-sm mt-1">{product.product_description}</p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex flex-col">
            {product.effective_price && parseFloat(product.effective_price) !== parseFloat(product.price) ? (
              <div className="flex items-center gap-2">
                <span className="text-lg text-gray-500 line-through">${parseFloat(product.price).toFixed(2)}</span>
                <span className="text-xl font-bold text-green-600">${parseFloat(product.effective_price).toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-green-600">${parseFloat(product.price).toFixed(2)}</span>
            )}
          </div>
          {product.special_offer && product.special_offer !== 'No Special Offer' && (
            <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
              {product.special_offer}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCardWithWishlist; 