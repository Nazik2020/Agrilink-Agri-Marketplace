import React, { useEffect, useState } from 'react';
import { API_CONFIG } from '../../../config/api';

const PriceListTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sellerId = window.localStorage.getItem('seller_id') || 1;
    fetch(`${API_CONFIG.BASE_URL}/seller_analytics/get_todays_price_list.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seller_id: sellerId })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.price_list)) {
          setRows(data.price_list);
          setError(null);
        } else {
          setRows([]);
          setError('No sales found for today');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load today\'s price list');
        setLoading(false);
      });
  }, []);

  const formatCurrency = (n) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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
            {loading && (
              <tr>
                <td className="px-6 py-4 text-sm text-gray-600" colSpan={4}>Loading...</td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td className="px-6 py-4 text-sm text-gray-600" colSpan={4}>{error || 'No sales today'}</td>
              </tr>
            )}
            {!loading && rows.map((item) => (
              <tr key={item.product_id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.product_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(item.unit_price)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.total_quantity}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">{formatCurrency(item.total_amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceListTable;