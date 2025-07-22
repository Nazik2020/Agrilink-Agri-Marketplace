import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import Logo from "../../assets/navbar/agrilink_logo.png";
import ac_Logo from "../../assets/navbar/account_logo.png";
import { useCart } from "../cart/CartContext"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { totalItems, toggleCart } = useCart()

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

  const handleCartClick = () => {
    toggleCart()
    setIsMenuOpen(false) // Close mobile menu if open
  }


  return (
    <nav
      className={`bg-white shadow-md w-full fixed top-0 left-0 z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/*Logo of site */}
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="Agrilink logo" className="w-15 h-15" />
          <div className="w-px h-15 bg-gray-300 "></div>
          <div className="flex flex-col relative top-[2px] leading-tight">
            <span className="text-gray-600 font-semibold text-xl">
              Agricultural
            </span>
            <span className="text-gray-600 font-semibold text-xl">
              Marketplace
            </span>
          </div>
        </Link>
        {/* Navigation links */}
        <div className="hidden lg:flex  gap-8 text-[20px] font-semibold text-black">
          <Link to="/" className="hover:text-green-700">
            Home
          </Link>
          <Link to="/marketplace" className="hover:text-green-700">
            Marketplace
          </Link>
          <Link to="/blog" className="hover:text-green-700">
            Blog
          </Link>
          <Link to="/contact" className="hover:text-green-700">
            Contact us
          </Link>
          <Link to="/about" className="hover:text-green-700">
            About Us
          </Link>
          <Link to="/faq" className="hover:text-green-700">
            FAQ
          </Link>
        </div>
        {/* Icons: Cart and Account */}
        <div className="hidden lg:flex items-center gap-10 text-green-600 text-4xl">
         
          <button
            onClick={handleCartClick}
            className="relative hover:text-green-800 cursor-pointer hover:scale-105 transition"
            title="Shopping Cart"
          >
            <FaShoppingCart />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* Account Dropdown Button */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-7 py-3 bg-white border border-gray-200 rounded-lg shadow-sm text-black text-lg font-medium focus:outline-none hover:shadow-md transition cursor-pointer"
              onClick={() => setIsAccountDropdownOpen((open) => !open)}
            >
              <FaUserCircle className="text-2xl text-green-600" />
              <FaChevronDown className="text-base" />
            </button>
            {isAccountDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col py-2">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-3 hover:bg-gray-100 text-green-600 text-base rounded-t-lg cursor-pointer"
                  onClick={() => setIsAccountDropdownOpen(false)}
                >
                  <FaUserCircle className="text-lg text-green-600" /> Login
                </Link>
                <Link
                  to="/Welcoming"
                  className="flex items-center gap-2 px-5 py-3 hover:bg-gray-100 text-green-600 text-base rounded-b-lg cursor-pointer"
                  onClick={() => setIsAccountDropdownOpen(false)}
                >
                  <FaUserCircle className="text-lg text-green-600" /> Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
        {/* Hamburger button (mobile) */}
        <div className="lg:hidden">
          <button
            className="text-3xl text-green-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white px-6 py-4 flex flex-col gap-4 text-xl font-semibold text-black shadow-md">
          <Link
            to="/"
            className=" hover:text-green-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            className=" hover:text-green-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Marketplace
          </Link>
          <Link
            to="/blog"
            className=" hover:text-green-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            to="/contact"
            className=" hover:text-green-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact us
          </Link>
          <Link
            to="/about"
            className=" hover:text-green-700"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>

          <Link
            to="/faq"
            className=" hover:text-green-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Faq
          </Link>
          <div className="flex gap-5 mt-2">
             <button
            onClick={handleCartClick}
            className="flex items-center gap-2 text-green-600 hover:text-green-800 mt-2"
            title="Shopping Cart"
          >
            <div className="relative">
              <FaShoppingCart className="text-3xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </div>
            <span className="text-xl font-semibold">Cart ({totalItems})</span>
          </button>
          </div>
          {/* Mobile Account Dropdown */}
          <div className="relative mt-4">
            <button
              className="flex items-center gap-2 px-7 py-3 bg-white border border-gray-200 rounded-lg shadow-sm text-black text-lg font-medium focus:outline-none hover:shadow-md transition cursor-pointer w-full justify-center"
              onClick={() => setIsAccountDropdownOpen((open) => !open)}
            >
              <FaUserCircle className="text-2xl text-green-600" />
              <FaChevronDown className="text-base" />
            </button>
            {isAccountDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col py-2">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-3 hover:bg-gray-100 text-green-600 text-base rounded-t-lg cursor-pointer"
                  onClick={() => {
                    setIsAccountDropdownOpen(false);
                    setIsMenuOpen(false);
                  }}
                >
                  <FaUserCircle className="text-lg text-green-600" /> Login
                </Link>
                <Link
                  to="/Welcoming"
                  className="flex items-center gap-2 px-5 py-3 hover:bg-gray-100 text-green-600 text-base rounded-b-lg cursor-pointer"
                  onClick={() => {
                    setIsAccountDropdownOpen(false);
                    setIsMenuOpen(false);
                  }}
                >
                  <FaUserCircle className="text-lg text-green-600" /> Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
