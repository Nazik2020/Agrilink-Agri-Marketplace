import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import Logo from "../../assets/navbar/agrilink_logo.png";
import ac_Logo from "../../assets/navbar/account_logo.png";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  return (
    <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-50">
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

        <div className="hidden lg:flex  gap-8 text-[25px] font-semibold text-black">
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

          <Link to="/faq" className="hover:text-green-700">
            FAQ
          </Link>
        </div>

        {/* Icons: Cart and Account */}
        <div className="hidden lg:flex items-center gap-20 text-green-600 text-4xl">
          <Link to="/cart" title="Cart">
            <FaShoppingCart className="hover:text-green-800 cursor-pointer hover:scale-105 transition" />
          </Link>
          <Link to="/profile" title="Account">
            <img
              src={ac_Logo}
              alt="Account"
              className="w-12 h-12 rounded-full object-cover border border-green-600 hover:scale-105 transition"
            />
          </Link>
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
            <Link
              to="/profile"
              title="Account"
              onClick={() => setIsMenuOpen(false)}
            >
              <img
                src={ac_Logo}
                alt="Account"
                className="w-9 h-9 rounded-full border border-green-600 hover:scale-105 transition"
              />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
