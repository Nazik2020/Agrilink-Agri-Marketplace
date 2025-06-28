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
      <section className="bg-green-50 min-h-screen py-20 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Filter Options */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setFilter("All")}
              className={`px-4 py-2 rounded-lg ${
                filter === "All"
                  ? "bg-white text-green-700 border border-green-300 "
                  : "bg-white text-green-700 border border-green-300"
              } hover:bg-green-700 hover:text-white transition`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("Products")}
              className={`px-4 py-2 rounded-lg ${
                filter === "Products"
                  ? "bg-green-600 text-white"
                  : "bg-white text-green-700 border border-green-300"
              } hover:bg-green-700 hover:text-white transition`}
            >
              Products
            </button>
            <button
              onClick={() => setFilter("Seeds")}
              className={`px-4 py-2 rounded-lg ${
                filter === "Seeds"
                  ? "bg-green-600 text-white"
                  : "bg-white text-green-700 border border-green-300"
              } hover:bg-green-700 hover:text-white transition`}
            >
              Seeds
            </button>
            <button
              onClick={() => setFilter("Offers")}
              className={`px-4 py-2 rounded-lg ${
                filter === "Offers"
                  ? "bg-green-600 text-white"
                  : "bg-white text-green-700 border border-green-300"
              } hover:bg-green-700 hover:text-white transition`}
            >
              Offers
            </button>
            <button
              onClick={() => setFilter("Fertilizer")}
              className={`px-4 py-2 rounded-lg ${
                filter === "Fertilizer"
                  ? "bg-green-600 text-white"
                  : "bg-white text-green-700 border border-green-300"
              } hover:bg-green-700 hover:text-white transition`}
            >
              Fertilizer
            </button>
          </div>

          {/* Render Category Component */}
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
