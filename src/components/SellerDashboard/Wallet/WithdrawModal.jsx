"use client"

import { useState } from "react"
import { X } from "lucide-react"

const WithdrawModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState("")
  const [bankAccount, setBankAccount] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle withdrawal logic here
    console.log("Withdrawal request:", { amount, bankAccount })
    // Reset form and close modal
    setAmount("")
    setBankAccount("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-green-50  bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg p-10 w-full max-w-md mx-4 shadow-lg">
        <div className="flex justify-between items-center mb-4 bg-green-200">
          <h2 className="text-xl font-bold text-gray-00">Withdraw Amount</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount to Withdraw
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter amount"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Available balance: $12,345</p>
          </div>

          <div className="mb-6">
            <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 mb-2">
              Bank Account
            </label>
            <select
              id="bankAccount"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select bank account</option>
              <option value="account1">**** **** **** 1234</option>
              <option value="account2">**** **** **** 5678</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-green-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              Withdraw
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WithdrawModal
