import React, { useState } from "react";
import Allproducts from "../components/marketplace/Allproducts";
import Fertilizer from "../components/marketplace/Fertilzer";
import Offers from "../components/marketplace/Offers";
import Products from "../components/marketplace/Products";
import Seeds from "../components/marketplace/Seeds";
import Footer from "../components/common/Footer";

const Marketplace = () => {
  const [filter, setFilter] = useState("All");

  return (
    <>
      <section className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#14452F] text-center  py-20">
            Explore Our Marketplace
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setFilter("All")}
              className={`px-5 py-2 cursor-pointer rounded-full ${
                filter === "All"
                  ? "bg-green-600 text-white"
                  : "bg-white text-green-700 border border-green-300"
              } hover:bg-green-700 hover:text-white transition`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("Products")}
              className={`px-5 py-2 cursor-pointer rounded-full ${
                filter === "Products"
                  ? "bg-green-600 text-white"
                  : "bg-white text-green-700 border border-green-300"
              } hover:bg-green-700 hover:text-white transition`}
            >
              Products
            </button>
            <button
              onClick={() => setFilter("Seeds")}
              className={`px-5 py-2 cursor-pointer rounded-full ${
                filter === "Seeds"
                  ? "bg-green-600 text-white"
                  : "bg-white text-green-700 border border-green-300"
              } hover:bg-green-700 hover:text-white transition`}
            >
              Seeds
            </button>
            <button
              onClick={() => setFilter("Offers")}
              className={`px-5 py-2 cursor-pointer rounded-full ${
                filter === "Offers"
                  ? "bg-green-600 text-white"
                  : "bg-white text-green-700 border border-green-300"
              } hover:bg-green-700 hover:text-white transition`}
            >
              Offers
            </button>
            <button
              onClick={() => setFilter("Fertilizer")}
              className={`px-5 py-2 cursor-pointer rounded-full ${
                filter === "Fertilizer"
                  ? "bg-green-600 text-white"
                  : "bg-white text-green-700 border border-green-300"
              } hover:bg-green-700 hover:text-white transition`}
            >
              Fertilizer
            </button>
          </div>
          {filter === "All" && <Allproducts />}
          {filter === "Products" && <Products />}
          {filter === "Seeds" && <Seeds />}
          {filter === "Offers" && <Offers />}
          {filter === "Fertilizer" && <Fertilizer />}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Marketplace;
