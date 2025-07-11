import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaStar, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import Footer from "../components/common/Footer";
import CustomizationModal from "../components/marketplace/CustomizationModal";
// Placeholder images (replace with dynamic data later)
import brown from "../assets/marketplace/all/brown.jpg";
import brown1 from "../assets/marketplace/all/brown1.jpg";

// Placeholder for fetching product details (simulate API call)
const fetchProductDetails = async (productId) => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: productId,
        name: "Organic Tomatoes",
        category: "Products",
        price: 4.99,
        oldPrice: 5.99,
        discount: 20,
        description:
          "Fresh, juicy organic tomatoes grown without pesticides. Perfect for salads and cooking. These premium tomatoes are harvested at peak ripeness to ensure maximum flavor and nutritional value.",
        images: [
          { src: brown, alt: "Birthday Cake" },
          { src: brown1, alt: "Tomatoes" },
        ],
        rating: 4.8,
        reviews: [
          {
            name: "John Doe",
            rating: 5,
            text: "Excellent quality tomatoes, very fresh!",
          },
          {
            name: "Sarah Smith",
            rating: 4,
            text: "Good product, fast delivery.",
          },
        ],
      });
    }, 500);
  });
};

function ProductDetails() {
  const navigate = useNavigate();
  // SECTION: State Management
  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showCustomize, setShowCustomize] = useState(false);
  const [customText, setCustomText] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // SECTION: Data Fetching
  useEffect(() => {
    // Replace '1' with dynamic product ID from route params later
    fetchProductDetails(1).then((data) => {
      setProduct(data);
      setMainImg(data.images[0].src);
      setReviews(data.reviews);
    });
  }, []);

  // SECTION: Action Handlers
  const handleAddToCart = () => {
    // TODO: Connect to backend
    alert("Added to cart! (Connect to backend later)");
  };

  const handleBuyNow = () => {
    // TODO: Connect to backend
    alert("Proceed to buy now! (Connect to backend later)");
  };

  const handleWishlist = () => {
    // Toggle wishlist state
    setIsWishlisted((prev) => !prev);
    // TODO: Connect to backend
    // alert("Added to wishlist! (Connect to backend later)");
  };

  const handleSubmitReview = () => {
    if (reviewText.trim()) {
      // TODO: Send review to backend
      setReviews([
        ...reviews,
        { name: "You", rating: reviewRating, text: reviewText },
      ]);
      setReviewText("");
      setReviewRating(5);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-lg text-gray-500">
          Loading product details...
        </span>
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
              <FaArrowLeft /> Back
            </button>
            <div className="w-full max-w-[600px] aspect-square bg-gray-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
              <img
                src={mainImg}
                alt="Product"
                className="object-cover w-full h-full rounded-xl"
              />
            </div>
            {/* Thumbnails aligned left under main image */}
            <div className="flex gap-4 mt-2 w-full max-w-[600px] justify-start">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImg(img.src)}
                  className={`border-2 rounded-lg p-1 transition ${
                    mainImg === img.src
                      ? "border-green-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-16 h-16 object-cover rounded"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* SECTION: Product Info */}
          <div className="md:w-1/2 flex flex-col justify-start mt-15">
            <div className="mb-2 text-green-700 font-semibold text-lg">
              {product.category}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={
                      star <= Math.round(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </span>
              <span className="text-gray-600 text-base ml-2">
                ({product.rating}) • 3 reviews
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-green-600 text-3xl font-bold">
                ${product.price}
              </span>
              <span className="line-through text-gray-400 text-xl">
                ${product.oldPrice}
              </span>
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-base font-semibold">
                -{product.discount}%
              </span>
            </div>
            <p className="text-gray-700 mb-6 text-lg">{product.description}</p>

            {/* SECTION: Quantity Selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-semibold text-lg">Quantity:</span>
              <button
                className="border px-3 py-1 rounded text-xl cursor-pointer"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                className="border px-3 py-1 rounded text-xl cursor-pointer"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>

            {/* SECTION: Action Buttons */}
            <div className="flex gap-3 mb-3">
              <button
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-lg flex items-center justify-center gap-2 cursor-pointer"
                onClick={handleAddToCart}
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                title="Add to Wishlist"
                className={`w-12 h-12 flex items-center justify-center rounded-lg border-1 border-green-500 transition-colors duration-200 bg-gray-100 cursor-pointer`}
                style={{ lineHeight: 0 }}
              >
                <FaHeart
                  size={24}
                  style={{
                    fill: isWishlisted ? "#ec4899" : "#fff", // pink-500 or white (so inside is white)
                    stroke: isWishlisted ? "#ec4899" : "#22c55e", // pink-500 or green-500
                    strokeWidth: 10,
                  }}
                />
              </button>
            </div>
            <button
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg text-lg font-semibold mb-3 cursor-pointer"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
            <button
              className="w-full border border-gray-300 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 cursor-pointer"
              onClick={() => setShowCustomize(true)}
            >
              Request Customization
            </button>
          </div>
        </div>

        {/* SECTION: Customer Reviews */}
        <div className="w-full flex justify-center mt-12">
          <div className="w-full max-w-[1500px] mx-auto">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
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
            </div>

            {/* SECTION: List of Reviews */}
            <div className="space-y-4">
              {reviews.length === 0 && (
                <div className="text-gray-500">No reviews yet.</div>
              )}
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow p-4 flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-700">
                      {review.name}
                    </span>
                    <span className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </span>
                  </div>
                  <div className="text-gray-700">{review.text}</div>
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
