import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART_ITEMS":
      return {
        ...state,
        items: action.payload,
        loading: false,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case "TOGGLE_BUY_NOW_MODAL":
      return {
        ...state,
        showBuyNowModal: !state.showBuyNowModal,
      };

    default:
      return state;
  }
};

const initialState = {
  items: [],
  isOpen: false,
  loading: false,
  showBuyNowModal: false,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [customerId, setCustomerId] = useState(null);

  // Get customer ID from session storage on mount
  useEffect(() => {
    const userString = sessionStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        // Check both 'role' and 'user_type' for backwards compatibility
        if (user.role === "customer" || user.user_type === "customer") {
          setCustomerId(user.id);
          console.log("Customer ID set from sessionStorage:", user.id);
        }
      } catch (error) {
        console.error("Error parsing user from sessionStorage:", error);
      }
    }
  }, []);

  // Listen for user state changes (login/logout)
  useEffect(() => {
    const handleUserStateChange = (event) => {
      const { action, user } = event.detail;

      if (
        action === "login" &&
        (user.role === "customer" || user.user_type === "customer")
      ) {
        setCustomerId(user.id);
        console.log("Customer ID set from login event:", user.id);
      } else if (action === "logout") {
        setCustomerId(null);
        dispatch({ type: "SET_CART_ITEMS", payload: [] });
        console.log("Customer logged out, cart cleared");
      }
    };

    window.addEventListener("userStateChanged", handleUserStateChange);

    return () => {
      window.removeEventListener("userStateChanged", handleUserStateChange);
    };
  }, []);

  // Load cart items from database when customer ID is available
  useEffect(() => {
    if (customerId) {
      loadCartFromDatabase();
    }
  }, [customerId]);

  // Load cart items from database
  const loadCartFromDatabase = async () => {
    if (!customerId) return;

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      console.log("Loading cart for customer ID:", customerId);

      const response = await axios.post("http://localhost:8080/get_cart.php", {
        customer_id: customerId,
      });

      console.log("Cart response:", response.data);

      if (response.data.success) {
        console.log("Cart items loaded:", response.data.cart_items);
        dispatch({ type: "SET_CART_ITEMS", payload: response.data.cart_items });
      } else {
        console.error("Failed to load cart:", response.data.message);
        dispatch({ type: "SET_CART_ITEMS", payload: [] });
      }
    } catch (error) {
      console.error("Error loading cart from database:", error);
      dispatch({ type: "SET_CART_ITEMS", payload: [] });
    }
  };

  // Add item to cart
  const addToCart = async (product) => {
    if (!customerId) {
      console.error("No customer ID available");
      return;
    }

    // Determine the correct product ID
    const productId = product.id || product.product_id;

    if (!productId) {
      console.error("No product ID found in product object:", product);
      return;
    }

    console.log("Adding to cart:", {
      customerId,
      productId,
      product: product,
    });

    try {
      // Send to database first
      const response = await axios.post(
        "http://localhost:8080/add_to_cart.php",
        {
          customer_id: customerId,
          product_id: productId,
          quantity: 1,
          price: product.price,
        }
      );

      console.log("Database response:", response.data);

      if (response.data.success) {
        console.log("Successfully added to cart:", response.data);
        // Reload cart from database to get updated state
        await loadCartFromDatabase();
      } else {
        console.error(
          "Failed to add item to cart in database:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    if (!customerId) {
      console.error("No customer ID available");
      return;
    }

    try {
      console.log("Updating quantity:", { customerId, productId, quantity });

      const response = await axios.post(
        "http://localhost:8080/update_cart_item.php",
        {
          customer_id: customerId,
          product_id: productId,
          quantity: quantity,
        }
      );

      console.log("Update response:", response.data);

      if (response.data.success) {
        // Reload cart from database to get updated state
        await loadCartFromDatabase();
      } else {
        console.error(
          "Failed to update quantity in database:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    if (!customerId) {
      console.error("No customer ID available");
      return;
    }

    try {
      console.log("Removing item:", { customerId, productId });

      const response = await axios.post(
        "http://localhost:8080/remove_from_cart.php",
        {
          customer_id: customerId,
          product_id: productId,
        }
      );

      console.log("Remove response:", response.data);

      if (response.data.success) {
        // Reload cart from database to get updated state
        await loadCartFromDatabase();
      } else {
        console.error(
          "Failed to remove item from cart in database:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!customerId) {
      console.error("No customer ID available");
      return;
    }

    try {
      console.log("Clearing cart for customer:", customerId);

      // Remove all items one by one
      for (const item of state.items) {
        await axios.post("http://localhost:8080/remove_from_cart.php", {
          customer_id: customerId,
          product_id: item.product_id,
        });
      }

      // Reload cart from database to get updated state
      await loadCartFromDatabase();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });

  // Buy now functionality
  const handleBuyNow = () => {
    // Check if user is logged in as customer
    const userString = sessionStorage.getItem("user");
    if (!userString) {
      alert("Please login as a customer to proceed with checkout.");
      return;
    }

    try {
      const user = JSON.parse(userString);
      // Check both 'role' and 'user_type' for backwards compatibility
      if (user.role !== "customer" && user.user_type !== "customer") {
        alert("Please login as a customer to proceed with checkout.");
        return;
      }

      // Check if cart has items
      if (state.items.length === 0) {
        alert("Your cart is empty. Please add items before checkout.");
        return;
      }

      // Open buy now modal
      dispatch({ type: "TOGGLE_BUY_NOW_MODAL" });
    } catch (error) {
      console.error("Error checking user status:", error);
      alert("Please login as a customer to proceed with checkout.");
    }
  };

  const toggleBuyNowModal = () => dispatch({ type: "TOGGLE_BUY_NOW_MODAL" });

  // Calculate totals
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        ...state,
        updateQuantity,
        removeItem,
        clearCart,
        toggleCart,
        addToCart,
        loadCartFromDatabase,
        totalItems,
        subtotal,
        shipping,
        tax,
        total,
        customerId,
        handleBuyNow,
        toggleBuyNowModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
