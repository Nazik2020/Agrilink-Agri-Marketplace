import React from 'react';
import WishlistButton from './WishlistButton';

// Example of how to use WishlistButton in a product card
const ProductCardExample = ({ product }) => {
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
          <WishlistButton 
            productId={product.id} 
            className="bg-white rounded-full p-2 shadow-md hover:shadow-lg"
          />
        </div>
      </div>
      
      {/* Product Info */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.product_name}</h3>
        <p className="text-gray-600 text-sm mt-1">{product.product_description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-xl font-bold text-green-600">${product.price}</span>
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

export default ProductCardExample; 