import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import { useCart } from "../cart/CartContext";

const Allproducts = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost/backend/get_products.php"
        );
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        setError("Error loading products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.product_name,
      seller: product.seller_name,
      category: product.category,
      price: parseFloat(product.price),
      maxQuantity: 10, // Default max quantity
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="ml-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No products state
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">🛒</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            No Products Available Yet
          </h3>
          <p className="text-gray-600 text-lg mb-2">
            The marketplace is currently empty.
          </p>
          <p className="text-gray-500 mb-8">
            Be the first to list your agricultural products!
          </p>

          <div className="space-y-4">
            <button
              onClick={() =>
                (window.location.href = "/seller-dashboard/add-product")
              }
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer font-semibold"
            >
              Start Selling
            </button>
            <div className="text-sm text-gray-500">
              <p>Are you a farmer or seller?</p>
              <p>Join our marketplace and start selling your products today!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition flex flex-col h-[370px] w-full max-w-xs mx-auto relative"
        >
          {/* Special Offer Badge */}
          {product.special_offer &&
            product.special_offer !== "No Special Offer" && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                {product.special_offer}
              </span>
            )}

          <Link to={`/product/${product.id}`} className="block">
            <img
              src={
                product.product_images && product.product_images.length > 0
                  ? `http://localhost/backend/${product.product_images[0]}`
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
  );
};

export default Allproducts;
