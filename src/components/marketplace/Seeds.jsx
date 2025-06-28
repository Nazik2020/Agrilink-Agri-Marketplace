import React from "react";
import { Link } from "react-router-dom";
import yello from "../../assets/marketplace/seeds/yello.jpg";
import brown1 from "../../assets/marketplace/seeds/brown1.jpg";

const Seeds = () => {
  const products = [
    {
      id: 1,
      name: "Organic Wheat Seeds",
      details: "High-quality organic wheat seeds for sustainable farming.",
      price: 12.99,
      category: "Seeds",
      image: yello,
    },
    {
      id: 3,
      name: "Corn Seed Pack",
      details: "Non-GMO corn seeds for optimal yield.",
      price: 15.75,
      category: "Seeds",
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
          <Link to={`/product/${product.id}`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x200?text=Image+Not+Found";
              }}
            />
          </Link>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-2 cursor-pointer">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            {product.details}
          </p>
          <p className="text-green-600 font-bold text-base sm:text-lg mb-4">
            ${product.price.toFixed(2)}
          </p>
          <button
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
            onClick={() => alert(`Added ${product.name} to cart!`)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default Seeds;
