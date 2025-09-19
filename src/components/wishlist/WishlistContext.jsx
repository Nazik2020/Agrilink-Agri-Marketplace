import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Get current user from localStorage
  const getUser = () => {
    try {
      const userString = sessionStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };

  // Get guest wishlist from localStorage
  const getGuestWishlist = () => {
    try {
      const guestWishlist = localStorage.getItem("guestWishlist");
      return guestWishlist ? JSON.parse(guestWishlist) : [];
    } catch (error) {
      console.error("Error parsing guest wishlist:", error);
      return [];
    }
  };

  // Save guest wishlist to localStorage
  const saveGuestWishlist = (productIds) => {
    try {
      localStorage.setItem("guestWishlist", JSON.stringify(productIds));
    } catch (error) {
      console.error("Error saving guest wishlist:", error);
    }
  };

  // Add to wishlist (guest or logged-in)
  const addToWishlist = async (productId) => {
    const user = getUser();

    if (user && user.role === "customer") {
      // Logged-in customer
      try {
        const response = await axios.post(
          "http://localhost/Agrilink-Agri-Marketplace/backend/add_to_wishlist.php",
          {
            productId: productId,
            customerId: user.id,
          }
        );

        if (response.data.success) {
          // Reload wishlist to get updated data
          await loadWishlist();
          return { success: true, message: "Added to wishlist" };
        } else {
          return { success: false, message: response.data.message };
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        return { success: false, message: "Error adding to wishlist" };
      }
    } else {
      // Guest user
      const guestWishlist = getGuestWishlist();
      if (!guestWishlist.includes(productId)) {
        const updatedWishlist = [...guestWishlist, productId];
        saveGuestWishlist(updatedWishlist);
        setWishlistCount(updatedWishlist.length);
        return { success: true, message: "Added to guest wishlist" };
      }
      return { success: false, message: "Already in wishlist" };
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    const user = getUser();

    if (user && user.role === "customer") {
      // Logged-in customer
      try {
        const response = await axios.post(
          "http://localhost/Agrilink-Agri-Marketplace/backend/remove_from_wishlist.php",
          {
            productId: productId,
            customerId: user.id,
          }
        );

        if (response.data.success) {
          // Reload wishlist to get updated data
          await loadWishlist();
          return { success: true, message: "Removed from wishlist" };
        } else {
          return { success: false, message: response.data.message };
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        return { success: false, message: "Error removing from wishlist" };
      }
    } else {
      // Guest user
      const guestWishlist = getGuestWishlist();
      const updatedWishlist = guestWishlist.filter((id) => id !== productId);
      saveGuestWishlist(updatedWishlist);
      setWishlistCount(updatedWishlist.length);
      return { success: true, message: "Removed from guest wishlist" };
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    const user = getUser();

    if (user && user.role === "customer") {
      return wishlist.some((item) => item.product_id == productId);
    } else {
      const guestWishlist = getGuestWishlist();
      return guestWishlist.includes(productId);
    }
  };

  // Load wishlist for logged-in customer
  const loadWishlist = useCallback(async () => {
    const user = getUser();
    console.log("WishlistContext: loadWishlist called, user:", user);

    if (user && user.role === "customer") {
      try {
        setLoading(true);
        console.log(
          "WishlistContext: Loading wishlist for customer ID:",
          user.id
        );

        // Add timeout to prevent infinite loading - REDUCED TO 5 SECONDS
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 5000)
        );

        const responsePromise = axios.post(
          "http://localhost/Agrilink-Agri-Marketplace/backend/get_wishlist.php",
          {
            customerId: user.id,
          }
        );

        const response = await Promise.race([responsePromise, timeoutPromise]);
        console.log("WishlistContext: API response:", response.data);

        if (response.data.success) {
          setWishlist(response.data.wishlist);
          setWishlistCount(response.data.count);
          console.log(
            "WishlistContext: Wishlist loaded successfully:",
            response.data.wishlist
          );
        } else {
          console.error(
            "WishlistContext: API returned error:",
            response.data.message
          );
          setWishlist([]);
          setWishlistCount(0);
        }
      } catch (error) {
        console.error("WishlistContext: Error loading wishlist:", error);
        console.error(
          "WishlistContext: Error details:",
          error.response?.data || error.message
        );
        setWishlist([]);
        setWishlistCount(0);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user
      const guestWishlist = getGuestWishlist();
      setWishlistCount(guestWishlist.length);
      console.log(
        "WishlistContext: Guest user, wishlist count:",
        guestWishlist.length
      );
      setLoading(false);
    }
  }, []);

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

    // Reload wishlist when user changes (storage or login)
    useEffect(() => {
      const handleStorageChange = () => {
        loadWishlist();
      };
      const handleUserStateChanged = () => {
        loadWishlist();
      };

      window.addEventListener("storage", handleStorageChange);
      window.addEventListener("userStateChanged", handleUserStateChanged);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("userStateChanged", handleUserStateChanged);
      };
    }, [loadWishlist]);

  const value = {
    wishlist,
    wishlistCount,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loadWishlist,
    getGuestWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
