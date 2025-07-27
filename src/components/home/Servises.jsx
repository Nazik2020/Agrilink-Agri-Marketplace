import React from "react";

// Import your images
import analytics from "../../assets/landing_page/seller_analytics.jpg";
import deliver from "../../assets/landing_page/delivering.jpg";
import feedback from "../../assets/landing_page/feedback.jpg";

const Services = () => {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14452F] mb-4">
            Our Services
          </h2>
          <p className="text-xl text-green-600 font-medium">
            Empowering Agriculture Through Innovation
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Service 1 - Seller Analytics */}
          <div className="bg-green-50 rounded-xl shadow-md overflow-hidden transition hover:shadow-lg hover:scale-105 duration-300">
            <img
              src={analytics}
              alt="Seller Analytics"
              className="w-full h-48 object-cover"
            />
            <div className="p-6 space-y-3">
              <h3 className=" text-[25px] font-bold text-[#14452F]">
                Seller Analytics
              </h3>
              <p className="text-s text-gray-500 text-justify">
              Easily track your revenue, monitor profit margins, and gain valuable business insights through clear visual charts, 
              detailed summaries, 
              and performance analytics..all designed to help you make smarter decisions and grow with confidence.
              </p>
             
            </div>
          </div>

          {/* Service 2 - Fast Delivery */}
          <div className="bg-green-50 rounded-xl shadow-md overflow-hidden transition hover:shadow-lg hover:scale-105 duration-300">
            <img
              src={deliver}
              alt="Fast Delivery"
              className="w-full h-48 object-cover"
            />
            <div className="p-6 space-y-3">
              <h3 className=" text-[25px] font-bold text-[#14452F]">
              Global Market Access
              </h3>
              <p className="text-s text-gray-500 text-justify">
              Break beyond borders with AgriLink’s global marketplace. Promote your products to international buyers, 
              manage export-ready listings, and access tools that simplify compliance, logistics, and communication 
              </p>
              
            </div>
          </div>

          {/* Service 3 - Customer Feedback */}
          <div className="bg-green-50 rounded-xl shadow-md overflow-hidden transition hover:shadow-lg hover:scale-105 duration-300">
            <img
              src={feedback}
              alt="Customer Feedback"
              className="w-full h-48 object-cover"
            />
            <div className="p-6 space-y-3">
              <h3 className="text-[25px] font-bold text-[#14452F]">
              Verified Buyer Reviews
              </h3>
              <p className=" text-s text-gray-500 text-justify">
              Collect authentic reviews from verified buyers to build credibility, understand market demands, and refine your offerings...
              all while growing a trusted presence in the global agri-marketplace.
              </p>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
