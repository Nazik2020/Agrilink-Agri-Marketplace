import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Allproducts from "../components/marketplace/Allproducts";
import Fertilizer from "../components/marketplace/Fertilzer";
import Offers from "../components/marketplace/Offers";
import Products from "../components/marketplace/Products";
import Seeds from "../components/marketplace/Seeds";
import Footer from "../components/common/Footer";
import { FaLeaf, FaSeedling, FaGift, FaFlask, FaStar } from "react-icons/fa";
import axios from "axios";

const Marketplace = () => {
  const [filter, setFilter] = useState("All");
  const [displayCount, setDisplayCount] = useState(8); // Show 8 products initially
  const [productCount, setProductCount] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const navigate = useNavigate();

  const filterOptions = [
    { id: "All", label: "All", icon: FaLeaf },
    { id: "Products", label: "Products", icon: FaStar },
    { id: "Seeds", label: "Seeds", icon: FaSeedling },
    { id: "Offers", label: "Offers", icon: FaGift },
    { id: "Fertilizer", label: "Fertilizer", icon: FaFlask },
  ];

  // Fetch product count from database
  useEffect(() => {
    const fetchProductCount = async () => {
      try {
  const response = await axios.get("http://localhost/Agrilink-Agri-Marketplace/backend/get_products.php");
        if (response.data.success) {
          const count = response.data.products.length;
          setProductCount(count);
          // Start counting animation after a short delay
          setTimeout(() => {
            setIsCounting(true);
          }, 500);
        }
      } catch (error) {
        console.error("Error fetching product count:", error);
        setProductCount(500); // Fallback count
        setTimeout(() => {
          setIsCounting(true);
        }, 500);
      }
    };

    fetchProductCount();
  }, []);

  // Animated counter effect
  useEffect(() => {
    if (isCounting && productCount > 0) {
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 steps for smooth animation
      const increment = productCount / steps;
      const stepDuration = duration / steps;
      
      let currentCount = 0;
      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= productCount) {
          currentCount = productCount;
          setIsCounting(false);
          clearInterval(timer);
        }
        setDisplayedCount(Math.floor(currentCount));
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isCounting, productCount]);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 8); // Load 8 more products
  };

  const handleBecomeSeller = () => {
    navigate("/SellerSignup");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white min-h-screen" style={{ paddingTop: '20pt' }}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-8">
              <FaLeaf className="text-white text-3xl" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Explore Our{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Where Nature Meets Opportunity
            </p>
            
            <p className="text-lg text-gray-500 mb-12 max-w-4xl mx-auto leading-relaxed">
            Step into a world of premium tea, hand-harvested cinnamon, bold, aromatic spices, enriched, 
            eco-friendly fertilizers, and certified high-yield seeds — carefully sourced from dedicated growers
             and delivered to discerning buyers across global markets.

            At AgriLink, every product tells a story of quality, sustainability, and trusted partnerships that span continents.
            </p>

            {/* Stats Section - Only Premium Products */}
            <div className="flex justify-center mb-16">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="text-3xl font-bold text-green-600 mb-2 transition-all duration-300">
                  {isCounting ? (
                    <span className="animate-pulse">{displayedCount}+</span>
                  ) : (
                    <span className="transform scale-110 transition-transform duration-700">{displayedCount}+</span>
                  )}
                </div>
                <div className="text-gray-600">Premium Products</div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Browse Categories</h2>
              <p className="text-gray-600">Discover products that match your needs</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {filterOptions.map((option) => {
                const IconComponent = option.icon;
                return (
            <button
                    key={option.id}
                    onClick={() => setFilter(option.id)}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      filter === option.id
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        : "bg-white text-gray-700 border-2 border-green-200 hover:border-green-400 hover:bg-green-50"
                    }`}
                  >
                    <IconComponent className={`text-sm transition-colors duration-300 ${
                      filter === option.id ? "text-white" : "text-green-600 group-hover:text-green-700"
                    }`} />
                    <span className="text-sm">{option.label}</span>
            </button>
                );
              })}
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {filter === "All" ? "All Products" : `${filter} Collection`}
              </h2>
              <p className="text-gray-600">
                {filter === "All" 
                  ? "Explore our complete collection of agricultural products"
                  : `Discover our premium ${filter.toLowerCase()} selection`
                }
              </p>
            </div>

            <div className="min-h-[600px]">
              {filter === "All" && <Allproducts displayCount={displayCount} />}
              {filter === "Products" && <Products displayCount={displayCount} />}
              {filter === "Seeds" && <Seeds displayCount={displayCount} />}
              {filter === "Offers" && <Offers displayCount={displayCount} />}
              {filter === "Fertilizer" && <Fertilizer displayCount={displayCount} />}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
            <button
                onClick={handleLoadMore}
                className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105 hover:from-green-600 hover:to-emerald-700"
              >
                <span className="flex items-center gap-2">
                  Load More Products
                  <FaLeaf className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                </span>
            </button>
            </div>

            {/* Become a Seller Section */}
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200">
                <div className="max-w-2xl mx-auto">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6">
                    <FaLeaf className="text-white text-2xl" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Ready to Start Selling?
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Join our community of trusted sellers and showcase your premium agricultural products 
                    to buyers worldwide. Start your journey with AgriLink today!
                  </p>
                  
                  <div className="flex justify-center">
            <button
                      onClick={handleBecomeSeller}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:from-green-600 hover:to-emerald-700"
            >
                      Become a Seller
            </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Marketplace;
