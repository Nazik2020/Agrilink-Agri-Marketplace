import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import { useCart } from "../cart/CartContext";
import SimpleWishlistButton from "../wishlist/SimpleWishlistButton";
import StarRating from "./StarRating";

const Offers = ({ displayCount = 8 }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Offers component: Fetching products...");
        const response = await axios.get(
          "http://localhost/Agrilink-Agri-Marketplace/backend/get_products.php?category=Offers"
        );
        console.log("Offers component: Response received:", response.data);

        if (response.data.success) {
          console.log(
            "Offers component: Products found:",
            response.data.products.length
          );
          console.log(
            "Offers component: Products data:",
            response.data.products
          );
          setProducts(response.data.products);
        } else {
          console.log(
            "Offers component: API returned error:",
            response.data.message
          );
          setError(
            "Failed to fetch products: " +
              (response.data.message || "Unknown error")
          );
        }
      } catch (err) {
        console.error("Offers component: Error fetching products:", err);
        setError("Error loading products: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Instant stock update when an order is paid
  useEffect(() => {
    const handleOrderPaid = (e) => {
      const { productId } = e.detail || {};
      const qtyToSubtract = (e.detail && (e.detail.deliveredQuantity ?? e.detail.quantity)) || 1;
      if (!productId) return;
      setProducts((prev) =>
        prev.map((p) =>
          String(p.id) === String(productId)
            ? { ...p, stock: Math.max(0, (parseInt(p.stock, 10) || 0) - (qtyToSubtract || 1)) }
            : p
        )
      );
    };
    window.addEventListener("orderPaid", handleOrderPaid);
    return () => window.removeEventListener("orderPaid", handleOrderPaid);
  }, []);

  const handleAddToCart = (product) => {
    if (!product || !product.id || !product.product_name) {
      console.error("Invalid product data for cart:", product);
      return;
    }

    const priceToUse = product.effective_price != null ? parseFloat(product.effective_price) : parseFloat(product.price || 0);
    addToCart({
      id: product.id,
      name: product.product_name,
      seller: product.seller_name || "Unknown Seller",
      category: product.category || "Offers",
      price: priceToUse,
      maxQuantity: 10,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="ml-4 text-gray-600">Loading offers...</p>
      </div>
    );
  }

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

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            No Special Offers Available Yet
          </h3>
          <p className="text-gray-600 text-lg mb-2">
            We currently don't have any special offers or deals.
          </p>
          <p className="text-gray-500">
            Check back later for amazing deals and discounts!
          </p>
        </div>
      </div>
    );
  }

  // Get products to display based on displayCount
  const displayedProducts = products.slice(0, displayCount);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {displayedProducts.map((product) => {
        if (!product || !product.id || !product.product_name) {
          console.warn("Invalid product data:", product);
          return null;
        }

        return (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition flex flex-col h-[370px] w-full max-w-xs mx-auto relative"
          >
            {/* Discount Badge */}
            {product.special_offer && (
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
                    ? product.product_images[0]
                    : "https://via.placeholder.com/300x200?text=Image+Not+Found"
                }
                alt={product.product_name}
                className="w-full h-40 object-cover rounded-t-2xl"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=Image+Not+Found";
                }}
              />
            </Link>

            <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
              {/* Average Rating */}
              <div className="mb-1">
                <StarRating rating={product.average_rating} />
              </div>

              <div className="flex items-center justify-between mb-1">
                <span className="text-green-600 font-semibold text-sm">
                  {product.category || "Offers"}
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
                  <span className="text-gray-500 text-xs ml-2">
                    ({product.stock} left)
                  </span>
                )}
              </div>

              <Link to={`/product/${product.id}`} title={product.product_name}>
                <h3
                  className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-green-700 truncate"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%",
                  }}
                >
                  {product.product_name}
                </h3>
              </Link>

              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {product.product_description || "Special offer product"}
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
        );
      })}
    </div>
  );
};

export default Offers;
