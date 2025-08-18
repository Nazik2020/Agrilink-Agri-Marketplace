import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  CreditCard,
  Lock,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  Globe,
  X,
  User,
} from "lucide-react";
import axios from "axios";
import { useCart } from "../cart/CartContext";

const BuyNowModal = ({
  isOpen,
  onClose,
  product,
  quantity = 1,
  isCartCheckout = false,
}) => {
  const {
    items: cartItems,
    total: cartTotal,
    subtotal: cartSubtotal,
    shipping: cartShipping,
    tax: cartTax,
    clearCart,
    customerId,
  } = useCart();

  // State management - ALL HOOKS MUST BE AT THE TOP
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stripeKey, setStripeKey] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [customerDataLoading, setCustomerDataLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Billing Information
    billing_name: "",
    billing_email: "",
    billing_address: "",
    billing_postal_code: "",
    billing_country: "United States",

    // Card Information
    card_number: "",
    card_expiry: "",
    card_cvc: "",
    card_name: "",

    // Order details
    quantity: quantity,
    customer_id: customerId || 1,
  });

  // Order summary - handle both single product and cart checkout
  const unitPrice = parseFloat(product?.price || 0);
  const singleProductTotal = unitPrice * formData.quantity;

  // Use cart totals if this is a cart checkout, otherwise use single product totals
  const subtotal = isCartCheckout ? cartSubtotal : singleProductTotal;
  const shipping = isCartCheckout ? cartShipping : 0;
  const tax = isCartCheckout ? cartTax : 0;
  const totalAmount = subtotal + shipping + tax;

  const allowedCards = {
    "4242424242424242": "success",
    "4000000000000002": "Your card was declined.",
    "4000000000009995": "Insufficient funds.",
    "4000000000009987": "Card expired.",
  };

  // Load customer data when modal opens
  useEffect(() => {
    if (isOpen && customerId) {
      loadCustomerData();
    }
  }, [isOpen, customerId]);

  // Load customer data from database
  useEffect(() => {
    if (isOpen) {
      loadStripeConfig();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Early returns AFTER all hooks are defined
  if (!isOpen) return null;

  // Add safety checks for props
  if (!onClose || typeof onClose !== "function") {
    console.error(
      "BuyNowModal: onClose prop is required and must be a function"
    );
    return null;
  }

  // Load customer data from database - GET REAL SIGNUP DATA
  const loadCustomerData = async () => {
    if (!customerId) {
      console.log("No customer ID available");
      return;
    }

    console.log("Loading REAL customer signup data for ID:", customerId);
    setCustomerDataLoading(true);

    try {
      // Call backend API to get REAL customer signup data
      // Get customer email from session storage for fallback
      const userString = sessionStorage.getItem("user");
      let customerEmail = null;
      if (userString) {
        try {
          const user = JSON.parse(userString);
          customerEmail = user.email;
        } catch (e) {
          console.error("Error parsing user from session:", e);
        }
      }

      const response = await axios.post(
        "http://localhost:8080/get_customer_billing_data.php",
        {
          customer_id: customerId,
          customer_email: customerEmail,
        }
      );

      console.log("Backend response:", response.data);

      console.log("Backend response:", response.data);

      if (
        response.data &&
        response.data.success &&
        response.data.customerInfo
      ) {
        // Use REAL customer data from their signup/profile
        const customerInfo = response.data.customerInfo;
        setCustomerData(customerInfo);

        // Auto-populate form with REAL signup data
        setFormData((prev) => ({
          ...prev,
          billing_name: customerInfo.name || customerInfo.full_name || "",
          billing_email: customerInfo.email || "",
          billing_address: customerInfo.address || "",
          billing_postal_code: customerInfo.postal_code || "",
          billing_country: customerInfo.country || "Sri Lanka",
          customer_id: customerId,
        }));

        setError("");
        console.log("✅ Successfully loaded real customer data:", customerInfo);
      } else {
        // Backend returned success:false - show error and block checkout
        setError(
          "Unable to load your profile information. Please complete your profile before checkout."
        );
        setCustomerData(null);
      }
    } catch (error) {
      console.error("❌ Error loading customer data:", error);

      // Show error and prevent checkout if no profile found
      setError(
        "Unable to load your profile information. Please complete your profile before checkout."
      );
      setCustomerData(null);
    } finally {
      setCustomerDataLoading(false);
    }
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const loadStripeConfig = async () => {
    // Skip backend call - use mock key directly
    setStripeKey("pk_test_mock_key_for_development");
    console.log("Using mock Stripe key - payment will work");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format card number input
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;

    setFormData((prev) => ({
      ...prev,
      card_number: formattedValue,
    }));
  };

  // Format expiry date input
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }

    setFormData((prev) => ({
      ...prev,
      card_expiry: value,
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = [];

    // Billing validation - check required fields
    if (!formData.billing_name.trim()) {
      errors.push("Billing name is required");
    }
    if (!formData.billing_email.trim()) {
      errors.push("Billing email is required");
    }
    if (!formData.billing_address.trim()) {
      errors.push("Billing address is required");
    }
    if (!formData.billing_postal_code.trim()) {
      errors.push("Postal code is required");
    }

    // Card validation (basic)
    if (!formData.card_number.replace(/\s/g, ""))
      errors.push("Card number is required");
    if (!formData.card_expiry) errors.push("Expiry date is required");
    if (!formData.card_cvc) errors.push("CVC is required");
    if (!formData.card_name.trim()) errors.push("Cardholder name is required");

    return errors;
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const cardNumber = (formData.card_number || "").replace(/\s+/g, "");
      if (!cardNumber) {
        setError("Please enter a card number.");
        setLoading(false);
        return;
      }

      // Check if card number is in allowed list
      if (!allowedCards.hasOwnProperty(cardNumber)) {
        setError(
          "Invalid card number. Please enter a valid Stripe test card number."
        );
        setLoading(false);
        return;
      }

      // Simulate processing time (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check card result
      if (allowedCards[cardNumber] === "success") {
        // SUCCESS - Payment approved
        console.log("Payment successful!");

        // Build order payload with full product/order details
        let orderPayload = {
          customer_id: formData.customer_id,
          card_number: cardNumber,
          order_total: totalAmount,
          billing_name: formData.billing_name,
          billing_email: formData.billing_email,
          billing_address: formData.billing_address,
          billing_postal_code: formData.billing_postal_code,
          billing_country: formData.billing_country,
        };

        let purchasedProducts = [];

        if (isCartCheckout) {
          // Cart checkout: send all cart items
          orderPayload.cart_items = cartItems.map((item) => ({
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
            product_images: item.product_images,
            seller_id: item.seller_id || item.sellerId || null,
          }));
          orderPayload.subtotal = cartSubtotal;
          orderPayload.shipping = cartShipping;
          orderPayload.tax = cartTax;
          purchasedProducts = cartItems.map((item) => ({
            productId: item.product_id,
            quantity: item.quantity,
          }));
        } else {
          // Single product checkout
          orderPayload.product_id = product?.id || product?.product_id;
          orderPayload.product_name = product?.name;
          orderPayload.quantity = formData.quantity;
          orderPayload.price = product?.price;
          orderPayload.product_images = product?.images?.[0] || "";
          orderPayload.seller_id =
            product?.seller_id || product?.sellerId || null;
          if (product?.id || product?.product_id) {
            purchasedProducts = [
              {
                productId: product.id || product.product_id,
                quantity: formData.quantity || 1,
              },
            ];
          }
        }

        // Send order to backend to record all details
        try {
          console.log("Order payload sent to backend:", orderPayload);

          // Real POST request to backend
          const response = await axios.post(
            "http://localhost/Agrilink-Agri-Marketplace/backend/add_order_simple.php",
            orderPayload
          );

          console.log("Backend response:", response.data);

          if (!response.data.success) {
            setError(
              "Order failed: " + (response.data.message || "Unknown error")
            );
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Error sending order to backend:", err);
          setError("Error sending order to backend: " + err.message);
          setLoading(false);
          return;
        }

        // Dispatch custom event for each purchased product to update listings instantly
        if (purchasedProducts.length > 0) {
          purchasedProducts.forEach(({ productId, quantity }) => {
            window.dispatchEvent(
              new CustomEvent("orderPaid", { detail: { productId, quantity } })
            );
          });
        }

        if (isCartCheckout) {
          clearCart(); // Clear cart on successful payment
        }

        setStep(3); // Go to success page
        setLoading(false);
      } else {
        // DECLINED - Show specific error message
        setError(allowedCards[cardNumber]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("Payment processing failed. Please try again.");
      setLoading(false);
    }
  };

  // Reset modal when closed
  const handleClose = () => {
    setStep(1);
    setError("");
    setLoading(false);
    setCustomerData(null);
    setCustomerDataLoading(false);
    setFormData({
      billing_name: "",
      billing_email: "",
      billing_address: "",
      billing_postal_code: "",
      billing_country: "United States",
      card_number: "",
      card_expiry: "",
      card_cvc: "",
      card_name: "",
      quantity: quantity,
      customer_id: customerId || 1,
    });

    // Clear cart if this was a cart checkout and payment was successful
    if (isCartCheckout && step === 3) {
      clearCart();
    }

    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 10000 }}
      >
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <CreditCard className="text-white" size={18} />
              </div>
              <h2 className="text-xl font-bold">
                {step === 1
                  ? "Order Details"
                  : step === 2
                  ? "Payment Information"
                  : "Order Confirmed"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-2 transition-all duration-300 ${
                step >= 1 ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= 1
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-gray-200"
                }`}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <span className="font-semibold text-sm">Details</span>
            </div>
            <div
              className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${
                step >= 2 ? "bg-green-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center space-x-2 transition-all duration-300 ${
                step >= 2 ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= 2
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-gray-200"
                }`}
              >
                {step > 2 ? "✓" : "2"}
              </div>
              <span className="font-semibold text-sm">Payment</span>
            </div>
            <div
              className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${
                step >= 3 ? "bg-green-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center space-x-2 transition-all duration-300 ${
                step >= 3 ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= 3
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-gray-200"
                }`}
              >
                {step >= 3 ? "✓" : "3"}
              </div>
              <span className="font-semibold text-sm">Success</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {step === 1 && (
            <div className="space-y-4">
              {/* Order Summary */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-bold text-lg mb-3 text-gray-800">
                  Order Summary
                </h3>

                {isCartCheckout ? (
                  // Cart checkout - show all cart items
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.product_id}
                        className="flex items-center space-x-4"
                      >
                        <img
                          src={(function () {
                            let imagesArr = [];
                            if (!item.product_images) {
                              return "/placeholder.svg";
                            }
                            if (Array.isArray(item.product_images)) {
                              imagesArr = item.product_images;
                            } else {
                              try {
                                imagesArr = JSON.parse(item.product_images);
                              } catch (error) {
                                imagesArr = [];
                              }
                            }
                            if (imagesArr.length > 0) {
                              const img = imagesArr[0];
                              if (
                                typeof img === "string" &&
                                img.startsWith("http")
                              ) {
                                return img;
                              } else if (typeof img === "string") {
                                return `http://localhost/Agrilink-Agri-Marketplace/backend/${img}`;
                              }
                            }
                            return "/placeholder.svg";
                          })()}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg border border-green-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {item.product_name}
                          </h4>
                          <p className="text-gray-600">
                            ${parseFloat(item.price).toFixed(2)} each
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </span>
                          <div className="font-semibold text-gray-800">
                            $
                            {(parseFloat(item.price) * item.quantity).toFixed(
                              2
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Cart totals */}
                    <div className="border-t border-green-200 mt-4 pt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold">
                          ${totalAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-gray-800">Total:</span>
                        <span className="font-bold text-xl text-green-600">
                          ${(totalAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Single product checkout
                  <div className="flex items-center space-x-4">
                    <img
                      src={(function () {
                        let imagesArr = [];
                        if (!product?.images) {
                          return "/placeholder.svg";
                        }
                        if (Array.isArray(product.images)) {
                          imagesArr = product.images;
                        } else {
                          try {
                            imagesArr = JSON.parse(product.images);
                          } catch (error) {
                            imagesArr = [];
                          }
                        }
                        if (imagesArr.length > 0) {
                          const img = imagesArr[0];
                          if (
                            typeof img === "string" &&
                            img.startsWith("http")
                          ) {
                            return img;
                          } else if (typeof img === "string") {
                            return `http://localhost/Agrilink-Agri-Marketplace/backend/${img}`;
                          }
                        }
                        return "/placeholder.svg";
                      })()}
                      alt={product?.name}
                      className="w-16 h-16 object-cover rounded-lg border border-green-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {product?.name}
                      </h4>
                      <p className="text-gray-600">
                        ${unitPrice.toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            quantity: parseInt(e.target.value) || 1,
                          }))
                        }
                        className="w-16 p-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-green-500 focus:border-green-600"
                      />
                    </div>
                  </div>
                )}

                {!isCartCheckout && (
                  <div className="border-t border-green-200 mt-4 pt-4 flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-800">
                      Total:
                    </span>
                    <span className="font-bold text-xl text-green-600">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Billing Information */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600 text-sm">📍</span>
                  </div>
                  Billing Information
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                    Auto-filled from Profile
                  </span>
                </h3>

                {customerDataLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      Loading your billing information...
                    </p>
                  </div>
                ) : customerData ? (
                  <div className="space-y-4">
                    {/* Customer Information Display */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={formData.billing_name}
                            readOnly
                            disabled
                            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={formData.billing_email}
                            readOnly
                            disabled
                            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address
                          </label>
                          <input
                            type="text"
                            value={formData.billing_address}
                            readOnly
                            disabled
                            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              value={formData.billing_postal_code}
                              readOnly
                              disabled
                              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-blue-600" />
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Country
                            </label>
                            <input
                              type="text"
                              value={formData.billing_country}
                              readOnly
                              disabled
                              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Information Message */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Billing information is automatically filled from your
                        profile and cannot be changed here. To update your
                        information, please visit your profile page.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">
                      Unable to load your billing information. Please ensure
                      your profile is complete.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Continue to Payment</span>
                <span>→</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Lock className="text-green-600" size={16} />
                </div>
                <div>
                  <p className="font-bold text-green-800">🔒 Secure Payment</p>
                  <p className="text-green-600 text-sm">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>

              {/* Payment Form */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600 text-sm">💳</span>
                  </div>
                  Payment Information
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="card_name"
                    placeholder="Cardholder Name"
                    value={formData.card_name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={formData.card_number}
                    onChange={handleCardNumberChange}
                    maxLength="19"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all duration-200"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={formData.card_expiry}
                      onChange={handleExpiryChange}
                      maxLength="5"
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all duration-200"
                    />
                    <input
                      type="text"
                      name="card_cvc"
                      placeholder="CVC"
                      value={formData.card_cvc}
                      onChange={handleInputChange}
                      maxLength="4"
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary (compact) */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                {isCartCheckout ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">
                        {cartItems.length} items
                      </span>
                      <span className="font-bold text-xl text-green-600">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {cartItems.map((item) => (
                        <div
                          key={item.product_id}
                          className="flex justify-between"
                        >
                          <span>
                            {item.product_name} × {item.quantity}
                          </span>
                          <span>
                            $
                            {(parseFloat(item.price) * item.quantity).toFixed(
                              2
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                      {product?.name} × {formData.quantity}
                    </span>
                    <span className="font-bold text-xl text-green-600">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 border border-gray-300 hover:border-gray-400"
                >
                  ← Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `💳 Pay $${totalAmount.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="text-green-600" size={48} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600">
                  Your order has been confirmed and will be processed soon.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="font-semibold text-gray-800 mb-2">
                  Order Details:
                </p>
                {isCartCheckout ? (
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <p key={item.product_id} className="text-gray-700">
                        {item.product_name} × {item.quantity}
                      </p>
                    ))}
                    {/* Force display of actual cart total */}
                    <p className="font-bold text-xl text-green-600">
                      Total: ${Number(cartTotal || totalAmount).toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 mb-1">
                      {product?.name} × {formData.quantity}
                    </p>
                    {/* Ensure product price is correctly displayed */}
                    <p className="font-bold text-xl text-green-600">
                      Total: $
                      {(Number(product?.price) * formData.quantity).toFixed(2)}
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the modal at the root level
  try {
    return createPortal(modalContent, document.body);
  } catch (error) {
    console.error("BuyNowModal render error:", error);
    return null;
  }
};

export default BuyNowModal;
