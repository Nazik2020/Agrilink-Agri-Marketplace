import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import StarRating from "./StarRating";
import { useCart } from "../cart/CartContext";
import SimpleWishlistButton from "../wishlist/SimpleWishlistButton";

const Seeds = ({ displayCount = 8 }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch seeds products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost/Agrilink-Agri-Marketplace/backend/get_products.php?category=Seeds"
        );
        if (response.data.success) {
          setProducts(response.data.products || []);
        } else {
          setError("Failed to fetch seeds");
        }
      } catch (err) {
        setError("Error loading seeds");
        console.error("Error fetching seeds:", err);
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
      price: parseFloat(product.effective_price ?? product.price ?? 0),
      image:
        product.product_images && product.product_images.length > 0
          ? product.product_images[0]
          : undefined,
      stock: product.stock ?? 0,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="ml-4 text-gray-600">Loading seeds...</p>
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
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">🌱</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            No Seeds Available Yet
          </h3>
          <p className="text-gray-600 text-lg mb-2">
            We currently don't have any seeds in stock.
          </p>
          <p className="text-gray-500">Check back later for new seed listings!</p>
        </div>
      </div>
    );
  }

  // Get products to display based on displayCount
  const displayedProducts = products.slice(0, displayCount);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {displayedProducts.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition flex flex-col h-[370px] w-full max-w-xs mx-auto relative"
        >
          {product.special_offer && product.special_offer !== "No Special Offer" && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
              {product.special_offer}
            </span>
          )}

          <div className="absolute top-3 right-3 z-10">
            <SimpleWishlistButton productId={product.id} />
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <img
              src={
                product.product_images && product.product_images.length > 0
                  ? product.product_images[0]
                  : "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={product.product_name}
              className="w-full h-40 object-cover rounded-t-2xl"
            />
          </Link>

          <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
            {/* Rating above the category label, like Products Collection */}
            {typeof product.average_rating !== "undefined" && (
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={Number(product.average_rating) || 0} size="sm" />
                <span className="text-sm text-gray-600">
                  {Number(product.average_rating || 0).toFixed(1)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-1">
              <span className="text-green-600 font-semibold text-sm">
                {product.category}
              </span>
              <span className="text-gray-500 text-xs">
                by {product.seller_name || "Unknown"}
              </span>
            </div>
            <div className="flex items-center mb-1">
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold text-xs">
                  In Stock
                </span>
              ) : (
                <span className="text-red-500 font-semibold text-xs">
                  Out of Stock
                </span>
              )}
              {product.stock > 0 && (
                <span className="text-gray-500 text-xs ml-2">({product.stock} left)</span>
              )}
            </div>
            <Link to={`/product/${product.id}`} title={product.product_name}>
              <h3
                className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-green-700 truncate"
                style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}
              >
                {product.product_name}
              </h3>
            </Link>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {product.product_description && product.product_description.length > 80
                ? product.product_description.substring(0, 80) + "..."
                : product.product_description || "High quality seeds for your garden"}
            </p>
            <div className="flex items-end justify-between mt-auto">
              <div>
                {product.effective_price != null && parseFloat(product.effective_price) !== parseFloat(product.price || 0) ? (
                  <>
                    <span className="text-green-700 font-bold text-lg mr-2">
                      ${parseFloat(product.effective_price).toFixed(2)}
                    </span>
                    <span className="text-gray-400 text-base line-through">
                      ${parseFloat(product.price || 0).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-green-700 font-bold text-lg">
                    ${parseFloat(product.price || 0).toFixed(2)}
                  </span>
                )}
              </div>
              <button
                className={`flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition text-base ${
                  product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                <FaShoppingCart className="text-lg" />
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Seeds;
