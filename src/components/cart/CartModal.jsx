import React from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "../../components/cart/CartContext";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";
import BuyNowModal from "../marketplace/BuyNowModal";

const CartModal = () => {
  const {
    isOpen,
    items,
    loading,
    toggleCart,
    clearCart,
    totalItems,
    showBuyNowModal,
    toggleBuyNowModal,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      <div className="absolute inset-0 bg-gray-100" onClick={toggleCart} />

      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <button
            onClick={toggleCart}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
            <p className="text-gray-500 text-sm">
              {totalItems} items in your cart
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 font-medium"
            disabled={loading || items.length === 0}
          >
            Clear Cart
          </button>
        </div>

        
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-140px)]">
          
          <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="animate-spin h-8 w-8 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">Loading your cart...</p>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Add some products to get started
                </p>
                <button
                  onClick={toggleCart}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item, index) => (
                  <CartItem
                    key={
                      item.cart_item_id ||
                      `cart-item-${item.product_id}-${index}`
                    }
                    item={item}
                  />
                ))}
              </div>
            )}
          </div>

          
          <div className="lg:w-96 border-l border-gray-200">
            <OrderSummary />
          </div>
        </div>
      </div>

      
      <BuyNowModal
        isOpen={showBuyNowModal}
        onClose={toggleBuyNowModal}
        product={null} // We'll need to modify BuyNowModal to handle cart checkout
        quantity={1}
        isCartCheckout={true}
      />
    </div>
  );
};

export default CartModal;
