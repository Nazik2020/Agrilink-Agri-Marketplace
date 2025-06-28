import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaStar, FaArrowRight } from "react-icons/fa";
import brown from "../assets/marketplace/all/brown.jpg";
import brown1 from "../assets/marketplace/all/brown1.jpg";
import cinnamon from "../assets/marketplace/fertilzers/cinnamon.jpg"; // fixed path
import plantea from "../assets/marketplace/all/plantea.jpg";
import tea from "../assets/marketplace/products/tea.jpg"; // fixed path
import yello from "../assets/marketplace/seeds/yello.jpg"; // corrected to seeds folder

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [customization, setCustomization] = useState("");
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: "John Doe",
      rating: 4,
      comment: "Great product, fast delivery!",
    },
    { id: 2, user: "Jane Smith", rating: 5, comment: "Highly recommend this!" },
  ]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const products = [
      {
        id: 1,
        name: "Organic Wheat Seeds",
        details: "High-quality organic wheat seeds for sustainable farming.",
        price: 12.99,
        category: "Seeds",
        images: [yello, brown1], // Using yello.jpg and brown1.jpg
      },
      {
        id: 2,
        name: "Premium Tomato Plant",
        details: "Robust tomato plants for year-round harvest.",
        price: 8.5,
        category: "Products",
        images: [tea, cinnamon], // Using tea.jpg and cinnamon.jpg
      },
      {
        id: 3,
        name: "Corn Seed Pack",
        details: "Non-GMO corn seeds for optimal yield.",
        price: 15.75,
        category: "Seeds",
        images: [brown1, yello], // Using brown1.jpg and yello.jpg
      },
      {
        id: 4,
        name: "Special Fertilizer Offer",
        details: "Limited-time offer on organic fertilizer blend.",
        price: 9.99,
        category: "Offers",
        images: [plantea, brown], // Using planta.jpg and brown.jpg
      },
      {
        id: 5,
        name: "Nitrogen-Rich Fertilizer",
        details: "Enhance crop growth with this premium fertilizer.",
        price: 14.5,
        category: "Fertilizer",
        images: [cinnamon, tea], // Using cinnamon.jpg and tea.jpg (from fertilzers/)
      },
    ];
    const foundProduct = products.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const handleNextImage = () => {
    if (currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReview.rating > 0 && newReview.comment.trim()) {
      setReviews([
        ...reviews,
        { id: Date.now(), user: "Current User", ...newReview },
      ]);
      setNewReview({ rating: 0, comment: "" });
    }
  };

  return (
    <div className="bg-green-50 min-h-screen py-20 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/marketplace")}
          className="mb-6 text-green-600 hover:text-green-800 font-semibold cursor-pointer"
          //style={{ background: "green" }}
        >
          ← Back to Marketplace
        </button>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 relative">
            <div className="h-96 overflow-hidden rounded-lg">
              <img
                src={product.images[currentImageIndex]}
                alt={`${product.name} Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-green-600 hover:text-green-800 rounded-full p-2"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-green-700 mb-4">
              {product.name}
            </h2>
            <p className="text-gray-600 mb-4">{product.details}</p>
            <p className="text-2xl text-green-600 font-bold mb-4">
              ${product.price.toFixed(2)}
            </p>
            <div className="flex items-center mb-4">
              <button
                onClick={() => setIsInWishlist(!isInWishlist)}
                className="flex items-center gap-2 text-green-600 hover:text-green-800"
              >
                <FaHeart className={isInWishlist ? "text-red-500" : ""} />
                {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>
            <div className="mb-4">
              <button
                onClick={() => alert(`Customizing ${product.name}...`)}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
              >
                Customize Product
              </button>
            </div>
            <div className="flex gap-4 mb-4">
              <button
                className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
                onClick={() => alert(`Added ${product.name} to cart!`)}
              >
                Add to Cart
              </button>
              <button
                className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-800 transition cursor-pointer"
                onClick={() => alert(`Buying ${product.name} now!`)}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4">
            Customer Comments
          </h3>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{review.user}</span>
                    <div className="flex">
                      {Array(5)
                        .fill()
                        .map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <h4 className="text-xl font-semibold text-green-700 mb-2">
              Add Your Review
            </h4>
            <form onSubmit={handleReviewSubmit} className="space-y-2">
              <div>
                <label className="block text-gray-700 mb-1">
                  Rating (1-5):
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      rating: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-green-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Comment:</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="w-full p-2 border border-green-300 rounded-lg"
                  rows="3"
                  placeholder="Enter your review..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default ProductDetails;
