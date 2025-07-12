import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
// You can replace these with your own images
import customerImg from "../assets/WelcomingPage/CustomerSignup.jpg";
import sellerImg from "../assets/WelcomingPage/SellerSignup.jpg";

const Welcoming = () => {
  const navigate = useNavigate();

  const handleCustomerClick = () => {
    navigate("/CustomerSignup");
  };

  const handleSellerClick = () => {
    navigate("/SellerSignup");
  };

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-[70vh]">
        <div className="text-center mt-10">
          <h1 className="text-[#219653] font-semibold text-4xl md:text-5xl italic py-30">
            Welcome to AgriLink
          </h1>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-50 mt-10 mb-8 items-center">
          {/* Customer Card */}
          <div className="text-center max-w-xs rounded-2xl shadow-xl transition-shadow duration-200 hover:shadow-2xl bg-white p-8">
            <img
              src={customerImg}
              alt="Customer"
              className="w-40 h-40 rounded-full shadow-md mb-5 object-cover mx-auto"
            />
            <button 
              onClick={handleCustomerClick}
              className="text-[#219653] font-semibold text-[15px] bg-[#E8F8EF] rounded-md px-4 py-2 mt-2 mb-2 transition-colors duration-200 hover:bg-[#219653] hover:text-white cursor-pointer"
            >
              I'm a Customer
            </button>
            <p className="text-gray-500 text-base mt-2">
              Buy fresh produce, seeds, tools, and more directly from trusted
              sellers.
            </p>
          </div>
          {/* Seller Card */}
          <div className="text-center max-w-xs rounded-2xl  shadow-md transition-shadow duration-200 hover:shadow-2xl bg-white p-8">
            <img
              src={sellerImg}
              alt="Seller"
              className="w-40 h-40 rounded-full shadow-md mb-5 object-cover mx-auto"
            />
            <button 
              onClick={handleSellerClick}
              className="text-[#219653] font-semibold text-[15px] bg-[#E8F8EF] rounded-md px-4 py-2 mt-2 mb-2 transition-colors duration-200 hover:bg-[#219653] hover:text-white cursor-pointer"
            >
              I'm a Seller
            </button>
            <p className="text-gray-500 text-base mt-2">
              Manage your farm products, view orders, and connect with new
              customers.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Welcoming;
