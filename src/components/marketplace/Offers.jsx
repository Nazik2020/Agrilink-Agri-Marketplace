import React from "react";
import { Link } from "react-router-dom";
import plantea from "../../assets/marketplace/offers/plantea.jpg";

const Offers = () => {
  const products = [
    {
      id: 4,
      name: "Special Fertilizer Offer",
      details: "Limited-time offer on organic fertilizer blend.",
      price: 9.99,
      category: "Offers",
      image: plantea,
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

export default Offers;
