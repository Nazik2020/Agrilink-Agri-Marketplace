// src/components/AboutSection.jsx
import React from "react";
import { FaSeedling, FaLeaf } from "react-icons/fa";

const AboutSection = () => {
  return (
    <section className="bg-[#14452F] py-16 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left Section - Who We Are */}
        <div className="w-full lg:w-2/3">
          <h3 className="text-2xl font-semibold mb-6">Who We Are</h3>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">
            Nourishing world from seed to table
          </h2>
          <p className="text-gray-300 mb-6">
            Agriculture and farming are essential industries that involve the
            cultivation of crops, raising of livestock, and production of food.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-800 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <FaSeedling className="text-yellow-400 text-5xl" />
              </div>
              <h4 className="text-xl font-sans mb-2">
                Growing stron a feeding
              </h4>
            </div>
            <div className="bg-green-800 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <FaLeaf className="text-yellow-400 text-5xl" />
              </div>
              <h4 className="text-xl font-sans mb-2">
                Taking care of the Earth
              </h4>
            </div>
          </div>
        </div>

        {/* Right Section - Leave Message */}
        <div className="w-full lg:w-1/3 bg-green-800 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-6">
            Share your Experience with Us!
          </h3>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 bg-green-700 rounded-lg border-none focus:outline-none"
            />
            <input
              type="email"
              placeholder="E-mail"
              className="w-full p-3 bg-green-700 rounded-lg border-none focus:outline-none"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full p-3 bg-green-700 rounded-lg border-none focus:outline-none"
            />

            <textarea
              placeholder="Message"
              className="w-full p-3 bg-green-700 rounded-lg border-none focus:outline-none h-24 resize-none"
            ></textarea>
            <button
              type="submit"
              className="w-full cursor-pointer bg-yellow-400 text-green-900 font-semibold py-3 rounded-lg hover:bg-yellow-500 transition"
            >
              Submit Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
