"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { X } from "lucide-react";

// Lightweight popup used elsewhere in the app (success=green, error=red)
const PopupMessage = ({ message, type = 'success', onClose }) => {
  if (!message) return null;
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-[10001]">
      <div className={`${bgColor} ${borderColor} border rounded-2xl p-6 max-w-lg w-[92%] mx-4 shadow-xl relative`}> 
        <button
          aria-label="Close notification"
          onClick={onClose}
          className={`absolute top-3 right-3 ${textColor} hover:opacity-75 transition-opacity`}
        >
          <X size={20} />
        </button>
        <div className="flex items-start space-x-3 pr-6">
          <div className={`${iconColor} flex-shrink-0 mt-0.5`}>{isSuccess ? '✔️' : '❌'}</div>
          <div className="flex-1">
            <p className={`${textColor} text-base font-medium whitespace-pre-line`}>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [editingBankId, setEditingBankId] = useState(null);
  const seller_id = localStorage.getItem("seller_id");

  // Popup state
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState('success');
  const [afterPopupClose, setAfterPopupClose] = useState(null);
  const showPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
  };

  // Format account number - remove non-digits and limit length
  const handleAccountNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    value = value.slice(0, 20); // Limit to 20 digits for account numbers
    setAccountNumber(value);
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
            // Only show add bank form if no accounts exist
            setShowAddBank(res.data.accounts.length === 0);
            setHasBankDetails(res.data.accounts.length > 0);
            
            // Auto-select the first bank account if available
            if (res.data.accounts.length > 0) {
              setBankAccount(res.data.accounts[0].account_number);
            }
          }
        });
    }
  }, [isOpen, seller_id]);

  const handleAddBankAccount = async () => {
    // Validate all required fields
    if (!accountName.trim()) { showPopup("Please enter account holder name.", 'error'); return; }
    if (!accountNumber.trim()) { showPopup("Please enter account number.", 'error'); return; }
    if (!bankName.trim()) { showPopup("Please enter bank name.", 'error'); return; }
    if (!branchName.trim()) { showPopup("Please enter branch name.", 'error'); return; }
    if (!/^\d{8,20}$/.test(accountNumber)) { showPopup("Account number must be 8-20 digits.", 'error'); return; }
    
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost/Agrilink-Agri-Marketplace/backend/wallet/add_bank_account.php",
        {
          seller_id,
          account_name: accountName,
          account_number: accountNumber,
          bank_name: bankName,
          branch_name: branchName,
        }
      );
      if (response.data.success) {
        showPopup("Bank account details saved successfully! You can now withdraw funds.", 'success');
        setAccountName("");
        setAccountNumber("");
        setBankName("");
        setBranchName("");
        setHasBankDetails(true);
        // Refresh bank accounts
        const res = await axios.get(
          `http://localhost/Agrilink-Agri-Marketplace/backend/wallet/get_bank_accounts.php?seller_id=${seller_id}`
        );
        setBankAccounts(res.data.accounts);
        setShowAddBank(false);
      } else {
        showPopup(response.data.error || 'Failed to add bank account details.', 'error');
      }
    } catch (err) {
      showPopup("Failed to add bank account details.", 'error');
    }
    setLoading(false);
  };

  const handleEditBankAccount = (account) => {
    setIsEditingBank(true);
    setEditingBankId(account.id);
    setAccountName(account.account_name);
    setAccountNumber(account.account_number);
    setBankName(account.bank_name);
    setBranchName(account.branch_name);
  };

  const handleUpdateBankAccount = async () => {
    // Validate all required fields
    if (!accountName.trim()) { showPopup("Please enter account holder name.", 'error'); return; }
    if (!accountNumber.trim()) { showPopup("Please enter account number.", 'error'); return; }
    if (!bankName.trim()) { showPopup("Please enter bank name.", 'error'); return; }
    if (!branchName.trim()) { showPopup("Please enter branch name.", 'error'); return; }
    if (!/^\d{8,20}$/.test(accountNumber)) { showPopup("Account number must be 8-20 digits.", 'error'); return; }
    
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost/Agrilink-Agri-Marketplace/backend/wallet/update_bank_account.php",
        {
          id: editingBankId,
          seller_id,
          account_name: accountName,
          account_number: accountNumber,
          bank_name: bankName,
          branch_name: branchName,
        }
      );
      if (response.data.success) {
        showPopup("Bank account details updated successfully!", 'success');
        setAccountName("");
        setAccountNumber("");
        setBankName("");
        setBranchName("");
        setIsEditingBank(false);
        setEditingBankId(null);
        // Refresh bank accounts
        const res = await axios.get(
          `http://localhost/Agrilink-Agri-Marketplace/backend/wallet/get_bank_accounts.php?seller_id=${seller_id}`
        );
        setBankAccounts(res.data.accounts);
        if (res.data.accounts.length > 0) {
          setBankAccount(res.data.accounts[0].account_number);
        }
      } else {
        showPopup(response.data.error || 'Failed to update bank account details.', 'error');
      }
    } catch (err) {
      showPopup("Failed to update bank account details.", 'error');
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setIsEditingBank(false);
    setEditingBankId(null);
    setAccountName("");
    setAccountNumber("");
    setBankName("");
    setBranchName("");
  };

  const handleWithdraw = async () => {
    if (!amount) { showPopup("Please enter amount to withdraw.", 'error'); return; }
    
    // Check if available balance is 0 or insufficient
    const numericBalance = Number(availableBalance) || 0;
    const requestedAmount = Number(amount) || 0;
    
    if (numericBalance <= 0) {
      showPopup("Not enough available balance. Your current available balance is $0.00.", 'error'); 
      return; 
    }
    
    if (requestedAmount > numericBalance) {
      showPopup(`Not enough available balance. You can withdraw up to $${numericBalance.toFixed(2)}.`, 'error'); 
      return; 
    }
    
    if (!hasBankDetails) { showPopup("You must save your bank account details before withdrawing. Please add your bank account first.", 'error'); return; }
    
    // Auto-select first bank account if not selected
    const selectedBankAccount = bankAccount || (bankAccounts.length > 0 ? bankAccounts[0].account_number : '');
    if (!selectedBankAccount) { showPopup("No bank account available. Please add your bank account first.", 'error'); return; }
    
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost/Agrilink-Agri-Marketplace/backend/wallet/request_withdrawal.php",
        {
          seller_id,
          amount,
          bank_account: selectedBankAccount,
        }
      );
      if (response.data.success) {
        showPopup(`Withdrawal completed!\nCommission: $${response.data.commission}\nWithdrawn: $${response.data.withdrawn_amount}`,'success');
        setAmount("");
        setBankAccount("");
        // Close modal and refresh after the user dismisses the popup
        setAfterPopupClose(() => () => {
          if (onWithdrawSuccess) onWithdrawSuccess();
          onClose();
          setPopupMessage(null);
          setAfterPopupClose(null);
        });
      } else {
        showPopup(response.data.error || 'Withdrawal failed.', 'error');
      }
    } catch (err) {
      showPopup("Withdrawal failed. Please try again.", 'error');
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
          {Number(availableBalance) <= 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
              <p className="text-red-800 text-sm">
                <strong>⚠️ No Available Balance:</strong> You need to have completed orders to withdraw funds.
              </p>
            </div>
          )}
        </div>

        {!hasBankDetails ? (
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Step 1:</strong> Please add your bank account details first to enable withdrawals.
              </p>
            </div>
            <label className="block font-medium mb-1">Add Bank Account Details</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-2"
              placeholder="Account Holder Name"
            />
            <input
              type="text"
              value={accountNumber}
              onChange={handleAccountNumberChange}
              className="w-full border rounded-lg px-4 py-2 mb-2"
              placeholder="Account Number"
              maxLength={20}
              inputMode="numeric"
            />
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-2"
              placeholder="Bank Name"
            />
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-2"
              placeholder="Branch Name"
            />
            <button
              onClick={handleAddBankAccount}
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Bank Account Details"}
            </button>
          </div>
        ) : (
          <div className="mb-6">
            {isEditingBank ? (
              <div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Edit Bank Account Details:</strong> Update your banking information.
                  </p>
                </div>
                <label className="block font-medium mb-1">Edit Bank Account Details</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 mb-2"
                  placeholder="Account Holder Name"
                />
                <input
                  type="text"
                  value={accountNumber}
                  onChange={handleAccountNumberChange}
                  className="w-full border rounded-lg px-4 py-2 mb-2"
                  placeholder="Account Number"
                  maxLength={20}
                  inputMode="numeric"
                />
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 mb-2"
                  placeholder="Bank Name"
                />
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 mb-2"
                  placeholder="Branch Name"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateBankAccount}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold flex-1"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Details"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-green-800 text-sm">
                        <strong>✓ Bank Account Ready:</strong> Withdrawal will be processed to your saved account.
                      </p>
                      {bankAccounts.length > 0 && (
                        <div className="mt-2 text-sm text-green-700">
                          <p><strong>Account:</strong> {bankAccounts[0].account_name}</p>
                          <p><strong>Bank:</strong> {bankAccounts[0].bank_name} - {bankAccounts[0].branch_name}</p>
                          <p><strong>Account #:</strong> ****{bankAccounts[0].account_number.slice(-4)}</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleEditBankAccount(bankAccounts[0])}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                      disabled={loading}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </>
            )}
            {!isEditingBank && bankAccounts.length > 1 && (
              <div className="mb-4">
                <label className="block font-medium mb-1">Select Bank Account</label>
                <select
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  {bankAccounts.map((acc) => (
                    <option key={acc.id} value={acc.account_number}>
                      {acc.bank_name} - Account ending in{" "}
                      {acc.account_number ? acc.account_number.slice(-4) : "----"}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
          {!isEditingBank && (
            <button
              onClick={handleWithdraw}
              className={`px-6 py-2 rounded-lg font-semibold ${
                hasBankDetails && Number(availableBalance) > 0
                  ? "bg-green-500 text-white hover:bg-green-600" 
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
              disabled={loading || !hasBankDetails || Number(availableBalance) <= 0}
            >
              {loading ? "Processing..." : Number(availableBalance) <= 0 ? "No Balance Available" : "Withdraw"}
            </button>
          )}
        </div>
      </div>
      {/* Success/Error Popup */}
      <PopupMessage
        message={popupMessage}
        type={popupType}
        onClose={() => {
          if (afterPopupClose) { afterPopupClose(); }
          else { setPopupMessage(null); }
        }}
      />
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default WithdrawModal;
