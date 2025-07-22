import React from "react";


const Services = () => {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14452F] mb-4">
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
              src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg"
              alt="Seller Analytics"
              className="w-full h-48 object-cover"
            />
            <div className="p-6 space-y-3">
              <h3 className=" text-[25px] font-bold text-[#14452F]">
                Seller Analytics
              </h3>
              <p className="text-[18px] text-gray-500">
                Track revenue, profits, and business insights with clean visual
                charts and summaries.
              </p>
              <button className="mt-4 px-6 py-2 border-2 border-green-600 rounded-full text-green-600 font-medium hover:bg-green-600 hover:text-white transition">
                Read More →
              </button>
            </div>
          </div>

          {/* Service 2 - Fast Delivery */}
          <div className="bg-green-50 rounded-xl shadow-md overflow-hidden transition hover:shadow-lg hover:scale-105 duration-300">
            <img
              src="https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg"
              alt="Fast Delivery"
              className="w-full h-48 object-cover"
            />
            <div className="p-6 space-y-3">
              <h3 className=" text-[25px] font-bold text-[#14452F]">
                Fast Delivery
              </h3>
              <p className="text-[18px] text-gray-500">
                Ensure fast and secure delivery of farm products to your
                customers' doorsteps.
              </p>
              <button className="mt-4 px-6 py-2 border-2 border-green-600 rounded-full text-green-600 font-medium hover:bg-green-600 hover:text-white transition">
                Read More →
              </button>
            </div>
          </div>

          {/* Service 3 - Customer Feedback */}
          <div className="bg-green-50 rounded-xl shadow-md overflow-hidden transition hover:shadow-lg hover:scale-105 duration-300">
            <img
              src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg"
              alt="Customer Feedback"
              className="w-full h-48 object-cover"
            />
            <div className="p-6 space-y-3">
              <h3 className="text-[25px] font-bold text-[#14452F]">
                Customer Feedback
              </h3>
              <p className=" text-[18px] text-gray-500 ">
                Get real-time insights and improve your service based on
                verified customer feedback.
              </p>
              <button className="mt-4 px-6 py-2 border-2 border-green-600 rounded-full text-green-600 font-medium hover:bg-green-600 hover:text-white transition">
                Read More →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
