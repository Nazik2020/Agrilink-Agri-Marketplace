import React from "react";

// Import images
import brown from "../../assets/marketplace/all/brown.jpg";
import brown1 from "../../assets/marketplace/all/brown.jpg";
import cinnamon from "../../assets/marketplace/all/cinnamon.jpg";
import plantea from "../../assets/marketplace/all/plantea.jpg";
import yello from "../../assets/marketplace/all/yello.jpg";

const Allproducts = () => {
  const products = [
    {
      id: 1,
      name: "Organic Wheat Seeds",
      details: "High-quality organic wheat seeds for sustainable farming.",
      price: 12.99,
      category: "Seeds",
      image: brown,
    },
    {
      id: 2,
      name: "Premium Tomato Plant",
      details: "Robust tomato plants for year-round harvest.",
      price: 8.5,
      category: "Products",
      image: cinnamon,
    },
    {
      id: 3,
      name: "Corn Seed Pack",
      details: "Non-GMO corn seeds for optimal yield.",
      price: 15.75,
      category: "Seeds",
      image: plantea,
    },
    {
      id: 4,
      name: "Special Fertilizer Offer",
      details: "Limited-time offer on organic fertilizer blend.",
      price: 9.99,
      category: "Offers",
      image: yello,
    },
    {
      id: 5,
      name: "Nitrogen-Rich Fertilizer",
      details: "Enhance crop growth with this premium fertilizer.",
      price: 14.5,
      category: "Fertilizer",
      image: brown1,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white p-4 rounded-xl shadow-lg border border-green-100"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3
            className="text-lg sm:text-xl font-semibold text-green-700 mb-2 hover:underline cursor-pointer"
            // Removed window.location.href, keeping hover effect for future use
          >
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            {product.details}
          </p>
          <p className="text-green-600 font-bold text-base sm:text-lg mb-4">
            ${product.price.toFixed(2)}
          </p>
          <button
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            onClick={() => alert(`Added ${product.name} to cart!`)} // Placeholder for cart logic
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default Allproducts;
