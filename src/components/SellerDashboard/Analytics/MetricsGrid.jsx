import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";


import axios from "axios";
import { API_CONFIG } from "../../../config/api";

const MetricsGrid = ({ sellerId }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sellerId) return;
    setLoading(true);
    axios
      .post(`${API_CONFIG.BASE_URL}/seller_analytics/get_seller_analytics.php`, {
        seller_id: sellerId,
      })
      .then((res) => {
        const data = res.data;
        if (data.success) {
          setMetrics([
            {
              title: "Today's Orders",
              value: data.today_orders,
              icon: ShoppingCart,
              color: "bg-blue-500",
              bgColor: "bg-blue-50",
              textColor: "text-blue-600",
            },
            {
              title: "Today's Income",
              value: `$${data.today_income}`,
              icon: DollarSign,
              color: "bg-green-500",
              bgColor: "bg-green-50",
              textColor: "text-green-600",
            },
            {
              title: "Commission",
              value: `$${data.today_commission}`,
              icon: TrendingDown,
              color: "bg-red-500",
              bgColor: "bg-red-50",
              textColor: "text-red-600",
            },
            {
              title: "Net Income",
              value: `$${data.today_income - data.today_commission}`,
              icon: TrendingUp,
              color: "bg-purple-500",
              bgColor: "bg-purple-50",
              textColor: "text-purple-600",
            },
          ]);
          setError(null);
        } else {
          setError(data.message || "Failed to load analytics");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load analytics");
        setLoading(false);
      });
  }, [sellerId]);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={index}
            className={`${metric.bgColor} rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${metric.color}`}>
                <IconComponent size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              {metric.title}
            </h3>
            <p className={`text-2xl font-bold ${metric.textColor}`}>
              {metric.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;
