// src/components/OurFutureProducts.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import { useCart } from "../cart/CartContext";
import SimpleWishlistButton from "../wishlist/SimpleWishlistButton";

const OurFutureProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost/backend/get_products.php");
        
        if (response.data.success) {
          // Get random 6 products from the database
          const allProducts = response.data.products;
          const shuffled = allProducts.sort(() => 0.5 - Math.random());
          const randomProducts = shuffled.slice(0, 6);
          
          setProducts(randomProducts);
        } else {
          setError("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error loading products");
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.product_name,
      seller: product.seller_name,
      category: product.category,
      price: parseFloat(product.price),
      maxQuantity: 10,
    });
  };

  if (loading) {
    return (
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14452F] mb-4">
              Trending Products
            </h2>
            <p className="text-xl text-green-600 font-medium">
              Nourishing the world from seed to table
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading products...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14452F] mb-4">
              Trending Products
            </h2>
            <p className="text-xl text-green-600 font-medium">
              Nourishing the world from seed to table
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </div>
      </section>
    );
  }

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

        {/* Product Cards using marketplace structure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition flex flex-col h-[370px] w-full max-w-xs mx-auto relative"
            >
              {/* Special Offer Badge */}
              {product.special_offer && product.special_offer !== "No Special Offer" && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  {product.special_offer}
                </span>
              )}

              {/* Wishlist Button */}
              <div className="absolute top-3 right-3 z-10">
                <SimpleWishlistButton productId={product.id} />
              </div>

              <Link to={`/product/${product.id}`} className="block">
                <img
                  src={
                    product.product_images && product.product_images.length > 0
                      ? product.product_images[0] // Use the full URL from backend
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={product.product_name}
                  className="w-full h-40 object-cover rounded-t-2xl"
                />
              </Link>

              <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-green-600 font-semibold text-sm">
                    {product.category}
                  </span>
                  <span className="text-gray-500 text-xs">
                    by {product.seller_name || "Unknown"}
                  </span>
                </div>

                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-green-700">
                    {product.product_name}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {product.product_description.length > 80
                    ? product.product_description.substring(0, 80) + "..."
                    : product.product_description}
                </p>

                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <span className="text-green-700 font-bold text-lg">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                  </div>
                  <button
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition text-base"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FaShoppingCart className="text-lg" /> Add
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
