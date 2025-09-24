import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";

// PopupMessage component for cart alerts
const PopupMessage = ({ message, type, onClose }) => {
  if (!message) return null;
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-green-50/50 z-50">
      <div className={`${bgColor} ${borderColor} border rounded-xl p-6 max-w-md w-full mx-4 shadow-lg`}>
        <div className="flex items-start space-x-3">
          <div className={`${iconColor} flex-shrink-0 mt-0.5`}>
            {isSuccess ? (
              <span>✔️</span>
            ) : (
              <span>❌</span>
            )}
          </div>
          <div className="flex-1">
            <p className={`${textColor} text-sm font-medium leading-relaxed`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
          >
            ✖️
          </button>
        </div>
      </div>
    </div>
  );
};
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
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState('success');
  const showPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
  };
  const closePopup = () => {
    setPopupMessage(null);
    setPopupType('success');
  };

  // Get customer ID from session storage on mount
  useEffect(() => {
    const userString = sessionStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user.role === "customer" || user.user_type === "customer") {
          setCustomerId(user.id);
          console.log("Customer ID set from sessionStorage:", user.id);
        }
      } catch (error) {
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

      const response = await axios.post(
        "http://localhost/Agrilink-Agri-Marketplace/backend/get_cart.php",
        {
          customer_id: customerId,
        }
      );

      console.log("Cart response:", response.data);

      if (response.data.success) {
        console.log("Cart items loaded:", response.data.cart_items);
        dispatch({ type: "SET_CART_ITEMS", payload: response.data.cart_items });
      } else {
        dispatch({ type: "SET_CART_ITEMS", payload: [] });
      }
    } catch (error) {
      dispatch({ type: "SET_CART_ITEMS", payload: [] });
    }
  };

  // Add item to cart
  const addToCart = async (product, options = {}) => {
    const suppressPopup = options && options.suppressPopup === true;
    if (!customerId) {
      if (!suppressPopup) {
        showPopup("Please login as a customer to add items to cart.", "error");
      }
      return { success: false, message: "Not logged in as customer" };
    }

    // Determine the correct product ID
    const productId = product.id || product.product_id;

    if (!productId) {
      if (!suppressPopup) {
        showPopup("Invalid product", "error");
      }
      return { success: false, message: "Invalid product" };
    }

    console.log("Adding to cart:", {
      customerId,
      productId,
      product: product,
    });

    try {
      // Send to database first
      const response = await axios.post(
        "http://localhost/Agrilink-Agri-Marketplace/backend/add_to_cart.php",
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
        if (!suppressPopup) {
          showPopup("Item added to cart", "success");
        }
        return { success: true, message: response.data.message, data: response.data };
      } else {
        const msg = response?.data?.message || "Failed to add item to cart";
        if (!suppressPopup) {
          showPopup(msg, "error");
        }
        return { success: false, message: msg, data: response?.data };
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Failed to add item to cart";
      if (!suppressPopup) {
        showPopup(msg, "error");
      }
      return { success: false, message: msg };
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    if (!customerId) {
        // No customer ID available
      return;
    }

    try {
      console.log("Updating quantity:", { customerId, productId, quantity });

      const response = await axios.post(
        "http://localhost/Agrilink-Agri-Marketplace/backend/update_cart_item.php",
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
      }
    } catch (error) {
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    if (!customerId) {
        // No customer ID available
      return;
    }

    try {
      console.log("Removing item:", { customerId, productId });

      const response = await axios.post(
        "http://localhost/Agrilink-Agri-Marketplace/backend/remove_from_cart.php",
        {
          customer_id: customerId,
          product_id: productId,
        }
      );

      console.log("Remove response:", response.data);

      if (response.data.success) {
        await loadCartFromDatabase();
      } else {
      }
    } catch (error) {
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!customerId) {
      return;
    }

    try {
      console.log("Clearing cart for customer:", customerId);

      // Remove all items one by one
      for (const item of state.items) {
        await axios.post("http://localhost/Agrilink-Agri-Marketplace/backend/remove_from_cart.php", {
          customer_id: customerId,
          product_id: item.product_id,
        });
      }

      // Reload cart from database to get updated state
      await loadCartFromDatabase();
    } catch (error) {
    }
  };

  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });

  // Buy now functionality
  const handleBuyNow = () => {
    const userString = sessionStorage.getItem("user");
    if (!userString) {
      showPopup("Please login as a customer to proceed with checkout.", "error");
      return;
    }

    try {
      const user = JSON.parse(userString);
      if (user.role !== "customer" && user.user_type !== "customer") {
        showPopup("Please login as a customer to proceed with checkout.", "error");
        return;
      }

      // Check if cart has items
      if (state.items.length === 0) {
        showPopup("Your cart is empty. Please add items before checkout.", "error");
        return;
      }

      // Open buy now modal
      dispatch({ type: "TOGGLE_BUY_NOW_MODAL" });
    } catch (error) {
      console.error("Error checking user status:", error);
      showPopup("Please login as a customer to proceed with checkout.", "error");
    }
  };

  const toggleBuyNowModal = () => dispatch({ type: "TOGGLE_BUY_NOW_MODAL" });

  // Calculate totals
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, item) => {
      // Use backend line_total when available (includes offer pricing), otherwise calculate manually
      return sum + (item.line_total ? parseFloat(item.line_total) : parseFloat(item.price) * item.quantity);
    },
    0
  );
  const shipping = 0;
  const tax = 0;
  const total = subtotal;

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
      <PopupMessage
        message={popupMessage}
        type={popupType}
        onClose={closePopup}
      />
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
