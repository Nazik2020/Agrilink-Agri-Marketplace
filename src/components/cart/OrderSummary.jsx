import React from 'react';
import { Receipt, Truck, CreditCard } from 'lucide-react';
import { useCart } from '../../components/cart/CartContext';

const OrderSummary = () => {
  const { totalItems, subtotal, shipping, tax, total, handleBuyNow } = useCart();

  return (
    <div className="p-6 bg-gray-50 h-full">
      <div className="sticky top-0">
        <div className="flex items-center mb-6">
          <Receipt className="w-5 h-5 mr-2 text-gray-600" />
          <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Items ({totalItems})</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>

        
          <hr className="border-gray-300" />

          <div className="flex justify-between items-center text-lg">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-green-600 text-xl">${total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          className="w-full bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-1 rounded-lg flex items-center justify-center mb-4"
          onClick={handleBuyNow}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Proceed to Checkout
        </button>

        <p className="text-xs text-gray-500 text-center">
          Secure checkout powered by AgriLink
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;