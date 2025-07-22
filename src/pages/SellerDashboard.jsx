import { Outlet } from "react-router-dom";
import Sidebar from "../components/SellerDashboard/MainSidebar/Sidebar"; // ✅ adjust path as needed

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Use your custom sidebar */}
      <Sidebar />

      {/* Page content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
