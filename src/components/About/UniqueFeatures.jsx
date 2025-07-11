import React from "react";
import { FaGlobe, FaCogs, FaChartBar, FaBolt } from "react-icons/fa";

const features = [
  {
    title: "Global Reach",
    description:
      "Connect with markets worldwide, expanding your reach beyond local boundaries.",
    icon: <FaGlobe className="text-2xl text-black" />,
  },
  {
    title: "Product Customization",
    description:
      "Tailor your products to meet specific market demands, ensuring optimal sales.",
    icon: <FaCogs className="text-2xl text-black" />,
  },
  {
    title: "Seller Analytics",
    description:
      "Join a network of farmers and experts, sharing knowledge and support.",
    icon: <FaChartBar className="text-2xl text-black" />,
  },
  {
    title: "Efficiency",
    description:
      "Streamline your operations with our efficient platform, saving time and resources.",
    icon: <FaBolt className="text-2xl text-black" />,
  },
];

const UniqueFeatures = () => (
  <div className="w-full py-16 bg-white min-w-screen">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-10">
        Our Unique Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-start shadow-sm"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-[16px]">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default UniqueFeatures;
