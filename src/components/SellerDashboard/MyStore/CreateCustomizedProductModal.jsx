import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, CheckCircle } from 'lucide-react';

const categories = ["Products", "Seeds", "Offers", "Fertilizer"];

// Special offer removed for customized products per requirements

const CreateCustomizedProductModal = ({ request, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    customizationDescription: '',
    price: '',
    stock: '',
    category: '',
    // Removed: specialOffer
  });
  const [errors, setErrors] = useState({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  // Removed: special offer dropdown
  const [isLoading, setIsLoading] = useState(false);

  const categoryDropdownRef = useRef();
  // Removed: special offer ref

  useEffect(() => {
    if (request) {
      // Pre-populate form with request data
      const basePrice = (request?.effective_price != null && !isNaN(parseFloat(request.effective_price)))
        ? parseFloat(request.effective_price)
        : parseFloat(request.original_price);
      setFormData({
        // Pre-fill product name for clarity; seller can still edit
        productName: `${request.product_name} - Customized`,
        // Keep product description from the original product
        productDescription: request.product_description,
        // Keep customization description empty so seller can write their version
        customizationDescription: '',
        // Leave price empty so seller can input their offered price
        price: '',
        stock: request.quantity,
        category: request.category || 'Products'
      });
    }
  }, [request]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      // no-op for removed special offer UI
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({ ...prev, category }));
    setShowCategoryDropdown(false);
    setErrors(prev => ({ ...prev, category: "" }));
  };

  // Removed: handleSpecialOfferChange

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "productName",
      "productDescription",
      "customizationDescription",
      "price",
      "category",
    ];

    requiredFields.forEach((field) => {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && formData[field].trim() === "")
      ) {
        newErrors[field] = "This field is required.";
      }
    });

    // Validate price
    if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) < 0)) {
      newErrors.price = "Please enter a valid price (0 or more).";
    }

    // Validate stock
    if (
      formData.stock === undefined ||
      formData.stock === null ||
      formData.stock === ""
    ) {
      newErrors.stock = "Quantity is required.";
    } else if (isNaN(formData.stock) || parseInt(formData.stock, 10) < 1) {
      newErrors.stock = "Please enter a valid quantity (1 or more).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const productData = {
        product_name: formData.productName.trim(),
        product_description: formData.productDescription.trim(),
        customization_description: formData.customizationDescription.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        category: formData.category
      };

      await onSubmit(productData);
    } catch (error) {
      console.error('Error creating customized product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!request) return null;

  const modal = (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-green-600">Create Customized Product</h2>
            <p className="text-sm text-gray-600 mt-1">
              Based on customization request from {request.customer_name}
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

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Request Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Original Request Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Product:</span>
                <p className="font-medium">{request.product_name}</p>
              </div>
              <div>
                <span className="text-blue-600">Customer:</span>
                <p className="font-medium">{request.customer_name}</p>
              </div>
              <div>
                <span className="text-blue-600">Quantity:</span>
                <p className="font-medium">{request.quantity}</p>
              </div>
              <div>
                <span className="text-blue-600">Price at Request Time:</span>
                <p className="font-medium">
                  {request?.effective_price != null && parseFloat(request.effective_price) !== parseFloat(request.original_price) ? (
                    <>
                      <span className="text-green-700 font-semibold mr-2">${parseFloat(request.effective_price).toFixed(2)}</span>
                      <span className="text-gray-400 line-through">${parseFloat(request.original_price).toFixed(2)}</span>
                    </>
                  ) : (
                    <>${parseFloat(request.original_price).toFixed(2)}</>
                  )}
                </p>
              </div>
            </div>
            {/* Special offer display removed for customized flow */}
            <div className="mt-3">
              <span className="text-blue-600 font-medium">Customization Request:</span>
              <p className="text-blue-800 mt-1">{request.customization_details}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter a clear customized product name"
                />
                {errors.productName && (
                  <p className="text-red-500 text-sm">{errors.productName}</p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-700">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter your offered price"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-700">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="1"
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter quantity"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm">{errors.stock}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Category Dropdown */}
              <div className="space-y-2" ref={categoryDropdownRef}>
                <label className="block text-base font-semibold text-gray-700">
                  Category *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => !isLoading && setShowCategoryDropdown(!showCategoryDropdown)}
                    className={`w-full px-4 py-2 border rounded-xl text-left transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 flex items-center justify-between disabled:bg-gray-50 disabled:cursor-not-allowed ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isLoading}
                  >
                    <span className={formData.category ? "text-gray-900" : "text-gray-500"}>
                      {formData.category || "Select a Category"}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${
                        showCategoryDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showCategoryDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryChange(cat)}
                          className={`w-full px-4 py-3 text-left hover:bg-green-50 hover:text-green-600 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl ${
                            formData.category === cat ? 'bg-green-50 text-green-600 font-medium' : ''
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.category && (
                  <p className="text-red-500 text-sm">{errors.category}</p>
                )}
              </div>

              {/* Special Offer removed */}
            </div>
          </div>

          {/* Product Description - Full Width */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-700">
              Product Description *
            </label>
            <textarea
              name="productDescription"
              value={formData.productDescription}
              onChange={handleInputChange}
              rows="3"
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Enter a clear customized product description"
            />
            {errors.productDescription && (
              <p className="text-red-500 text-sm">{errors.productDescription}</p>
            )}
          </div>

          {/* Customization Description - Full Width */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-700">
              Customization Description *
            </label>
            <textarea
              name="customizationDescription"
              value={formData.customizationDescription}
              onChange={handleInputChange}
              rows="3"
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Describe the seller-defined customization (e.g., packaging, size, extra processing)"
            />
            {errors.customizationDescription && (
              <p className="text-red-500 text-sm">{errors.customizationDescription}</p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Create Product</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default CreateCustomizedProductModal;
