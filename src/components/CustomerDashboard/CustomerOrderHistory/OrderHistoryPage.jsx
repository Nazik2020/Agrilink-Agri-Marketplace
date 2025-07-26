import React, { useState } from 'react';
import { Package } from 'lucide-react';

const OrderHistoryPage = () => {
  const [orderItems] = useState([
    {
      productId: 'PRD-001',
      orderId: 'ORD-001',
      productName: 'Organic Tomatoes',
      date: '2024-01-15',
      quantity: 2,
      totalAmount: 24.99
    },
    {
      productId: 'PRD-002',
      orderId: 'ORD-001',
      productName: 'Fresh Spinach',
      date: '2024-01-15',
      quantity: 1,
      totalAmount: 18.50
    },
    {
      productId: 'PRD-003',
      orderId: 'ORD-002',
      productName: 'Premium Carrots',
      date: '2024-01-12',
      quantity: 1,
      totalAmount: 16.75
    },
    {
      productId: 'PRD-004',
      orderId: 'ORD-002',
      productName: 'Organic Lettuce',
      date: '2024-01-12',
      quantity: 2,
      totalAmount: 14.25
    },
    {
      productId: 'PRD-005',
      orderId: 'ORD-003',
      productName: 'Fresh Herbs Mix',
      date: '2024-01-08',
      quantity: 1,
      totalAmount: 32.00
    },
    {
      productId: 'PRD-006',
      orderId: 'ORD-004',
      productName: 'Organic Broccoli',
      date: '2024-01-05',
      quantity: 1,
      totalAmount: 15.50
    },
    {
      productId: 'PRD-007',
      orderId: 'ORD-004',
      productName: 'Sweet Peppers',
      date: '2024-01-05',
      quantity: 1,
      totalAmount: 13.25
    }
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Package className="text-green-600" size={32} />
        <h2 className="text-3xl font-bold text-green-600">Order History</h2>
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
          {orderItems.length} items
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-green-100">
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Product ID</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Order ID</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Product Name</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
              <th className="text-center py-4 px-4 font-semibold text-gray-700">Quantity</th>
              <th className="text-right py-4 px-4 font-semibold text-gray-700">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-green-50 transition-colors duration-200">
                <td className="py-4 px-4">
                  <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {item.productId}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="font-mono text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {item.orderId}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="font-medium text-gray-800">{item.productName}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-600">{new Date(item.date).toLocaleDateString()}</span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {item.quantity}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-lg font-bold text-green-600">${item.totalAmount.toFixed(2)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {orderItems.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {item.productId}
                  </span>
                  <span className="font-mono text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {item.orderId}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">{item.productName}</h3>
              </div>
              <span className="text-xl font-bold text-green-600">${item.totalAmount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{new Date(item.date).toLocaleDateString()}</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                Qty: {item.quantity}
              </span>
            </div>
          </div>
        ))}
      </div>

      {orderItems.length === 0 && (
        <div className="text-center py-16">
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No order history</h3>
          <p className="text-gray-500">When you place orders, your purchase history will appear here</p>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;