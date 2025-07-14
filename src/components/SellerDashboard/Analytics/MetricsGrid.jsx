import React from 'react';
import { ShoppingCart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const MetricsGrid = () => {
  const metrics = [
    {
      title: "Today's Orders",
      value: "12",
      icon: ShoppingCart,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Today's Income",
      value: "$2,400",
      icon: DollarSign,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Today's Expenses",
      value: "$600",
      icon: TrendingDown,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    },
    {
      title: "Today's Profit",
      value: "$1,800",
      icon: TrendingUp,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div key={index} className={`${metric.bgColor} rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${metric.color}`}>
                <IconComponent size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
            <p className={`text-2xl font-bold ${metric.textColor}`}>{metric.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;