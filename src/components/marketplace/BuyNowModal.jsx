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
import {
  validateCardAll,
  detectCardBrand,
  CARD_BRANDS,
} from "../../utils/cardValidation";

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
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stripeKey, setStripeKey] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [customerDataLoading, setCustomerDataLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [cardBrand, setCardBrand] = React.useState(CARD_BRANDS.unknown);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    // Billing Information
    billing_name: "",
    billing_email: "",
    billing_address: "",
    billing_postal_code: "",
    billing_country: "",

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
  // Shipping/tax are not charged in this project. Keep numeric values at 0 for payloads,
  // but don't add them to the UI total. Show a shipping note to the user instead.
  const shipping = 0;
  const tax = 0;
  const totalAmount = subtotal;

  const allowedCards = {
    // Visa
    4242424242424242: "success",
    4000000000000002: "Your card was declined.",
    4000000000009995: "Insufficient funds.",
    4000000000009987: "Card expired.",
    // Mastercard
    5555555555554444: "success",
    5105105105105100: "success",
    // American Express (15-digit). We compare against digits only later, so ok
    378282246310005: "success",
    371449635398431: "success",
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

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Early returns AFTER all hooks are defined
  if (!isOpen) return null;

  // Add safety checks for props
  if (!onClose || typeof onClose !== "function") {
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
      const userString = sessionStorage.getItem("user");
      let customerEmail = null;
      if (userString) {
        try {
          const user = JSON.parse(userString);
          customerEmail = user.email;
        } catch (e) {}
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

        setFormData((prev) => ({
          ...prev,
          billing_name: customerInfo.name || customerInfo.full_name || "",
          billing_email: customerInfo.email || "",
          billing_address: customerInfo.address || "",
          billing_postal_code: customerInfo.postal_code || "",
          billing_country: customerInfo.country || "",
          customer_id: customerId,
        }));

        setError("");
        console.log("✅ Successfully loaded real customer data:", customerInfo);
      } else {
        setError(
          "Unable to load your profile information. Please complete your profile before checkout."
        );
        setCustomerData(null);
      }
    } catch (error) {
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

  // Format card number input respecting brand-specific lengths
  const formatCardNumber = (value, brandHint) => {
    const raw = (value || "").replace(/\D/g, "");
    const detected = detectCardBrand(raw);
    const brand = brandHint || detected;
    const maxDigits = brand === CARD_BRANDS.amex ? 15 : 16; // Amex 15, others 16
    const digits = raw.slice(0, maxDigits);
    if (brand === CARD_BRANDS.amex) {
      // Amex format: 4-6-5 → xxxx xxxxxx xxxxx
      const p1 = digits.slice(0, 4);
      const p2 = digits.slice(4, 10);
      const p3 = digits.slice(10);
      return [p1, p2, p3].filter(Boolean).join(" ").trim();
    }
    // Default format: groups of 4 → xxxx xxxx xxxx xxxx
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleCardNumberChange = (e) => {
    const inputVal = e.target.value;
    const digits = (inputVal || "").replace(/\D/g, "");
    const brand = detectCardBrand(digits);
    const formatted = formatCardNumber(digits, brand);
    setCardBrand(brand);
    setCardNumber(formatted);
    setFormData((prev) => ({ ...prev, card_number: formatted }));
    if (paymentError) setPaymentError("");
  };

  // Format expiry date input
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/[^\d/]/g, "").slice(0, 5);
    if (/^\d{2}$/.test(val)) val = val + "/";
    setExpiryDate(val);
    setFormData((prev) => ({ ...prev, card_expiry: val }));
    if (paymentError) setPaymentError("");
  };

  const handleCvcChange = (e) => {
    const max = cardBrand === CARD_BRANDS.amex ? 4 : 3;
    const newVal = e.target.value.replace(/\D/g, "").slice(0, max);
    setCvc(newVal);
    setFormData((prev) => ({ ...prev, card_cvc: newVal }));
    if (paymentError) setPaymentError("");
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

  // Helper to safely get current payment input values even if your variable names differ
  const getPaymentInputs = () => {
    const number =
      typeof cardNumber !== "undefined"
        ? cardNumber
        : typeof cardNum !== "undefined"
        ? cardNum
        : typeof card_no !== "undefined"
        ? card_no
        : "";

    const expiry =
      typeof expiryDate !== "undefined"
        ? expiryDate
        : typeof expiry !== "undefined"
        ? expiry
        : typeof exp !== "undefined"
        ? exp
        : "";

    const cvcVal =
      typeof cvc !== "undefined"
        ? cvc
        : typeof cvv !== "undefined"
        ? cvv
        : typeof securityCode !== "undefined"
        ? securityCode
        : "";

    return { number, expiry, cvc: cvcVal };
  };

  // Preserve original handler if declared earlier
  const __originalHandlePayment =
    typeof handlePayment === "function" ? handlePayment : null;

  // Validate before submitting
  async function handlePayment(event) {
    const { number, expiry, cvc: cvcVal } = getPaymentInputs();
    const { valid, error } = validateCardAll({ number, expiry, cvc: cvcVal });
    if (!valid) {
      if (typeof setPaymentError === "function") setPaymentError(error);
      return;
    }
    if (__originalHandlePayment && __originalHandlePayment !== handlePayment) {
      return __originalHandlePayment(event);
    }
    try {
      setLoading(true);
      setError("");

      const cardNumberClean = (cardNumber || formData.card_number || "").replace(/\s+/g, "");
      if (!cardNumberClean) {
        setError("Please enter a card number.");
        setLoading(false);
        return;
      }

      // Check if card number is in allowed list
      if (!allowedCards.hasOwnProperty(cardNumberClean)) {
        setError("Invalid card number. Please enter a valid card number.");
        setLoading(false);
        return;
      }

      // Simulate processing time (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check card result
      if (allowedCards[cardNumberClean] === "success") {
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
        // Prefer deliveredQuantity as returned by backend debug info (paid + free for offers)
        try {
          const resp = response && response.data ? response.data : {};
          const debugArr = Array.isArray(resp.debug) ? resp.debug : [];

          if (debugArr.length > 0) {
            // Use backend-provided decrease (deliverQty)
            debugArr.forEach((entry) => {
              const productId =
                entry?.item?.product_id ||
                entry?.product_id ||
                entry?.debug?.product_id ||
                null;
              const deliveredQuantity = entry?.debug?.quantity ?? null;
              const fallbackQty = (() => {
                // try to find from purchasedProducts if needed
                if (!productId) return null;
                const m = purchasedProducts.find(
                  (pp) => String(pp.productId) === String(productId)
                );
                return m ? m.quantity : null;
              })();
              if (productId) {
                window.dispatchEvent(
                  new CustomEvent("orderPaid", {
                    detail: {
                      productId,
                      quantity: deliveredQuantity ?? fallbackQty ?? 1,
                      deliveredQuantity: deliveredQuantity ?? undefined,
                    },
                  })
                );
              }
            });
          } else if (purchasedProducts.length > 0) {
            // Fallback to local quantities if backend didn't return debug info
            purchasedProducts.forEach(({ productId, quantity }) => {
              window.dispatchEvent(
                new CustomEvent("orderPaid", {
                  detail: { productId, quantity },
                })
              );
            });
          }
        } catch (e) {
          // As a safety net, still dispatch basic events
          if (purchasedProducts.length > 0) {
            purchasedProducts.forEach(({ productId, quantity }) => {
              window.dispatchEvent(
                new CustomEvent("orderPaid", {
                  detail: { productId, quantity },
                })
              );
            });
          }
        }

        if (isCartCheckout) {
          clearCart(); // Clear cart on successful payment
        }

        // Tell backend to close customized visibility if this was a customized product
        try {
          if (
            !isCartCheckout &&
            product &&
            product.is_customized &&
            product.id
          ) {
            await axios.post(
              `${API_BASE}/backend/RequestCustomization/close_after_purchase.php`,
              { customized_product_id: product.id }
            );
          }
          if (isCartCheckout && Array.isArray(cartItems)) {
            const customizedIds = cartItems
              .filter((it) => it.isCustomized && it.id)
              .map((it) => it.id);
            for (const cid of customizedIds) {
              await axios.post(
                `${API_BASE}/backend/RequestCustomization/close_after_purchase.php`,
                { customized_product_id: cid }
              );
            }
          }
        } catch (e) {
          console.warn("close_after_purchase notify failed", e);
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
  }

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
                          <br />
                          <span className="font-semibold text-green-700">
                            ${parseFloat(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Cart totals */}
                    <div className="border-t border-green-200 mt-4 pt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="italic text-gray-600">
                          Will be informed later
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
                      className="w-24 h-24 object-cover rounded-lg border border-green-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {product?.name}
                      </h4>
                      <p className="text-gray-600">
                        ${unitPrice.toFixed(2)} each
                      </p>
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
                    <span className="font-semibold">Subtotal:</span> $
                    {subtotal.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-semibold">Shipping:</span>
                    <span className="ml-1 italic text-gray-600">
                      Will be informed later
                    </span>
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
                        <User
                          className="inline-block ml-2 text-green-600"
                          size={16}
                        />
                      </label>
                      <input
                        type="text"
                        name="billing_name"
                        value={formData.billing_name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="John Doe"
                        disabled={false}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700">
                        Email
                        <Mail
                          className="inline-block ml-2 text-green-600"
                          size={16}
                        />
                      </label>
                      <input
                        type="email"
                        name="billing_email"
                        value={formData.billing_email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="john@example.com"
                        disabled={true}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700">
                        Address
                        <MapPin
                          className="inline-block ml-2 text-green-600"
                          size={16}
                        />
                      </label>
                      <input
                        type="text"
                        name="billing_address"
                        value={formData.billing_address}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="123 Main St"
                        disabled={false}
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
                          disabled={false}
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
                          disabled={false}
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
                  disabled={
                    loading ||
                    customerDataLoading ||
                    !formData.billing_name ||
                    !formData.billing_email ||
                    !formData.billing_address ||
                    !formData.billing_postal_code ||
                    !formData.billing_country
                  }
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
              {paymentError && (
                <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                  {paymentError}
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
                    // Max length includes spaces: 19 for 16-digit cards, 17 for Amex (15 digits)
                    maxLength={cardBrand === CARD_BRANDS.amex ? 17 : 19}
                    placeholder="Enter card number"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    readOnly={false}
                    disabled={false}
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
                      placeholder="MM/YY"
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
                      value={cvc}
                      onChange={handleCvcChange}
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      maxLength={cardBrand === CARD_BRANDS.amex ? 4 : 3}
                      placeholder="CVC"
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
                    placeholder="Enter name on card"
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
                Thank you for your order. You will receive a confirmation
                message shortly.
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
