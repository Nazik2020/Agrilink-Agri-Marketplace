"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { X } from "lucide-react";

const WithdrawModal = ({
  isOpen,
  onClose,
  availableBalance,
  onWithdrawSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [bankAccounts, setBankAccounts] = useState([]);
  const [bankAccount, setBankAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [hasCardDetails, setHasCardDetails] = useState(false);
  const seller_id = localStorage.getItem("seller_id");

  // Format card number with spaces every 4 digits and restrict to 16 digits
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    value = value.slice(0, 16); // Restrict to 16 digits
    // Add space every 4 digits
    value = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(value);
  };

  useEffect(() => {
    if (isOpen && seller_id) {
      // Get bank accounts first
      axios
        .get(
          `http://localhost/Agrilink-Agri-Marketplace/backend/wallet/get_bank_accounts.php?seller_id=${seller_id}`
        )
        .then((res) => {
          if (res.data.success) {
            setBankAccounts(res.data.accounts);
            // Only show add bank form if no cards exist
            setShowAddBank(res.data.accounts.length === 0);
            setHasCardDetails(res.data.accounts.length > 0);
          }
        });
    }
  }, [isOpen, seller_id]);

  const handleAddBankAccount = async () => {
    // Remove spaces from card number
    const rawCardNumber = cardNumber.replace(/\s/g, "");
    // Validate all fields
    if (!cardholderName.trim()) {
      alert("Please enter seller name.");
      return;
    }
    if (!/^\d{16}$/.test(rawCardNumber)) {
      alert("Card number must be 16 digits.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      alert("Expiry must be in MM/YY format.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      alert("CVC must be 3 or 4 digits.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost/Agrilink-Agri-Marketplace/backend/wallet/add_bank_account.php",
        {
          seller_id,
          cardholder_name: cardholderName,
          card_number: rawCardNumber,
          expiry,
          cvc,
        }
      );
      if (response.data.success) {
        alert("Card details saved successfully! You can now withdraw funds.");
        setCardholderName("");
        setCardNumber("");
        setExpiry("");
        setCvc("");
        setHasCardDetails(true);
        // Refresh bank accounts
        const res = await axios.get(
          `http://localhost/Agrilink-Agri-Marketplace/backend/wallet/get_bank_accounts.php?seller_id=${seller_id}`
        );
        setBankAccounts(res.data.accounts);
        setShowAddBank(false);
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      alert("Failed to add card details.");
    }
    setLoading(false);
  };

  const handleWithdraw = async () => {
    if (!amount || !bankAccount) {
      alert("Please enter amount and select bank account.");
      return;
    }
    
    if (!hasCardDetails) {
      alert("You must save your card details before withdrawing. Please click 'Save Card Details' first.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost/Agrilink-Agri-Marketplace/backend/wallet/request_withdrawal.php",
        {
          seller_id,
          amount,
          bank_account: bankAccount,
        }
      );
      if (response.data.success) {
        alert(
          `Withdrawal completed!\nCommission: $${response.data.commission}\nWithdrawn: $${response.data.withdrawn_amount}`
        );
        setAmount("");
        setBankAccount("");
        if (onWithdrawSuccess) onWithdrawSuccess();
        onClose();
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      alert("Withdrawal failed. Please try again.");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9999 }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 10000 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-700">Withdraw Amount</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-green-700 text-2xl font-bold"
          >
            &times;
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block font-medium mb-1">Amount to Withdraw</label>
          <input
            type="number"
            min="1"
            max={availableBalance}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Enter amount"
          />
          <div className="text-sm text-gray-500 mt-1">
            Available balance: $
            {isNaN(Number(availableBalance)) ||
            availableBalance === null ||
            availableBalance === undefined
              ? "0.00"
              : Number(availableBalance).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
          </div>
        </div>

        {!hasCardDetails ? (
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Important:</strong> You must save your card details before withdrawing funds.
              </p>
            </div>
            <label className="block font-medium mb-1">Add Card Details</label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-2"
              placeholder="Seller Name"
            />
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className="w-full border rounded-lg px-4 py-2 mb-2"
              placeholder="Card Number"
              maxLength={19} // 16 digits + 3 spaces
              inputMode="numeric"
            />
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="MM/YY"
              />
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="CVC"
              />
            </div>
            <button
              onClick={handleAddBankAccount}
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Card Details"}
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block font-medium mb-1">Select Bank Account</label>
            <select
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select bank account</option>
              {bankAccounts.map((acc) => (
                <option key={acc.id} value={acc.card_number}>
                  Card ending in{" "}
                  {acc.card_number ? acc.card_number.slice(-4) : "----"}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-white border px-6 py-2 rounded-lg font-semibold"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleWithdraw}
            className={`px-6 py-2 rounded-lg font-semibold ${
              hasCardDetails 
                ? "bg-green-500 text-white hover:bg-green-600" 
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
            disabled={loading || !hasCardDetails}
          >
            {loading ? "Processing..." : "Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default WithdrawModal;
