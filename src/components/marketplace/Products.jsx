import React from "react";

// Import images
import tea from "../../assets/marketplace/products/tea.jpg";

const Products = () => {
  const products = [
    {
      id: 2,
      name: "Premium Tomato Plant",
      details: "Robust tomato plants for year-round harvest.",
      price: 8.5,
      category: "Products",
      image: tea,
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
            // Removed window.location.href
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

export default Products;
