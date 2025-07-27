import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaSignOutAlt,
  FaTachometerAlt,
  FaHeart,
  FaRegHeart,
  FaRegUser,
  FaRegUserCircle,
  FaUser,
} from "react-icons/fa";
import Logo from "../../assets/navbar/agrilink_logo.png";
import { useCart } from "../cart/CartContext";
import { useWishlist } from "../wishlist/WishlistContext";

// User Management Class following OOP principles
class UserManager {
  constructor() {
    this.storageKey = "user";
    this.sellerStorageKey = "seller_id";
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const userString = sessionStorage.getItem(this.storageKey);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  // Check if user is logged in and is a customer
  isCustomerLoggedIn() {
    const user = this.getCurrentUser();
    return user && user.role === "customer";
  }

  // Logout user
  logout() {
    sessionStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.sellerStorageKey);
    // Dispatch custom event for immediate UI update
    window.dispatchEvent(
      new CustomEvent("userStateChanged", {
        detail: { action: "logout" },
      })
    );
  }

  // Login user
  login(userData) {
    sessionStorage.setItem(this.storageKey, JSON.stringify(userData));
    // Dispatch custom event for immediate UI update
    window.dispatchEvent(
      new CustomEvent("userStateChanged", {
        detail: { action: "login", user: userData },
      })
    );
  }
}

// Create a singleton instance
const userManager = new UserManager();

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState(null);

  const { totalItems, toggleCart } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  // User state management following OOP principles
  useEffect(() => {
    const updateUserState = () => {
      const currentUser = userManager.getCurrentUser();
      setUser(currentUser);
    };

    // Initial user state check
    updateUserState();

    // Event listeners for user state changes
    const handleUserStateChange = (event) => {
      updateUserState();
    };

    const handleStorageChange = (event) => {
      if (event.key === userManager.storageKey) {
        updateUserState();
      }
    };

    // Add event listeners
    window.addEventListener("userStateChanged", handleUserStateChange);
    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("userStateChanged", handleUserStateChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Scroll behavior management
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 50) {
        setShowNavbar(true);
        setLastScrollY(window.scrollY);
        return;
      }
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false); // Scrolling down
      } else {
        setShowNavbar(true); // Scrolling up
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Cart interaction handler
  const handleCartClick = () => {
    toggleCart();
    setIsMenuOpen(false);
  };

  // Logout handler using OOP UserManager
  const handleLogout = () => {
    userManager.logout();
    setUser(null);
    setIsAccountDropdownOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  // Dashboard link resolver
  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin":
        return "/admin-dashboard";
      case "seller":
        return "/seller-dashboard";
      case "customer":
        return "/customer-dashboard";
      default:
        return "/";
    }
  };

  // User display name getter
  const getUserDisplayName = () => {
    if (!user) return "";
    return user.full_name || user.username || user.email || "User";
  };

  // User profile image getter
  const getUserProfileImage = () => {
    if (!user) return null;
    return user.profile_image || null;
  };

  // Check if wishlist should be shown (only for logged-in customers)
  const shouldShowWishlist = () => {
    return userManager.isCustomerLoggedIn();
  };

  // Get user initial for dropdown
  const getUserInitial = () => {
    if (!user) return "";
    return user.full_name
      ? user.full_name.charAt(0)
      : user.username
      ? user.username.charAt(0)
      : "U";
  };

  return (
    <nav
      className={`bg-white shadow-lg w-full fixed top-0 left-0 z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
        {" "}
        {/* Increased py-2 to py-4 */}
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src={Logo} alt="Agrilink logo" className="w-12 h-12" />{" "}
          {/* Increased from w-10 h-10 */}
          <div className="w-px h-10 bg-gray-300"></div>{" "}
          {/* Increased from h-8 */}
          <div className="flex flex-col leading-tight">
            <span className="text-gray-600 font-semibold text-base">
              {" "}
              {/* Increased from text-sm */}
              Agricultural
            </span>
            <span className="text-gray-600 font-semibold text-base">
              {" "}
              {/* Increased from text-sm */}
              Marketplace
            </span>
          </div>
        </Link>
        {/* Navigation Links */}
        <div className="hidden lg:flex gap-6 text-base font-medium text-gray-700"> {/* Increased from text-xs */}
          <Link to="/" className="hover:text-green-600 transition-colors duration-200">
            Home
          </Link>
          <Link
            to="/marketplace"
            className="hover:text-green-600 transition-colors duration-200"
          >
            Marketplace
          </Link>
          <Link
            to="/blog"
            className="hover:text-green-600 transition-colors duration-200"
          >
            Blog
          </Link>
          <Link
            to="/contact"
            className="hover:text-green-600 transition-colors duration-200"
          >
            Contact us
          </Link>
          <Link
            to="/about"
            className="hover:text-green-600 transition-colors duration-200"
          >
            About Us
          </Link>
          <Link
            to="/faq"
            className="hover:text-green-600 transition-colors duration-200"
          >
            FAQ
          </Link>
        </div>
        {/* Right Side Icons and Buttons */}
        <div className="hidden lg:flex items-center gap-6">
          {user ? (
            <>
              {/* Wishlist Icon - Only for customers */}
              {user.role === "customer" && (
                <Link
                  to="/customer-dashboard/wishlist"
                  className="relative text-gray-600 hover:text-green-600 transition-colors duration-200"
                  title="Wishlist"
                >
                  <FaRegHeart className="text-xl" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </span>
                  )}
                </Link>
              )}
              {/* Cart Icon - Only for customers */}
              {user.role === "customer" && (
          <button
            onClick={handleCartClick}
                  className="relative text-gray-600 hover:text-green-600 transition-colors duration-200"
            title="Shopping Cart"
          >
                  <FaShoppingCart className="text-xl" />
            {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
              )}
              {/* Account Dropdown (existing code) */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsAccountDropdownOpen(!isAccountDropdownOpen)
                  }
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
                  <FaRegUserCircle className="text-lg text-gray-600" />
                  <FaChevronDown
                    className={`text-gray-600 text-xs transition-transform duration-200 ${
                      isAccountDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isAccountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-3">
                    {/* User Profile Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        {getUserProfileImage() ? (
                          <img
                            src={getUserProfileImage()}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border-2 border-green-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {getUserDisplayName().charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {user.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors duration-200"
                        onClick={() => setIsAccountDropdownOpen(false)}
                      >
                        <FaTachometerAlt className="text-green-600 text-sm" />
                        <span className="text-sm font-medium">Dashboard</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                      >
                        <FaSignOutAlt className="text-red-600 text-sm" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
                <Link
                  to="/login"
                className="px-3 py-1.5 text-green-600 font-medium text-xs hover:text-green-700 transition-colors duration-200"
                >
                Login
                </Link>
                <Link
                  to="/Welcoming"
                className="px-3 py-1.5 bg-green-600 text-white font-medium text-xs rounded-md hover:bg-green-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                Sign Up
              </Link>
            </div>
          )}
        </div>
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            className="text-lg text-green-600 hover:text-green-700 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
          <div className="flex flex-col gap-3">
            {/* Navigation Links */}
          <Link
            to="/"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/marketplace"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Marketplace
          </Link>
          <Link
            to="/blog"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            to="/contact"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact us
          </Link>
          <Link
            to="/about"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="/faq"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>

            {/* Mobile Icons */}
            {user && user.role === "customer" && (
              <div className="flex items-center gap-6 pt-2 border-t border-gray-200">
                {/* Wishlist Icon */}
                <Link
                  to="/customer-dashboard/wishlist"
                  className="relative text-gray-600 hover:text-green-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
                  <FaRegHeart className="text-xl" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </span>
                  )}
          </Link>
                {/* Cart Icon */}
             <button
            onClick={handleCartClick}
                  className="relative text-gray-600 hover:text-green-600 transition-colors duration-200"
          >
                  <FaShoppingCart className="text-xl" />
              {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
          </button>
          </div>
            )}
            {/* Mobile User Section */}
            {user ? (
              // Logged in user - Mobile account options
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  {getUserProfileImage() ? (
                    <img
                      src={getUserProfileImage()}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-green-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaTachometerAlt className="text-green-600 text-sm" />
                  <span className="font-medium text-sm">Dashboard</span>
                </Link>
            <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200 w-full text-left"
            >
                  <FaSignOutAlt className="text-red-600 text-sm" />
                  <span className="font-medium text-sm">Logout</span>
            </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-200 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="py-2 text-center text-green-600 font-medium text-xs hover:text-green-700 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/Welcoming"
                  className="py-2 text-center bg-green-600 text-white font-medium text-xs rounded-md hover:bg-green-700 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {isAccountDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsAccountDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
