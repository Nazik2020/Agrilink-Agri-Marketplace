import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart, Trash2, Star, Loader2 } from "lucide-react";
import { useWishlist } from "../../wishlist/WishlistContext";
import { useCart } from "../../cart/CartContext";
import axios from "axios";
import authService from "../../../services/AuthService";

const WishlistPage = () => {
  const { wishlist, loading, removeFromWishlist, loadWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [localLoading, setLocalLoading] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });


  useEffect(() => {
    console.log("WishlistPage: Component mounted, loading wishlist...");

    const guestWishlist = localStorage.getItem("guestWishlist");
    console.log("WishlistPage: Guest wishlist in localStorage:", guestWishlist);

   
    const currentUser = authService.getCurrentUser();
    console.log("WishlistPage: User from AuthService:", currentUser);

    if (currentUser) {
      console.log("WishlistPage: User role:", currentUser.role);
      console.log("WishlistPage: User ID:", currentUser.id);
    }

  }, []); 

  
  useEffect(() => {
    console.log("WishlistPage: Wishlist state updated:", {
      wishlist,
      loading,
      wishlistLength: wishlist.length,
    });
  }, [wishlist, loading]);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    setLocalLoading((prev) => ({ ...prev, [productId]: true }));

    try {
      const result = await removeFromWishlist(productId);
      if (result.success) {
        showToast("Item removed from wishlist", "success");
      } else {
        showToast(result.message || "Failed to remove item", "error");
      }
    } catch (error) {
      // Error removing from wishlist
      showToast("Error removing item from wishlist", "error");
    } finally {
      setLocalLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Add item to cart from wishlist
  const handleAddToCart = async (item) => {
    setLocalLoading((prev) => ({ ...prev, [item.product_id]: true }));
    try {
      const priceToUse = item.effective_price != null ? parseFloat(item.effective_price) : parseFloat(item.price);
      const productForCart = {
        id: item.product_id,
        name: item.product_name,
        seller: item.seller_name || "Unknown Seller",
        category: item.category || "Product",
        price: priceToUse,
        maxQuantity: 10,
        image: getProductImage(item.product_images),
      };

      const result = await addToCart(productForCart, { suppressPopup: true });
      if (result && result.success) {
        showToast(`${item.product_name} added to cart successfully!`, "success");
      } else {
        // Do not show success toast; optionally show error toast
        const msg = result?.message || "Failed to add item to cart";
        showToast(msg, "error");
      }
    } catch (error) {
      showToast("Error adding item to cart", "error");
    } finally {
      setLocalLoading((prev) => ({ ...prev, [item.product_id]: false }));
    }
  };

  // Calculate discount percentage
  const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Get product image
  const getProductImage = (productImages) => {
    // If already an array, use directly
    let imagesArr = [];
    if (!productImages) {
      return "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop";
    }
    if (Array.isArray(productImages)) {
      imagesArr = productImages;
    } else {
      try {
        imagesArr = JSON.parse(productImages);
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
    return "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop";
  };

  const isInStock = (item) => {
   
    return true;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
           <h1 className="text-3xl font-bold text-green-600">
              My Wishlist
            </h1>
            <p className="text-gray-600">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} in
              your wishlist
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500">
              Add products you love to keep track of them
            </p>
            <button
              onClick={() => (window.location.href = "/marketplace")}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mt-10">
            {wishlist.map((item) => {
              const isItemLoading = localLoading[item.product_id];
              const inStock = isInStock(item);
              const hasEffective = item.effective_price != null && parseFloat(item.effective_price) !== parseFloat(item.price);
              const discount = hasEffective
                ? calculateDiscount(parseFloat(item.effective_price), parseFloat(item.price))
                : 0; 

              return (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={getProductImage(item.product_images)}
                      alt={item.product_name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(item.product_id)}
                      disabled={isItemLoading}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors duration-300 disabled:opacity-50"
                    >
                      {isItemLoading ? (
                        <Loader2
                          size={16}
                          className="text-red-500 animate-spin"
                        />
                      ) : (
                        <Trash2 size={16} className="text-red-500" />
                      )}
                    </button>
                    {!inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      {item.product_name}
                    </h3>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < 4
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">(4.5)</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {item.category || "Product"}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600 mr-2">
                          ${hasEffective ? parseFloat(item.effective_price).toFixed(2) : parseFloat(item.price).toFixed(2)}
                        </span>
                        {hasEffective && (
                          <span className="text-sm text-gray-400 line-through">
                            ${parseFloat(item.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                      {discount > 0 && (
                        <span className="text-sm text-green-600 font-medium">
                          {discount}% off
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!inStock}
                      className={`w-full py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                        inStock
                          ? "bg-green-500 hover:bg-green-600 text-white hover:shadow-md transform hover:scale-105"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart size={16} />
                      {inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
