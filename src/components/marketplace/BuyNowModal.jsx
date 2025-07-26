import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CreditCard, Lock, CheckCircle, X } from 'lucide-react';
import axios from 'axios';

const BuyNowModal = ({ isOpen, onClose, product, quantity = 1 }) => {
  // State management
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stripeKey, setStripeKey] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    // Billing Information
    billing_name: '',
    billing_email: '',
    billing_address: '',
    billing_city: '',
    billing_postal_code: '',
    billing_country: 'United States',
    
    // Card Information
    card_number: '',
    card_expiry: '',
    card_cvc: '',
    card_name: '',
    
    // Order details
    quantity: quantity,
    customer_id: 3 // Using first available customer ID from database
  });
  
  // Order summary
  const unitPrice = parseFloat(product?.price || 0);
  const totalAmount = unitPrice * formData.quantity;

  // Load Stripe configuration
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

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const loadStripeConfig = async () => {
    try {
      const response = await axios.get('http://localhost/backend/get_stripe_config.php');
      if (response.data.success) {
        setStripeKey(response.data.publishable_key);
      }
    } catch (error) {
      console.error('Error loading Stripe config:', error);
      setError('Payment system unavailable');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format card number input
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    
    setFormData(prev => ({
      ...prev,
      card_number: formattedValue
    }));
  };

  // Format expiry date input
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0,2) + '/' + value.substring(2,4);
    }
    
    setFormData(prev => ({
      ...prev,
      card_expiry: value
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = [];
    
    // Billing validation
    if (!formData.billing_name.trim()) errors.push('Name is required');
    if (!formData.billing_email.trim()) errors.push('Email is required');
    if (!formData.billing_address.trim()) errors.push('Address is required');
    if (!formData.billing_city.trim()) errors.push('City is required');
    if (!formData.billing_postal_code.trim()) errors.push('Postal code is required');
    
    // Card validation (basic)
    if (!formData.card_number.replace(/\s/g, '')) errors.push('Card number is required');
    if (!formData.card_expiry) errors.push('Expiry date is required');
    if (!formData.card_cvc) errors.push('CVC is required');
    if (!formData.card_name.trim()) errors.push('Cardholder name is required');
    
    return errors;
  };

  // Handle payment processing
  const handlePayment = async () => {
    setError('');
    setLoading(true);
    
    try {
      // Validate form
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        setLoading(false);
        return;
      }

      // Prepare checkout data
      const checkoutData = {
        action: 'create_payment_intent',
        product_id: product.id,
        quantity: formData.quantity,
        customer_id: formData.customer_id,
        billing_name: formData.billing_name,
        billing_email: formData.billing_email,
        billing_address: formData.billing_address,
        billing_city: formData.billing_city,
        billing_postal_code: formData.billing_postal_code,
        billing_country: formData.billing_country
      };

      // Create payment intent
      const response = await axios.post('http://localhost/backend/checkout_api.php', checkoutData);
      
      if (response.data.success) {
        // Simulate payment success (in real implementation, you'd use Stripe Elements)
        setTimeout(() => {
          setStep(3); // Success step
          setLoading(false);
        }, 2000);
      } else {
        setError(response.data.error || 'Payment failed');
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment processing failed');
      setLoading(false);
    }
  };

  // Reset modal when closed
  const handleClose = () => {
    setStep(1);
    setError('');
    setLoading(false);
    setFormData({
      billing_name: '',
      billing_email: '',
      billing_address: '',
      billing_city: '',
      billing_postal_code: '',
      billing_country: 'United States',
      card_number: '',
      card_expiry: '',
      card_cvc: '',
      card_name: '',
      quantity: quantity,
      customer_id: 1
    });
    onClose();
  };

  if (!isOpen) return null;

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
                {step === 1 ? 'Order Details' : step === 2 ? 'Payment Information' : 'Order Confirmed'}
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
            <div className={`flex items-center space-x-2 transition-all duration-300 ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= 1 ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200'}`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span className="font-semibold text-sm">Details</span>
            </div>
            <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 transition-all duration-300 ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= 2 ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200'}`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <span className="font-semibold text-sm">Payment</span>
            </div>
            <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 transition-all duration-300 ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= 3 ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200'}`}>
                {step >= 3 ? '✓' : '3'}
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
                <h3 className="font-bold text-lg mb-3 text-gray-800">Order Summary</h3>
                <div className="flex items-center space-x-4">
                  <img 
                    src={product?.images?.[0] || '/placeholder.svg'} 
                    alt={product?.name}
                    className="w-16 h-16 object-cover rounded-lg border border-green-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{product?.name}</h4>
                    <p className="text-gray-600">${unitPrice.toFixed(2)} each</p>
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({...prev, quantity: parseInt(e.target.value) || 1}))}
                      className="w-16 p-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-green-500 focus:border-green-600"
                    />
                  </div>
                </div>
                <div className="border-t border-green-200 mt-4 pt-4 flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-800">Total:</span>
                  <span className="font-bold text-xl text-green-600">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Billing Information */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-600 text-sm">📍</span>
                  </div>
                  Billing Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="billing_name"
                    placeholder="Full Name"
                    value={formData.billing_name}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all duration-200"
                  />
                  <input
                    type="email"
                    name="billing_email"
                    placeholder="Email Address"
                    value={formData.billing_email}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all duration-200"
                  />
                  <input
                    type="text"
                    name="billing_address"
                    placeholder="Street Address"
                    value={formData.billing_address}
                    onChange={handleInputChange}
                    className="sm:col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all duration-200"
                  />
                  <input
                    type="text"
                    name="billing_city"
                    placeholder="City"
                    value={formData.billing_city}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all duration-200"
                  />
                  <input
                    type="text"
                    name="billing_postal_code"
                    placeholder="Postal Code"
                    value={formData.billing_postal_code}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all duration-200"
                  />
                </div>
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
                  <p className="text-green-600 text-sm">Your payment information is encrypted and secure</p>
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
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{product?.name} × {formData.quantity}</span>
                  <span className="font-bold text-xl text-green-600">${totalAmount.toFixed(2)}</span>
                </div>
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
                <p className="text-gray-600">Your order has been confirmed and will be processed soon.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="font-semibold text-gray-800 mb-2">Order Details:</p>
                <p className="text-gray-700 mb-1">{product?.name} × {formData.quantity}</p>
                <p className="font-bold text-xl text-green-600">Total: ${totalAmount.toFixed(2)}</p>
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
  return createPortal(modalContent, document.body);
};

export default BuyNowModal;
