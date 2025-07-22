// src/components/OurFutureProducts.jsx
import React from "react";


const OurFutureProducts = () => {
  const products = [
    {
      name: "Green tea",
      price: "$10.50",
      description: "Naturally grown, rich in flavor and freshness.",
      image: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg",
    },
    {
      name: "Organic Carrots",
      price: "$5.75",
      description: "Crunchy, sweet and full of nutrients.",
      image: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg",
    },
    {
      name: "Green Beans",
      price: "$7.25",
      description: "Picked fresh for maximum nutrition.",
      image: "https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg",
    },
    {
      name: "Healthy Broccoli",
      price: "$6.90",
      description: "High in fiber and antioxidants.",
      image: "https://images.pexels.com/photos/47347/broccoli-vegetable-food-healthy-47347.jpeg",
    },
    {
      name: "Farm Cucumbers",
      price: "$4.50",
      description: "Hydrating and crisp farm cucumbers.",
      image: "https://images.pexels.com/photos/37528/cucumber-salad-food-healthy-37528.jpeg",
    },
    {
      name: "Sweet Bell Peppers",
      price: "$8.00",
      description: "Colorful and full of vitamins.",
      image: "https://images.pexels.com/photos/594137/pexels-photo-594137.jpeg",
    },
  ];

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14452F] mb-4">
            Trending Products
          </h2>
          <p className="text-xl text-green-600 font-medium">
            Nourishing the world from seed to table
          </p>
        </div>

        {/* Product Cards in 2 Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-green-50 rounded-xl shadow-md overflow-hidden transition hover:shadow-lg hover:scale-105 duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-bold text-[#14452F]">
                  {product.name}
                </h3>
                <p className="text-gray-700 text-sm">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-semibold text-green-600">
                    {product.price}
                  </span>
                  <button className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurFutureProducts;
