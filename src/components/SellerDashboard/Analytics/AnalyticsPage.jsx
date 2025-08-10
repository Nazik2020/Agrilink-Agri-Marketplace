import React from "react";
//import Sidebar from '../MainSidebar/Sidebar';
import MetricsGrid from "./MetricsGrid";
import PriceListTable from "./PriceListTable";
import SalesChart from "./SalesChart";

const AnalyticsPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/*<Sidebar />*/}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-green-600 mb-2">
              Selling Analytics
            </h1>
            <p className="text-gray-600">
              Track your performance and grow your business
            </p>
          </div>


          {/* Today's Metrics */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-500 mb-4">Today</h2>
            {/* Get sellerId from localStorage or context */}
            <MetricsGrid sellerId={window.localStorage.getItem("seller_id") || 1} />
          </div>

          {/* Charts Section */}
          <div className="w-full p-10">
            <SalesChart />
          </div>

          {/* Price List Table */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-500 mb-4">
              Today's Price List
            </h2>
            <PriceListTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
