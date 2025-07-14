import React from 'react';

const PriceListTable = () => {
  const products = [
    {
      product: "Organic Apples",
      price: "$2.50/lb",
      quantity: "200 lbs",
      total: "$500"
    },
    {
      product: "Fresh Tomatoes",
      price: "$1.20/lb",
      quantity: "300 lbs",
      total: "$360"
    },
    {
      product: "Free-Range Eggs",
      price: "$3.00/dozen",
      quantity: "100 dozen",
      total: "$300"
    },
    {
      product: "Local Honey",
      price: "$8.00/jar",
      quantity: "50 jars",
      total: "$400"
    },
    {
      product: "Artisan Cheese",
      price: "$15.00/lb",
      quantity: "40 lbs",
      total: "$600"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-700">Product</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-700">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-700">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-green-700">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.product}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.price}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.quantity}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">{product.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceListTable;