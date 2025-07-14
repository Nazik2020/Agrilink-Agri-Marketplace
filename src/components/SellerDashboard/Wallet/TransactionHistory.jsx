const TransactionHistory = () => {
  const transactions = [
    {
      date: "2024-03-15",
      type: "Sale",
      amount: "$1,500",
      status: "Completed",
    },
    {
      date: "2024-03-10",
      type: "Withdrawal",
      amount: "-$500",
      status: "Completed",
    },
    {
      date: "2024-03-05",
      type: "Sale",
      amount: "$2,000",
      status: "Completed",
    },
    {
      date: "2024-02-28",
      type: "Sale",
      amount: "$1,200",
      status: "Completed",
    },
    {
      date: "2024-02-20",
      type: "Withdrawal",
      amount: "-$300",
      status: "Completed",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-green-600">Transaction History</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Type</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{transaction.date}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{transaction.type}</td>
                <td
                  className={`px-6 py-4 text-sm font-medium ${
                    transaction.amount.startsWith("-") ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {transaction.amount}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionHistory
