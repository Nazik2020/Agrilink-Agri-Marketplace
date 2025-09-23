"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import WithdrawModal from "./WithdrawModal";

const WalletOverview = () => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const [wallet, setWallet] = useState({
    products_sold: 0,
    total_earnings: 0,
    available_balance: 0,
    transaction_history: [],
    has_card_details: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerId, setSellerId] = useState(null);

  // Resolve seller id from localStorage, sessionStorage fallbacks
  useEffect(() => {
    const resolveSellerId = () => {
      try {
        const ls = window.localStorage.getItem("seller_id");
        if (ls) return ls;
        const sellerStr = window.sessionStorage.getItem("seller");
        if (sellerStr) {
          const seller = JSON.parse(sellerStr);
          if (seller && seller.id) return String(seller.id);
        }
        const userStr = window.sessionStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user && user.role === "seller" && user.id) return String(user.id);
        }
      } catch (_) {}
      return null;
    };
    setSellerId(resolveSellerId());

    const onUserStateChanged = (e) => {
      const { action, user } = e.detail || {};
      if (action === "login" && user?.role === "seller" && user?.id) {
        setSellerId(String(user.id));
      }
      if (action === "logout") {
        setSellerId(null);
        setWallet({
          products_sold: 0,
          total_earnings: 0,
          available_balance: 0,
          transaction_history: [],
          has_card_details: false,
        });
      }
    };
    window.addEventListener("userStateChanged", onUserStateChanged);
    return () =>
      window.removeEventListener("userStateChanged", onUserStateChanged);
  }, []);

  const fetchWallet = async () => {
    try {
      setError(null);
      if (!sellerId) {
        setLoading(false);
        setError("Missing seller ID. Please log in as a seller.");
        return;
      }
      const response = await axios.get(
        `http://localhost/Agrilink-Agri-Marketplace/backend/wallet/get_seller_wallet.php?seller_id=${sellerId}`
      );
      if (response.data.success) {
        setWallet({
          products_sold: response.data.products_sold,
          total_earnings: response.data.total_earnings,
          available_balance: response.data.available_balance,
          transaction_history: response.data.transaction_history || [],
          has_card_details: response.data.has_card_details || false,
        });
      } else {
        setError(response.data.error || "Failed to load wallet data");
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      setError("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
    // re-fetch when seller changes
  }, [sellerId]);

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-yellow-100 rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer">
          <h3 className="text-base font-medium text-gray-600 mb-2 text-center">
            Products sold
          </h3>
          <p className="text-2xl font-bold text-gray-900 text-center">
            {loading ? "..." : wallet.products_sold}
          </p>
        </div>
        <div className="bg-blue-100 rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer">
          <h3 className="text-base font-medium text-gray-600 mb-2 text-center">
            Total earnings
          </h3>
          <p className="text-2xl font-bold text-gray-900 text-center">
            {loading
              ? "..."
              : `$${Number(wallet.total_earnings).toLocaleString()}`}
          </p>
        </div>
        <div className="bg-green-100 rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer">
          <h3 className="text-base font-medium text-gray-600 mb-2 text-center">
            Available balance
          </h3>
          <p className="text-2xl font-bold text-gray-900 text-center">
            {loading
              ? "..."
              : `$${Number(wallet.available_balance).toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      {/* Card Status Warning */}
      {!loading && !wallet.has_card_details && wallet.available_balance > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Bank Details Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You need to save your Bank Account details before withdrawing
                  funds. Click "Withdraw Amount" to add your Bank Account
                  information.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Button */}
      <div className="mt-10 mb-10 flex justify-center">
        <button
          onClick={() => setIsWithdrawModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-100 shadow-sm hover:shadow-md hover:scale-105 cursor-pointer"
        >
          Withdraw Amount
        </button>
      </div>

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        availableBalance={wallet.available_balance}
        onWithdrawSuccess={fetchWallet}
      />

      {/* Transaction History Table */}
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Transaction History
        </h2>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-green-50">
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : wallet.transaction_history.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              wallet.transaction_history.map((tx, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-4">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{tx.type}</td>
                  <td
                    className={`py-2 px-4 font-bold ${
                      tx.amount < 0 ? "text-red-600" : "text-green-700"
                    }`}
                  >
                    {tx.amount < 0 ? "-" : ""}$
                    {Math.abs(tx.amount).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tx.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalletOverview;
