import React, { useState, useEffect } from "react";
import { Package, Loader, AlertCircle, RefreshCw } from "lucide-react";
import axios from "axios";
import authService from "../../../services/AuthService";

const OrderHistoryPage = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Get customer ID from AuthService
  const getCustomerId = () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && (currentUser.role === "customer" || currentUser.user_type === "customer")) {
      return currentUser.id;
    }
    return null;
  };


  const testServerConnection = async () => {
    const testUrls = [
      "http://localhost/Agrilink-Agri-Marketplace/backend/test_server.php",
      "http://localhost:8080/backend/test_server.php",
      "http://127.0.0.1:8080/backend/test_server.php", // 127.0.0.1 as fallback
    ];

    for (const url of testUrls) {
      try {
        console.log(`🔍 Testing connection to: ${url}`);
        const response = await axios.get(url, { timeout: 3000 }); // 3 second timeout
        if (response.data.success) {
          console.log(`✅ Server connected successfully at: ${url}`);
          return url.replace("/test_server.php", "");
        }
      } catch (err) {
        console.log(`❌ Failed to connect to: ${url} - ${err.message}`);
      }
    }
    return null;
  };

  // Fetch orders from backend - NOW USING REAL API
  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const customerId = getCustomerId();
      console.log("👤 Customer ID:", customerId);

      // Check if customer ID is available
      if (!customerId) {
        setError("Please login as a customer to view your order history.");
        setLoading(false);
        return;
      }

      // Use the fast, working API endpoint
      const apiUrl =
        "http://localhost/Agrilink-Agri-Marketplace/backend/order_history/orders.php";
      console.log("📡 Fetching orders from:", apiUrl);

      const response = await axios.post(
        apiUrl,
        { customer_id: customerId },
        {
          timeout: 15000, // Increased timeout to 15 seconds for large responses
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("📦 API Response:", response.data);

      if (response.data.success) {
        // Format the data for your UI - use 'orders' not 'data'
        const formattedOrders = response.data.orders.map((order) => ({
          productId: order.product_id,
          orderId: order.order_id,
          productName: order.product_name,
          date: order.created_at,
          quantity: parseInt(order.quantity) || 0,
          totalAmount: parseFloat(order.total_amount) || 0,
          status: order.order_status,
          paymentStatus: order.payment_status,
          paymentMethod: order.payment_method,
          orderNumber: order.order_number,
        }));

        setOrderItems(formattedOrders);
        setError(null);
        return;
      } else {
        setError(response.data.message || "Failed to fetch orders");
        setOrderItems([]);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to fetch orders");
      setOrderItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh orders
  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders(false);
  };

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Package className="text-green-600" size={32} />
          <h2 className="text-3xl font-bold text-green-600">Order History</h2>
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
            {orderItems.length} items
          </span>
          {/* Debug: Show current customer ID */}
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
            Customer ID: {getCustomerId() || "Not logged in"}
          </span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your order history...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Server Connection Error
            </h3>
            <p className="text-red-600 mb-4">{error}</p>

            {error.includes("PHP server") && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  🔧 Quick Fix:
                </h4>
                <ol className="text-left text-yellow-700 text-sm space-y-1">
                  <li>1. Open Command Prompt as Administrator</li>
                  <li>
                    2. Navigate to:{" "}
                    <code className="bg-yellow-100 px-1 rounded">
                      d:\Documents\GitHub\Agrilink-Agri-Marketplace
                    </code>
                  </li>
                  <li>
                    3. Run:{" "}
                    <code className="bg-yellow-100 px-1 rounded">
                      php -S localhost:8080
                    </code>
                  </li>
                  <li>4. Click "Try Again" below</li>
                </ol>
              </div>
            )}

            <div className="space-x-2">
              <button
                onClick={() => fetchOrders()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() =>
                  window.open("/php_server_manager.html", "_blank")
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Server Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && orderItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Orders Yet
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't placed any orders yet. Start shopping to see your order
            history here!
          </p>
          <button
            onClick={() => (window.location.href = "/marketplace")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* Orders Table - Only show when not loading and have orders */}
      {!loading && !error && orderItems.length > 0 && (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-green-100">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Product ID
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Product Name
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-50">
                {orderItems.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-green-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm font-medium">
                        {item.productId}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-sm font-medium">
                        {item.orderId}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {item.productName}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-green-600">
                      $
                      {typeof item.totalAmount === "number"
                        ? item.totalAmount.toFixed(2)
                        : parseFloat(item.totalAmount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {orderItems.map((item, index) => (
              <div
                key={index}
                className="bg-green-50 rounded-lg p-4 border border-green-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium mr-2">
                      {item.productId}
                    </span>
                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-medium">
                      {item.orderId}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    ${item.totalAmount.toFixed(2)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.productName}
                </h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderHistoryPage;
