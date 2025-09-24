import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Plus, BarChart3, Wallet, Bell, LogOut, Store } from "lucide-react";
import axios from "axios";
import Image from "../../../assets/SellerDashboard/seller.jpg";
import { API_CONFIG } from "../../../config/api";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize seller data from sessionStorage
  const [sellerData, setSellerData] = useState(() => {
    try {
      const seller = JSON.parse(sessionStorage.getItem("seller"));
      console.log("Initial seller data from sessionStorage:", seller); // Debug log
      return seller || { 
        business_name: "Seller", 
        username: "Seller", 
        business_logo: null,
        email: "",
        id: null
      };
    } catch (error) {
      console.error("Error parsing seller data:", error);
      return { 
        business_name: "Seller", 
        username: "Seller", 
        business_logo: null,
        email: "",
        id: null
      };
    }
  });

  // Force image refresh version
  const [logoVersion, setLogoVersion] = useState(Date.now());

  // Build logo URL helper function
  const buildLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    
    // If it's already a full URL, return as is
    if (/^https?:\/\//i.test(logoPath)) {
      return `${logoPath}&v=${logoVersion}`;
    }
    
    // Build URL from relative path
    const base = API_CONFIG.BASE_URL.replace(/\/$/, "");
    const relativePath = String(logoPath).replace(/^\/?/, "");
    return `${base}/${relativePath}?v=${logoVersion}`;
  };

  // Get default profile image
  const getDefaultProfileImage = () => {
    return "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop";
  };

  // Listen for sessionStorage changes and custom events
  useEffect(() => {
    const updateSellerData = () => {
      try {
        const seller = JSON.parse(sessionStorage.getItem("seller"));
        console.log("Updating seller data:", seller); // Debug log
        
        if (seller) {
          setSellerData(seller);
          setLogoVersion(Date.now()); // Force image refresh
        }
      } catch (error) {
        console.error("Error updating seller data:", error);
      }
    };

    // Listen for storage events
    window.addEventListener("storage", updateSellerData);
    
    // Listen for custom user state changes
    const handleUserStateChange = (event) => {
      const detail = event.detail || {};
      if (detail && (detail.action === "login" || detail.action === "auto_login") && detail.user) {
        const user = detail.user;
        console.log("User state changed:", user); // Debug log
        if (user.role === "seller") {
          // Normalize to the shape this sidebar expects
          const sellerObj = {
            id: user.id,
            email: user.email || "",
            username: user.username || user.business_name || user.name || "Seller",
            business_name: user.business_name || user.name || "Seller",
            business_logo: user.business_logo || user.profile_image || user.profile_picture || null,
            country: user.country || "",
            contact_number: user.contact_number || "",
            address: user.address || ""
          };
          setSellerData(sellerObj);
          // Also sync sessionStorage for pages that read it directly
          try { sessionStorage.setItem("seller", JSON.stringify(sellerObj)); } catch (_) {}
          setLogoVersion(Date.now());
        }
      }
    };
    
    window.addEventListener("userStateChanged", handleUserStateChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", updateSellerData);
      window.removeEventListener("userStateChanged", handleUserStateChange);
    };
  }, []);

  // On component mount, sync with current sessionStorage
  useEffect(() => {
    const syncWithSessionStorage = () => {
      try {
        const seller = JSON.parse(sessionStorage.getItem("seller"));
        console.log("Syncing with sessionStorage on mount:", seller); // Debug log
        
        if (seller) {
          setSellerData(seller);
          setLogoVersion(Date.now());
        }
      } catch (error) {
        console.error("Error syncing with sessionStorage:", error);
      }
    };

    syncWithSessionStorage();
  }, []);

  const handleLogout = () => {
    // Clear all session data
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("seller");
    localStorage.removeItem("seller_id");
    
    // Dispatch logout event
    window.dispatchEvent(
      new CustomEvent("userStateChanged", {
        detail: { action: "logout" },
      })
    );
    
    console.log("User logged out");
    navigate("/marketplace");
  };

  const menuItems = [
    { icon: User, label: "Profile", path: "/seller-dashboard/profile" },
    { icon: Store, label: "My Store", path: "/seller-dashboard/my-store" },
    { icon: Plus, label: "Add Product", path: "/seller-dashboard/add-product" },
    { icon: BarChart3, label: "Analytics", path: "/seller-dashboard/analytics" },
    { icon: Wallet, label: "Wallet", path: "/seller-dashboard/wallet" },
    { icon: Bell, label: "Notifications", path: "/seller-dashboard/notifications" },
  ];

  // Get current seller logo URL
  const getSellerLogoUrl = () => {
    const logoPath = sellerData.business_logo || sellerData.profile_image || sellerData.profile_picture;
    return logoPath ? buildLogoUrl(logoPath) : getDefaultProfileImage();
  };

  // Get seller display name
  const getSellerDisplayName = () => {
    return sellerData.business_name || sellerData.name || sellerData.username || "Seller";
  };

  console.log("Current seller data:", sellerData); // Debug log
  console.log("Current logo URL:", getSellerLogoUrl()); // Debug log

  return (
    <div className="w-90 bg-white shadow-lg min-h-screen p-6">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8 mt-5">
        <div className="relative mb-4">
          <img
            key={`${sellerData.id}-${logoVersion}`}
            src={getSellerLogoUrl()}
            alt={`${getSellerDisplayName()} Profile`}
            className="w-30 h-30 rounded-full object-cover border-4 border-green-100 shadow-lg"
            onError={(e) => {
              console.log("Image failed to load, using default"); // Debug log
              e.currentTarget.src = getDefaultProfileImage();
            }}
            onLoad={() => {
              console.log("Image loaded successfully"); // Debug log
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        
        <h3 className="text-xl font-bold text-green-600 mb-1">
          {getSellerDisplayName()}
        </h3>
        
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Seller
        </span>
        
        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 text-xs text-gray-400 text-center">
            ID: {sellerData.id || 'N/A'}<br/>
            Email: {sellerData.email || 'N/A'}
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2 mb-8">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive =
            location.pathname === item.path ||
            (location.pathname === "/" && item.path === "/profile");

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
          onClick={handleLogout}
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
            src={Image}
            alt="Motivation"
            className="w-30 h-30 rounded-full object-cover border-3 border-green-200"
          />
        </div>
        <div className="space-y-3 text-center">
          <p className="text-base text-gray-600 italic leading-relaxed">
            "Quality products, exceptional service — every time."
          </p>
          <p className="text-lg text-gray-600 italic leading-relaxed">
            "Selling with a smile — always."
          </p>
          <p className="text-base text-gray-600 italic leading-relaxed">
            "Your satisfaction is my priority."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;