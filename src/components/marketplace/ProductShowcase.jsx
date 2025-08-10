import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch top rated products
    fetch("http://localhost:8080/review_and_ratings/get_top_rated_products.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
      });
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Top Rated Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center"
            >
              <img
                src={
                  product.product_images && product.product_images[0]
                    ? product.product_images[0].startsWith("http")
                      ? product.product_images[0]
                      : `http://localhost/Agrilink-Agri-Marketplace/backend/${product.product_images[0]}`
                    : "/no-image.png"
                }
                alt={product.name}
                className="w-32 h-32 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold mb-2">
                {product.name || product.product_name}
              </h3>
              <StarRating rating={product.average_rating} />
              <p className="text-green-700 font-bold mt-2">${product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
