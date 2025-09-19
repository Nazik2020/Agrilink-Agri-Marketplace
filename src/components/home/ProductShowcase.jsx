import StarRating from "../marketplace/StarRating";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../cart/CartContext";
import SimpleWishlistButton from "../wishlist/SimpleWishlistButton";
import { getApiUrl } from "../../config/api";

const ProductShowcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchTopRatedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(getApiUrl('GET_TOP_RATED_PRODUCTS'));
        const data = await response.json();
        
        if (data.success) {
          // Separate rated and unrated products
          const rated = data.products
            .filter(
              (p) =>
                typeof p.average_rating === "number" && !isNaN(p.average_rating)
            )
            .sort((a, b) => b.average_rating - a.average_rating);
          const unrated = data.products.filter(
            (p) => !rated.includes(p)
          );
          // Always show 6: fill with unrated if needed
          const top6 = rated.concat(unrated).slice(0, 6);
          setProducts(top6);
        } else {
          setError("Failed to fetch products");
        }
      } catch (error) {
  // Error fetching products
        setError("Error loading products");
      } finally {
        setLoading(false);
      }
    };
    fetchTopRatedProducts();
  }, []);

  // Instant stock update
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
    const priceToUse = product.effective_price != null ? parseFloat(product.effective_price) : parseFloat(product.price);
    addToCart({
      id: product.id,
      name: product.product_name,
      seller: product.seller_name,
      category: product.category,
      price: priceToUse,
      maxQuantity: product.stock > 0 ? product.stock : 0,
    });
  };

  if (loading) {
    return (
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14452F] mb-4">
              Top Rated Products
            </h2>
            <p className="text-xl text-green-600 font-medium">
              Discover the best rated products from our marketplace
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
              Top Rated Products
            </h2>
            <p className="text-xl text-green-600 font-medium">
              Discover the best rated products from our marketplace
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
            Top Rated Products
          </h2>
          <p className="text-xl text-green-600 font-medium">
            Discover the best rated products from our marketplace
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
              {product.special_offer &&
                product.special_offer !== "No Special Offer" && (
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
                  src={(function () {
                    let imagesArr = [];
                    if (!product.product_images) {
                      return "https://via.placeholder.com/300x200?text=No+Image";
                    }
                    if (Array.isArray(product.product_images)) {
                      imagesArr = product.product_images;
                    } else {
                      try {
                        imagesArr = JSON.parse(product.product_images);
                      } catch (error) {
                        imagesArr = [];
                      }
                    }
                    if (imagesArr.length > 0) {
                      const img = imagesArr[0];
                      if (typeof img === "string" && img.startsWith("http")) {
                        return img;
                      } else if (typeof img === "string") {
                        return `http://localhost/Agrilink-Agri-Marketplace/backend/${img}`;
                      }
                    }
                    return "https://via.placeholder.com/300x200?text=No+Image";
                  })()}
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

                {/* Average Rating */}
                <div className="mb-1">
                  <StarRating rating={product.average_rating} />
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
                  {product.product_description &&
                  product.product_description.length > 80
                    ? product.product_description.substring(0, 80) + "..."
                    : product.product_description || ""}
                </p>

                <div className="flex items-end justify-between mt-auto">
                  <div>
                    {product.effective_price != null && parseFloat(product.effective_price) !== parseFloat(product.price) ? (
                      <>
                        <span className="text-green-700 font-bold text-lg mr-2">
                          ${parseFloat(product.effective_price).toFixed(2)}
                        </span>
                        <span className="text-gray-400 text-base line-through">
                          ${parseFloat(product.price).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-green-700 font-bold text-lg">
                        ${parseFloat(product.price).toFixed(2)}
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

export default ProductShowcase;
