// Helper to get current user from sessionStorage
function getCurrentUser() {
  try {
    const userString = sessionStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    return null;
  }
}
("use client");

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import Footer from "../components/common/Footer";
import CustomizationModal from "../components/marketplace/CustomizationModal";
import { useCart } from "../components/cart/CartContext";
import StarRating from "../components/marketplace/StarRating";
import SimpleWishlistButton from "../components/wishlist/SimpleWishlistButton";
import { FlagButton } from "../components/Flag";
import axios from "axios";
import { API_BASE, buildImageUrl } from "../config/api";

// Function to fetch product details from backend
const fetchProductDetails = async (productId) => {
  try {
    const url = `${API_BASE}get_product_details.php?id=${productId}`;
    const response = await axios.get(url);
    if (response.data.success) {
      return response.data.product;
    } else {
      throw new Error(
        response.data.message || "Failed to fetch product details"
      );
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};

// Exported React hook for use in checkout/payment flow
// Usage example in your checkout/payment component:
//   import { useProductDetailsRefresh } from "./ProductDetails";
//   const refreshProductDetails = useProductDetailsRefresh(productId, setProduct);
//   // After successful payment:
//   refreshProductDetails();
export function useProductDetailsRefresh(productId, setProduct) {
  return () => {
    if (productId) {
      fetchProductDetails(productId)
        .then((data) => setProduct(data))
        .catch((error) =>
          console.error("Error refreshing product details:", error)
        );
    }
  };
}

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL
  const { addToCart } = useCart();

  // SECTION: State Management
  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");
  // Removed quantity state; quantity is now managed in the cart only
  const [showCustomize, setShowCustomize] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(5);

  // Listen for a custom event after payment to refresh product details
  useEffect(() => {
    function handleOrderPaid(e) {
      console.log(
        "[ProductDetails] orderPaid event received:",
        e.detail,
        "Current page id:",
        id,
        typeof id
      );
      // e.detail.productId can be used to filter, but here we always refresh
      if (id) {
        fetchProductDetails(id)
          .then((data) => setProduct(data))
          .catch((error) =>
            console.error(
              "Error refreshing product details after payment:",
              error
            )
          );
      }
    }
    window.addEventListener("orderPaid", handleOrderPaid);
    return () => window.removeEventListener("orderPaid", handleOrderPaid);
  }, [id]);

  // SECTION: Data Fetching
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProductDetails(id)
        .then((data) => {
          setProduct(data);
          // Normalize images (array or comma string)
          let rawImages = [];
          if (Array.isArray(data.images)) rawImages = data.images;
          else if (typeof data.images === "string")
            rawImages = data.images
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          const resolved = rawImages.map(buildImageUrl).filter(Boolean);
          setMainImg(resolved[0] || "");
          // Store normalized images back for thumbnails usage
          data.images = resolved;
          setLoading(false);
        })
        .catch((error) => {
          console.error("ProductDetails: Error fetching product:", error);
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [id]);

  // Add to Cart logic (unchanged)
  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        seller: product.seller.name,
        category: product.category,
        price: product.price,
        quantity: 1, // Always add 1, user can adjust in cart
        maxQuantity: 100, // Default max quantity since we don't have this field
      });
    }
  };

  // To refresh product details (e.g., after payment), use the hook:
  //   import { useProductDetailsRefresh } from "./ProductDetails";
  //   const refreshProductDetails = useProductDetailsRefresh(product.id, setProduct);
  //   // After successful payment:
  //   refreshProductDetails();

  // Fetch reviews from backend
  const fetchReviews = async (productId) => {
    try {
      const response = await axios.get(
        `${API_BASE}review_and_ratings/get_reviews.php?product_id=${productId}`
      );
      if (response.data && response.data.reviews) {
        // No filtering: show all reviews, including multiple from same user
        const mappedReviews = response.data.reviews.map((r) => ({
          id: r.id,
          customer_id: r.customer_id,
          name: r.customer_name,
          rating: r.rating,
          text: r.review_text,
        }));
        setReviews(mappedReviews);
      } else {
        setReviews([]);
      }
    } catch (err) {
      setReviews([]);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReviews(id);
    }
  }, [id]);

  // Get current user
  const currentUser = getCurrentUser();
  const customerId =
    currentUser && currentUser.role === "customer" ? currentUser.id : null;
  console.log("Current user:", currentUser, "CustomerId:", customerId);

  // Submit review to backend
  const handleSubmitReview = async () => {
    if (!customerId) {
      alert("You must be logged in as a customer to submit a review.");
      return;
    }
    if (reviewText.trim()) {
      try {
        const response = await axios.post(
          `${API_BASE}review_and_ratings/add_review.php`,
          {
            product_id: id,
            customer_id: customerId,
            rating: reviewRating,
            comment: reviewText,
          }
        );
        if (response.data.success) {
          setReviewText("");
          setReviewRating(5);
          setReviewSuccess(true);
          fetchReviews(id); // Refresh reviews from backend
          // Refresh product details to update average rating
          fetchProductDetails(id).then((data) => setProduct(data));
          setTimeout(() => setReviewSuccess(false), 3000);
        } else {
          alert(response.data.message || "Failed to add review.");
        }
      } catch (err) {
        alert("Error submitting review.");
      }
    }
  };

  // Edit review handlers (allow editing any review by current user)
  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditReviewText(review.text);
    setEditReviewRating(review.rating);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditReviewText("");
    setEditReviewRating(5);
  };

  const handleSaveEdit = async (reviewId) => {
    if (!editReviewText.trim()) {
      alert("Review cannot be empty.");
      return;
    }
    try {
      // To edit, you may want to call a dedicated edit_review.php, but for now, just add a new review (as per backend logic)
      const response = await axios.post(
        `${API_BASE}review_and_ratings/add_review.php`,
        {
          product_id: id,
          customer_id: customerId,
          rating: editReviewRating,
          comment: editReviewText,
        }
      );
      if (response.data.success) {
        setEditingReviewId(null);
        setEditReviewText("");
        setEditReviewRating(5);
        fetchReviews(id);
        // Refresh product details to update average rating
        fetchProductDetails(id).then((data) => setProduct(data));
      } else {
        alert(response.data.message || "Failed to update review.");
      }
    } catch (err) {
      alert("Error updating review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!customerId) {
      alert("You must be logged in as a customer to delete your review.");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE}review_and_ratings/delete_review.php`,
        {
          review_id: reviewId,
          customer_id: customerId,
        }
      );
      if (response.data.success) {
        fetchReviews(id); // Refresh reviews from backend
        // Refresh product details to update average rating
        fetchProductDetails(id).then((data) => setProduct(data));
      } else {
        alert(response.data.message || "Failed to delete review.");
      }
    } catch (err) {
      alert("Error deleting review.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <span className="text-lg text-gray-500">
            Loading product details...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Product
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/marketplace")}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/marketplace")}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fafbfc] min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 py-2 mt-20">
        <div className="flex flex-col md:flex-row gap-10">
          {/* SECTION: Product Image and Thumbnails */}
          <div className="md:w-1/2 flex flex-col items-center">
            {/* Back button above the main image, aligned left */}
            <button
              onClick={() => navigate(-1)}
              className="mb-4 px-4 py-2 rounded-lg border border-gray-200 bg-white text-lg flex items-center gap-2 hover:bg-gray-100 shadow self-start cursor-pointer"
            >
              <FaArrowLeft />
              Back
            </button>
            <div className="w-full max-w-[600px] aspect-square bg-gray-100 rounded-xl mb-4 overflow-hidden relative group">
              {mainImg ? (
                <img
                  src={mainImg}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    console.warn("Main image failed:", mainImg);
                    e.currentTarget.src = "/placeholder.svg";
                    e.currentTarget.classList.remove("object-cover");
                    e.currentTarget.classList.add(
                      "object-contain",
                      "p-6",
                      "opacity-70"
                    );
                  }}
                />
              ) : (
                <img
                  src="/placeholder.svg"
                  alt="No product"
                  className="w-full h-full object-contain p-6 opacity-70"
                />
              )}
            </div>
            {/* Thumbnails aligned left under main image */}
            <div className="flex gap-4 mt-2 w-full max-w-[600px] justify-start">
              {product.images &&
                product.images.map((imgSrc, idx) => {
                  return (
                    <button
                      key={idx}
                      onClick={() => setMainImg(img)}
                      className={`border-2 rounded-lg p-1 transition ${
                        mainImg === img
                          ? "border-green-500"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Product image ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                      />
                    </button>
                  );
                })}
            </div>
          </div>

          {/* SECTION: Product Info */}
          <div className="md:w-1/2 flex flex-col justify-start mt-15">
            <div className="mb-2 text-green-700 font-semibold text-lg">
              {product.category}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {/* Average Rating */}
            <div className="mb-2">
              <StarRating rating={product.average_rating} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-600 text-base">
                by {product.seller.name}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-green-600 text-3xl font-bold">
                ${parseFloat(product.price).toFixed(2)}
              </span>
            </div>
            {/* Stock/Quantity Left */}
            <div className="mb-2">
              <span className="font-semibold text-gray-800">
                Quantity Left:{" "}
              </span>
              <span
                className={
                  product.stock > 0
                    ? "text-green-700"
                    : "text-red-600 font-bold"
                }
              >
                {product.stock > 0 ? product.stock : "Out of Stock"}
              </span>
            </div>
            <p className="text-gray-700 mb-6 text-lg">{product.description}</p>

            {/* SECTION: Product Details */}
            <div className="mb-6 space-y-3">
              {product.special_offer &&
                product.special_offer !== "No Special Offer" && (
                  <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                    <span className="font-semibold text-red-800">
                      Special Offer:
                    </span>
                    <p className="text-red-700">{product.special_offer}</p>
                  </div>
                )}

              <div>
                <span className="font-semibold text-gray-800">Added on:</span>
                <p className="text-gray-600">
                  {new Date(product.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Quantity selector removed; adjust quantity in cart */}

            {/* SECTION: Seller Information */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">Seller Information</h3>
                <FlagButton sellerId={product.seller.id} size="sm" />
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-gray-800">Business:</span>
                  <p className="text-gray-600">{product.seller.name}</p>
                </div>
                {product.seller.description && (
                  <div>
                    <span className="font-semibold text-gray-800">About:</span>
                    <p className="text-gray-600">
                      {product.seller.description}
                    </p>
                  </div>
                )}
                {product.seller.address && (
                  <div>
                    <span className="font-semibold text-gray-800">
                      Location:
                    </span>
                    <p className="text-gray-600">{product.seller.address}</p>
                  </div>
                )}
                {product.seller.contact && (
                  <div>
                    <span className="font-semibold text-gray-800">
                      Contact:
                    </span>
                    <p className="text-gray-600">{product.seller.contact}</p>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION: Action Buttons */}
            <div className="flex gap-3 mb-3">
              <button
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                aria-disabled={product.stock === 0}
                title={product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-lg font-semibold
                  bg-green-600 text-white shadow transition
                  ${
                    product.stock === 0
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : "hover:bg-green-700 cursor-pointer"
                  }`}
              >
                <FaShoppingCart />
                Add to Cart
              </button>
              <SimpleWishlistButton productId={product.id} />
            </div>
            {/* IMPORTANT: After payment in your checkout flow, call refreshProductDetails() here if user is on this page */}
            {/* IMPORTANT: After payment in your checkout flow, call refreshProductDetails() here if user is on this page */}
            {/* Only show customization button for logged-in customers */}
            {currentUser && currentUser.role === "customer" ? (
              <button
                className="w-full border border-gray-300 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 cursor-pointer"
                onClick={() => setShowCustomize(true)}
              >
                Request Customization
              </button>
            ) : (
              <button
                className="w-full border border-gray-300 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  alert("Please login as a customer to request customization.")
                }
              >
                Request Customization
              </button>
            )}
          </div>
        </div>

        {/* SECTION: Customer Reviews */}
        <div className="w-full flex justify-center mt-12">
          <div className="w-full max-w-[1500px] mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Report this product:
                </span>
                <FlagButton
                  sellerId={product.seller.id}
                  productId={product.id}
                  size="md"
                />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h3 className="text-xl font-semibold mb-2">Write a Review</h3>
              <div className="mb-2">
                <span className="font-semibold">Rating:</span>
                <span className="ml-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`inline mr-1 cursor-pointer text-2xl ${
                        reviewRating >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setReviewRating(star)}
                    />
                  ))}
                </span>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Your Review:</span>
                <textarea
                  className="w-full border border-gray-300 focus:border-gray-500 rounded p-3 mt-2 focus:outline-none"
                  rows={2}
                  placeholder="Share your experience with this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer"
                onClick={handleSubmitReview}
              >
                Submit Review
              </button>
              {reviewSuccess && (
                <div className="mt-3 text-green-600 font-semibold">
                  Review submitted!
                </div>
              )}
            </div>

            {/* SECTION: List of Reviews */}
            <div className="space-y-4">
              {reviews.length === 0 && (
                <div className="text-gray-500">No reviews yet.</div>
              )}
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl shadow p-4 flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-700">
                      {customerId && review.customer_id === customerId
                        ? "You"
                        : review.name}
                    </span>
                    <span className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={
                            star <=
                            (editingReviewId === review.id
                              ? editReviewRating
                              : review.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </span>
                    {/* Show edit/delete buttons for the logged-in user's review */}
                    {customerId && review.customer_id === customerId && (
                      <>
                        {editingReviewId === review.id ? (
                          <>
                            <button
                              className="ml-2 text-green-600 hover:underline"
                              onClick={() => handleSaveEdit(review.id)}
                            >
                              Save
                            </button>
                            <button
                              className="ml-2 text-gray-500 hover:underline"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="ml-2 text-blue-500 hover:underline"
                              onClick={() => handleEditClick(review)}
                            >
                              Edit
                            </button>
                            <button
                              className="ml-2 text-red-500 hover:underline"
                              onClick={() => handleDeleteReview(review.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  {editingReviewId === review.id ? (
                    <>
                      <div className="flex items-center gap-2 mb-2 mt-2">
                        <span className="font-semibold">Edit Rating:</span>
                        <span className="ml-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`inline mr-1 cursor-pointer text-2xl ${
                                editReviewRating >= star
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              onClick={() => setEditReviewRating(star)}
                            />
                          ))}
                        </span>
                      </div>
                      <textarea
                        className="w-full border border-gray-300 focus:border-gray-500 rounded p-3 mt-2 focus:outline-none"
                        rows={2}
                        value={editReviewText}
                        onChange={(e) => setEditReviewText(e.target.value)}
                      />
                    </>
                  ) : (
                    <div className="text-gray-700">{review.text}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Footer (full width) */}
      <Footer />

      {/* Modal is rendered here, as a sibling to all content */}
      <CustomizationModal
        open={showCustomize}
        onClose={() => setShowCustomize(false)}
      />
    </div>
  );
}

export default ProductDetails;
