import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { API_CONFIG } from "../../../config/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SalesChart = () => {
  const [chartData, setChartData] = useState({
    labels: monthNames,
    datasets: [{ label: "Monthly Income", data: Array(12).fill(0) }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get sellerId from props/context (default to 1 if not provided)
    const sellerId = window.localStorage.getItem("seller_id") || 1;
    fetch(`${API_CONFIG.BASE_URL}/seller_analytics/get_seller_analytics.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seller_id: sellerId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.monthly_income_breakdown)) {
          // Prepare an array of 12 months, fill with 0
          const monthlyIncome = Array(12).fill(0);
          data.monthly_income_breakdown.forEach((item) => {
            // JS months are 0-based, PHP returns 1-based
            const monthIdx = item.month ? item.month - 1 : 0;
            monthlyIncome[monthIdx] = Number(item.income);
          });
          // Rotate months so current month is at the end (rightmost bar).
          // Example (current = Aug): Sep Oct Nov Dec Jan Feb Mar Apr May Jun Jul Aug
          const currentIdx = new Date().getMonth(); // 0..11
          const rotatedLabels = [
            ...monthNames.slice(currentIdx + 1),
            ...monthNames.slice(0, currentIdx + 1),
          ];
          const rotatedData = [
            ...monthlyIncome.slice(currentIdx + 1),
            ...monthlyIncome.slice(0, currentIdx + 1),
          ];

          // Show only the last 7 months (current month + previous 6)
          const monthsToShow = 7;
          const trimmedLabels = rotatedLabels.slice(-monthsToShow);
          const trimmedData = rotatedData.slice(-monthsToShow);

          setChartData({
            labels: trimmedLabels,
            datasets: [
              {
                label: "Monthly Income",
                data: trimmedData,
                backgroundColor: "rgba(16, 185, 129, 0.8)",
                borderColor: "#10B981",
                borderWidth: 0.5,
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 75,
              },
            ],
          });
          setError(null);
        } else {
          setError("Failed to load monthly income data");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load monthly income data");
        setLoading(false);
      });
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#10B981",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return `Sales: $${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#6B7280",
          callback: function (value) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  if (loading) return <div>Loading monthly income chart...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // After rotation, current month is always the last element
  const thisMonthIndex = chartData.datasets[0].data.length - 1;
  const thisMonthIncome = chartData.datasets[0].data[thisMonthIndex] || 0;
  const lastMonthIncome = chartData.datasets[0].data[thisMonthIndex - 1] || 0;
  const percentChange = lastMonthIncome
    ? (((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100).toFixed(1)
    : 0;
  const changeSign = percentChange >= 0 ? "+" : "";
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Monthly Income
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">
              ${thisMonthIncome.toLocaleString()}
            </span>
            <span
              className={`text-sm ${
                percentChange >= 0
                  ? "text-green-600 bg-green-100"
                  : "text-red-600 bg-red-100"
              } px-2 py-1 rounded-full`}
            >
              {changeSign}
              {percentChange}% this month
            </span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesChart;
