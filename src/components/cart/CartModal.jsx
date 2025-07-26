import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../../components/cart/CartContext';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';

const CartModal = () => {
  const { isOpen, items, toggleCart, clearCart, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-100"
        onClick={toggleCart}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
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
            <p className="text-gray-500 text-sm">{totalItems} items in your cart</p>
          </div>
          
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-140px)]">
          {/* Cart Items */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96 border-l border-gray-200">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;