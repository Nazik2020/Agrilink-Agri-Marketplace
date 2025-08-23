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
  const totalAmount = isCartCheckout ? cartTotal || 0 : singleProductTotal;
  const shipping = isCartCheckout ? cartShipping || 0 : 0;
  const tax = isCartCheckout ? cartTax || 0 : 0;
  const subtotalValue = isCartCheckout ? cartSubtotal || 0 : singleProductTotal;

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
        "http://localhost/Agrilink-Agri-Marketplace/backend/get_customer_billing_data.php",
        {
          customer_id: customerId,
          customer_email: customerEmail,
        }
      );

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

  // Handle payment processing - ONLY SPECIFIC CARDS ALLOWED
  const handlePayment = async () => {
    setError("");
    setLoading(true);

    try {
      // Validate form first
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setError(validationErrors.join(", "));
        setLoading(false);
        return;
      }

      // Get card number without spaces
      const cardNumber = formData.card_number.replace(/\s/g, "");

      // ONLY THESE CARDS ARE ALLOWED - NO RANDOM NUMBERS
      const allowedCards = {
        4242424242424242: "success", // ✅ Visa
        5555555555554444: "success", // ✅ Mastercard
        378282246310005: "success", // ✅ American Express
        4000000000000002: "Your card was declined.", // ❌ Generic decline
        4000000000009995: "Your card has insufficient funds.", // ❌ Insufficient funds
        4000000000009987: "Your card was reported lost or stolen.", // ❌ Lost card
      };

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

        if (isCartCheckout) {
          // Cart checkout: send all cart items
          orderPayload.cart_items = cartItems.map((item) => ({
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
            product_images: item.product_images,
          }));
          orderPayload.subtotal = cartSubtotal;
          orderPayload.shipping = cartShipping;
          orderPayload.tax = cartTax;
        } else {
          // Single product checkout
          orderPayload.product_id = product?.id || product?.product_id;
          orderPayload.product_name = product?.name;
          orderPayload.quantity = formData.quantity;
          orderPayload.price = product?.price;
          orderPayload.product_images = product?.images?.[0] || "";
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
                          src={
                            item.product_images
                              ? `http://localhost/Agrilink-Agri-Marketplace/backend/${
                                  item.product_images.split(",")[0]
                                }`
                              : "/placeholder.svg"
                          }
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
                          <br />
                          <span className="font-semibold text-green-700">
                            ${parseFloat(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single product checkout
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        product?.images?.[0]
                          ? `http://localhost/Agrilink-Agri-Marketplace/backend/${product.images[0]}`
                          : "/placeholder.svg"
                      }
                      alt={product?.name}
                      className="w-24 h-24 object-cover rounded-lg border border-green-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {product?.name}
                      </h4>
                      <p className="text-gray-600">${unitPrice.toFixed(2)} each</p>
                      <label className="block mt-2">
                        Quantity:
                        <input
                          type="number"
                          name="quantity"
                          min="1"
                          max={product?.stock || 100}
                          value={formData.quantity}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              quantity: Math.max(1, Number(e.target.value)),
                            }))
                          }
                          className="w-20 ml-2 border border-gray-300 rounded px-2 py-1"
                        />
                      </label>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-green-700">
                        ${singleProductTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Summary totals */}
                <div className="mt-4 border-t border-green-200 pt-3 text-right space-y-1">
                  <div>
                    <span className="font-semibold">Subtotal:</span>{" "}
                    ${subtotalValue.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-semibold">Shipping:</span> $
                    {shipping.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-semibold">Tax:</span> ${tax.toFixed(2)}
                  </div>
                  <div className="font-bold text-lg">
                    Total: ${totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Billing Information Form */}
              <div className="mt-6">
                <h3 className="font-bold text-lg mb-3 text-gray-800">
                  Billing Information
                </h3>
                {error && (
                  <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                    {error}
                  </div>
                )}
                {customerDataLoading ? (
                  <p>Loading your profile information...</p>
                ) : (
                  <form className="space-y-4">
                    <div>
                      <label className="block font-semibold text-gray-700">
                        Name
                        <User className="inline-block ml-2 text-green-600" size={16} />
                      </label>
                      <input
                        type="text"
                        name="billing_name"
                        value={formData.billing_name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="John Doe"
                        disabled={!!customerData}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700">
                        Email
                        <Mail className="inline-block ml-2 text-green-600" size={16} />
                      </label>
                      <input
                        type="email"
                        name="billing_email"
                        value={formData.billing_email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="john@example.com"
                        disabled={!!customerData}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700">
                        Address
                        <MapPin className="inline-block ml-2 text-green-600" size={16} />
                      </label>
                      <input
                        type="text"
                        name="billing_address"
                        value={formData.billing_address}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="123 Main St"
                        disabled={!!customerData}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block font-semibold text-gray-700">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="billing_postal_code"
                          value={formData.billing_postal_code}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="12345"
                          disabled={!!customerData}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block font-semibold text-gray-700">
                          Country
                        </label>
                        <input
                          type="text"
                          name="billing_country"
                          value={formData.billing_country}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="United States"
                          disabled={!!customerData}
                        />
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  disabled={loading || !!error || customerDataLoading}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Payment Information
              </h3>
              {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                  {error}
                </div>
              )}

              <form className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="card_number"
                    value={formData.card_number}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    placeholder="4242 4242 4242 4242"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block font-semibold text-gray-700">
                      Expiry Date (MM/YY)
                    </label>
                    <input
                      type="text"
                      name="card_expiry"
                      value={formData.card_expiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      placeholder="12/34"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-semibold text-gray-700">
                      CVC
                    </label>
                    <input
                      type="text"
                      name="card_cvc"
                      value={formData.card_cvc}
                      onChange={handleInputChange}
                      maxLength={4}
                      placeholder="123"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    name="card_name"
                    value={formData.card_name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </form>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center p-6 space-y-4">
              <CheckCircle
                size={48}
                className="mx-auto text-green-600 animate-bounce"
              />
              <h3 className="text-2xl font-bold text-green-700">
                Payment Successful!
              </h3>
              <p className="text-gray-700">
                Thank you for your order. You will receive a confirmation email
                shortly.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default BuyNowModal;
