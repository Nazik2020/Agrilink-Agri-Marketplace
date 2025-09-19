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
      <div className="min-h-[80vh] bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col justify-center">
        <div className="text-center mt-25 mb-2">
          <h1 className="text-[#219653] font-extrabold text-5xl md:text-6xl italic py-6 drop-shadow-lg">
            Welcome to AgriLink
          </h1>
          <p className="text-lg md:text-lg text-gray-400 font-medium mt-2 mb-4">
            Connecting Sri Lanka's growers and buyers for a thriving marketplace
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-20 mt-10 mb-12 items-center">
          {/* Customer Card */}
          <div className="text-center max-w-xs min-h-[480px] flex flex-col justify-between rounded-3xl shadow-2xl transition-shadow duration-200 hover:shadow-green-300 bg-white p-8 border border-green-100">
            <img
              src={customerImg}
              alt="Customer"
              className="w-40 h-40 rounded-full shadow-lg mb-5 object-cover mx-auto border-4 border-green-200"
            />
            <button
              onClick={handleCustomerClick}
              className="text-[#219653] font-bold text-[16px] bg-[#E8F8EF] rounded-full px-6 py-2 mt-2 mb-2 transition-colors duration-200 hover:bg-[#219653] hover:text-white cursor-pointer shadow"
            >
              I'm a Customer
            </button>
            <p className="text-gray-600 text-base mt-3 mb-2">
              <span className="font-semibold text-green-700">Shop Directly</span> for fresh produce, seeds, fertilizers, spices and more from trusted sellers. Enjoy secure payments, customizable options, and exclusive offers!
            </p>
            <ul className="text-left text-sm text-gray-500 mt-2 list-disc pl-5 flex-grow">
              <li>Browse top-rated products</li>
              <li>Track your orders easily</li>
              <li>Personalized recommendations</li>
            </ul>
          </div>
          {/* Seller Card */}
          <div className="text-center max-w-xs min-h-[480px] flex flex-col justify-between rounded-3xl shadow-2xl transition-shadow duration-200 hover:shadow-green-300 bg-white p-8 border border-green-100">
            <img
              src={sellerImg}
              alt="Seller"
              className="w-40 h-40 rounded-full shadow-lg mb-5 object-cover mx-auto border-4 border-green-200"
            />
            <button
              onClick={handleSellerClick}
              className="text-[#219653] font-bold text-[16px] bg-[#E8F8EF] rounded-full px-6 py-2 mt-2 mb-2 transition-colors duration-200 hover:bg-[#219653] hover:text-white cursor-pointer shadow"
            >
              I'm a Seller
            </button>
            <p className="text-gray-600 text-base mt-3 mb-2">
              <span className="font-semibold text-green-700">Grow Your Business</span> by listing farm products, managing orders, and connecting with new customers. Access analytics and marketing tools!
            </p>
            <ul className="text-left text-sm text-gray-500 mt-2 list-disc pl-5 flex-grow">
              <li>Easy product management</li>
              <li>Customization of products</li>
              <li>Insights to boost your sales</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-6 mb-10">
          <p className="text-green-800 text-lg font-semibold">Join AgriLink today and be part of Sri Lanka's agricultural revolution!</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Welcoming;
