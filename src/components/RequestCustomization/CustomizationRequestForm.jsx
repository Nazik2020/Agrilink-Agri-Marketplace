import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, XCircle } from 'lucide-react';

const CustomizationRequestForm = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customizationDetails: '',
    quantity: 1,
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customizationDetails.trim()) {
      newErrors.customizationDetails = 'Customization details are required';
    }
    
    if (formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Get current user from sessionStorage
      const userString = sessionStorage.getItem('user');
      if (!userString) {
        throw new Error('Please login to submit customization request');
      }
      
      const user = JSON.parse(userString);
      if (user.role !== 'customer') {
        throw new Error('Only customers can submit customization requests');
      }
      
      const requestData = {
        customer_id: user.id,
        seller_id: product.seller.id,
        product_id: product.id,
        customization_details: formData.customizationDetails.trim(),
        quantity: parseInt(formData.quantity),
        notes: formData.notes.trim()
      };
      
      const response = await fetch(
        'http://localhost/Agrilink-Agri-Marketplace/backend/RequestCustomization/submit_request.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        onSubmit(data);
      } else {
        throw new Error(data.message || 'Failed to submit request');
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return null;

  const modal = (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-green-600">Request Customization</h2>
            <p className="text-sm text-gray-600 mt-1">
              Customize: {product.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 mb-4 rounded-md">
          <strong>Important Notice:</strong> If your customization request is accepted, you must purchase the <u>full quantity</u> you requested. Please ensure you are ready to buy the total amount before submitting your request.
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Product Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <p className="font-medium">{product.name}</p>
              </div>
              <div>
                <span className="text-gray-600">Price:</span>
                <p className="font-medium">
                  {product?.effective_price != null && !isNaN(parseFloat(product.effective_price)) && parseFloat(product.effective_price) !== parseFloat(product.price) ? (
                    <>
                      <span className="text-green-700 font-semibold mr-2">${parseFloat(product.effective_price).toFixed(2)}</span>
                      <span className="text-gray-400 line-through">${parseFloat(product.price).toFixed(2)}</span>
                    </>
                  ) : (
                    <>${parseFloat(product.price).toFixed(2)}</>
                  )}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Category:</span>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <span className="text-gray-600">Seller:</span>
                <p className="font-medium">{product.seller.name}</p>
              </div>
            </div>
            {product?.special_offer && product.special_offer !== 'No Special Offer' && (
              <div className="mt-2">
                <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {product.special_offer}
                </span>
              </div>
            )}
          </div>

          {/* Customization Details */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-700">
              Customization Details *
            </label>
            <textarea
              name="customizationDetails"
              value={formData.customizationDetails}
              onChange={handleInputChange}
              rows="4"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Describe your customization requirements in detail..."
            />
            {errors.customizationDetails && (
              <p className="text-red-500 text-sm">{errors.customizationDetails}</p>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-700">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Enter quantity"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity}</p>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-700">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Any additional requirements or special instructions..."
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default CustomizationRequestForm;
