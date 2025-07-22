// src/pages/CustomerDashboard.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerDashboard/MainSidebar/CustomerSidebar';

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <CustomerSidebar />
      </div>

      {/* Page Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerDashboard;
