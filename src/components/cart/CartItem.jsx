import React from 'react';
import { Minus, Plus, User, Trash2 } from 'lucide-react';
import { useCart } from '../../components/cart/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) { // Default max quantity
      updateQuantity(item.product_id, newQuantity);
    }
  };

  const totalPrice = parseFloat(item.price) * item.quantity;

  // Get product image
  const getProductImage = (productImages) => {
    if (!productImages) {
      return "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop";
    }

    try {
      const images = JSON.parse(productImages);
      return images.length > 0
        ? images[0] // Use the full URL from backend
        : "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop";
    } catch (error) {
      console.error("Error parsing product images:", error);
      return "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={getProductImage(item.product_images)}
            alt={item.product_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.product_name}</h3>
              
              <div className="flex items-center text-gray-600 mb-2">
                <User className="w-4 h-4 mr-1" />
                <span className="text-sm">Sold by {item.seller_name || "Unknown Seller"}</span>
              </div>
              
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                {item.category || "Product"}
              </span>
              
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-3">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
                      min="1"
                      max="10"
                    />
                    
                    <button
                      onClick={() => handleQuantityChange(item.quantity + 1)}
                      disabled={item.quantity >= 10}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">(Max: 10)</span>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="flex items-center text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">${totalPrice.toFixed(2)}</div>
              <div className="text-sm text-gray-500">${parseFloat(item.price).toFixed(2)} per item</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;