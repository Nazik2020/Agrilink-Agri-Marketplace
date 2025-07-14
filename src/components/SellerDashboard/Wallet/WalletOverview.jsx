"use client"

import { useState } from "react"
import WithdrawModal from "./WithdrawModal"

const WalletOverview = () => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

  const walletStats = [
    {
      title: "Products sold",
      value: "1,234",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Total earnings",
      value: "$56,789",
      bgColor: "bg-blue-100",
    },
    {
      title: "Available balance",
      value: "$12,345",
      bgColor: "bg-green-100",
    },
  ]

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {walletStats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer`}
          >
            <h3 className="text-base font-medium text-gray-600 mb-2 text-center">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 text-center">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Withdraw Button */}
      <div className="mt-10 mb-10 flex justify-center">
        <button
          onClick={() => setIsWithdrawModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-100 shadow-sm hover:shadow-md hover:scale-105  cursor-pointer"
        >
          Withdraw Amount
        </button>
      </div>

      {/* Withdraw Modal */}
      <WithdrawModal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} />
    </div>
  )
}

export default WalletOverview
