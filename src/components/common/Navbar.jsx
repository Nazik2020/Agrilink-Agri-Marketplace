import React, { useState } from "react";
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
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  return (
    <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-50">
      {/*Logo of site */}
      {/*Logo of site */}
      {/*Logo of site */}
      <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="Agrilink logo" className="w-20 h-20" />

          <div className="flex flex-col relative top-[2px] leading-tight">
            <span className="text-gray-600 font-semibold text-2xl">
              Agricultural
            </span>

            <span className="text-gray-600 font-semibold text-2xl">
              Marketplace
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        {/* Navigation links */}
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
            Contact Us
          </Link>

          <Link to="/about" className="hover:text-green-700">
            About Us
          </Link>

          <Link to="/faq" className="hover:text-green-700">
            FAQ
          </Link>
        </div>

        {/* Icons: Cart and Account */}
        {/* Icons: Cart and Account */}
        {/* Icons: Cart and Account */}
        <div className="hidden lg:flex items-center gap-8 text-green-600 text-3xl">
          <Link to="/cart" title="Cart">
            <FaShoppingCart className="hover:text-green-800 cursor-pointer hover:scale-105 transition" />
          </Link>
          {/* Account Dropdown Button */}
          {/* Account Dropdown Button */}
          {/* Account Dropdown Button */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-7 py-3 bg-white border border-gray-200 rounded-lg shadow-sm text-black text-lg font-medium focus:outline-none hover:shadow-md transition cursor-pointer"
              onClick={() => setIsAccountDropdownOpen((open) => !open)}
            >
              <FaUserCircle className="text-2xl text-green-600" />
              <span>Account</span>
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
        {/* Hamburger button (mobile) */}
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
      {/* Mobile Menu */}
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white px-6 py-4 flex flex-col gap-4 text-[18px] font-semibold text-black shadow-md">
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
            Contact Us
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
            <Link to="/cart" title="Cart" onClick={() => setIsMenuOpen(false)}>
              <FaShoppingCart className="text-3xl text-green-600 hover:scale-105 transition" />
            </Link>
          </div>
          {/* Mobile Account Dropdown */}
          <div className="relative mt-4">
            <button
              className="flex items-center gap-2 px-7 py-3 bg-white border border-gray-200 rounded-lg shadow-sm text-black text-lg font-medium focus:outline-none hover:shadow-md transition cursor-pointer w-full justify-center"
              onClick={() => setIsAccountDropdownOpen((open) => !open)}
            >
              <FaUserCircle className="text-2xl text-green-600" />
              {/* <span>Account</span> */}
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
