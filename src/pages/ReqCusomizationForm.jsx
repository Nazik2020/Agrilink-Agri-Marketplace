import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const ReqCusomizationForm = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 mt-20">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Customization Form!
          </h1>
          <p className="text-gray-600 mb-6">
            This is a test page to verify navigation is working properly.
          </p>
          <Link
            to="/marketplace"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReqCusomizationForm;
