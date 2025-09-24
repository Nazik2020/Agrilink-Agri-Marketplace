import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Heart, ShoppingBag, Bell, LogOut, Package } from "lucide-react";
import customer from "../../../assets/CustomerDashboard/3412435.jpg";
import { API_CONFIG } from "../../../config/api";
import authService from "../../../services/AuthService";
import { exitCustomerDashboardOnly } from "../../../utils/authSession";

const CustomerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get username and profile image from sessionStorage user object
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const buildImgUrl = (raw) => {
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw)) return raw;
    // Use the same URL construction as CustomerProfilePage
    return `http://localhost/Agrilink-Agri-Marketplace/backend/get_image.php?path=${encodeURIComponent(raw)}`;
  };

  useEffect(() => {
    const loadFromSession = () => {
      const user = authService.getCurrentUser();
      if (user) {
        setUsername(user.full_name || user.username || "Customer");
        if (user.profile_image) {
          setProfileImage(buildImgUrl(user.profile_image));
        }
      }
    };

    loadFromSession();

    const handleStorage = () => loadFromSession();
    const handleUserState = () => loadFromSession();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("userStateChanged", handleUserState);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("userStateChanged", handleUserState);
    };
  }, []);

  const handleDashboardExit = (e) => {
    e?.preventDefault?.();
    exitCustomerDashboardOnly();
    navigate("/", { replace: true });
  };

  const menuItems = [
    { icon: User, label: "Profile", path: "/customer-dashboard/profile" },
    { icon: Heart, label: "WishList", path: "/customer-dashboard/wishlist" },
    {
      icon: ShoppingBag,
      label: "Order History",
      path: "/customer-dashboard/orders",
    },
    {
      icon: Package,
      label: "Customized Products",
      path: "/customer-dashboard/customized-products",
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/customer-dashboard/notifications",
    },
  ];

  return (
    <div className="w-90 bg-white shadow-lg min-h-screen p-6">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8 mt-5">
        <div className="relative mb-4">
          <img
            src={
              profileImage ||
              "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
            }
            alt="Profile"
            className="w-30 h-30 rounded-full object-cover border-4 border-green-100 shadow-lg"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop";
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <h3 className="text-xl font-bold text-green-600 mb-1">
          {username || "Customer"}
        </h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Customer
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2 mb-8">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive =
            location.pathname === item.path ||
            (location.pathname === "/customer-dashboard" &&
              item.path === "/customer-dashboard/profile");

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 group ${
                isActive
                  ? "bg-green-100 text-green-700 shadow-md"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-600 hover:shadow-sm hover:translate-x-1"
              }`}
            >
              <IconComponent
                size={20}
                className={`mr-3 transition-transform duration-300 ${
                  isActive ? "text-green-600" : "group-hover:scale-110"
                }`}
              />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </Link>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={handleDashboardExit}
          className="flex items-center w-full px-4 py-2 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-600 hover:shadow-sm hover:translate-x-1 transition-all duration-300 group"
        >
          <LogOut
            size={20}
            className="mr-3 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-medium">Logout</span>
        </button>
      </nav>

      {/* Motivational Section */}
      <div className="mt-30 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
        <div className="flex justify-center mb-4">
          <img
            src={customer}
            alt="Customer Experience"
            className="w-30 h-30 rounded-full object-cover border-3 border-green-200"
          />
        </div>
        <div className="space-y-3 text-center">
          <p className="text-base text-gray-600 italic leading-relaxed">
            "Freshness you can trust, from our farms to your hands."
          </p>
          <p className="text-lg text-gray-600 italic leading-relaxed">
            "Harvested with care, delivered with pride."
          </p>
          <p className="text-base text-gray-600 italic leading-relaxed">
            "Every product tells a story — and it's grown just for you."
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerSidebar;
