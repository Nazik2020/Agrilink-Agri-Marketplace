import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, CheckCircle, XCircle } from "lucide-react";

const categories = ["Products", "Seeds", "Offers", "Fertilizer"];

const specialOfferOptions = [
  "No Special Offer",
  "5% Off",
  "10% Off",
  "15% Off", 
  "20% Off",
  "25% Off",
  "30% Off",
  "Buy 1 Get 1 Free",
  "Buy 2 Get 1 Free",
  "Limited Time Offer"
];

const PopupMessage = ({ message, type, onClose }) => {
  if (!message) return null;
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-green-50/50 z-[70]">
      <div className={`${bgColor} ${borderColor} border rounded-xl p-6 max-w-md w-full mx-4 shadow-lg`}>
        <div className="flex items-start space-x-3">
          <div className={`${iconColor} flex-shrink-0 mt-0.5`}>
            {isSuccess ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <XCircle className="h-6 w-6" />
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
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isSuccess 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const EditProductModal = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    price: '',
    stock: '',
    category: '',
    specialOffer: ''
  });
  const [errors, setErrors] = useState({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSpecialOfferDropdown, setShowSpecialOfferDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState('success');
  const [fullProductData, setFullProductData] = useState(null);

  const categoryDropdownRef = useRef();
  const specialOfferDropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (specialOfferDropdownRef.current && !specialOfferDropdownRef.current.contains(event.target)) {
        setShowSpecialOfferDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (product) {
      // Fetch full product details to get all fields
      setIsLoadingDetails(true);
      const fetchFullProductDetails = async () => {
        try {
          const response = await fetch(
            `http://localhost/Agrilink-Agri-Marketplace/backend/get_product_details.php?id=${product.id}`
          );
          const data = await response.json();
          
          if (data.success && data.product) {
            const fullProduct = data.product;
            setFullProductData(fullProduct);
            
            console.log('Full product data loaded:', fullProduct);
            
            // Pre-populate form with complete product data
            setFormData({
              productName: fullProduct.name || '',
              productDescription: fullProduct.description || '',
              price: fullProduct.price || '',
              stock: fullProduct.stock || '',
              category: fullProduct.category || '',
              specialOffer: fullProduct.special_offer || 'No Special Offer'
            });
          } else {
            // Fallback to basic product data if full details fetch fails
            setFormData({
              productName: product.product_name || '',
              productDescription: product.product_description || '',
              price: product.price || '',
              stock: product.stock || '',
              category: product.category || '',
              specialOffer: product.special_offer || 'No Special Offer'
            });
          }
        } catch (error) {
          console.error('Error fetching full product details:', error);
          // Fallback to basic product data
          setFormData({
            productName: product.product_name || '',
            productDescription: product.product_description || '',
            price: product.price || '',
            stock: product.stock || '',
            category: product.category || '',
            specialOffer: product.special_offer || 'No Special Offer'
          });
        } finally {
          setIsLoadingDetails(false);
        }
      };
      
      fetchFullProductDetails();
    }
  }, [product]);

  const showPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
  };

  const closePopup = () => {
    setPopupMessage(null);
  };

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

  const handleSpecialOfferChange = (offer) => {
    setFormData(prev => ({ ...prev, specialOffer: offer }));
    setShowSpecialOfferDropdown(false);
    setErrors(prev => ({ ...prev, specialOffer: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "productName",
      "productDescription",
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
    } else if (isNaN(formData.stock) || parseInt(formData.stock, 10) < 0) {
      newErrors.stock = "Please enter a valid quantity (0 or more).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();

      // Add product data
      formDataToSend.append('productId', product.id);
      formDataToSend.append('product_name', formData.productName.trim());
      formDataToSend.append('product_description', formData.productDescription.trim());
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('stock', parseInt(formData.stock, 10));
      formDataToSend.append('category', formData.category);
      formDataToSend.append('special_offer', formData.specialOffer === 'No Special Offer' ? '' : formData.specialOffer);

      // No image editing, so do not append any image fields

      const response = await fetch(
        "http://localhost/Agrilink-Agri-Marketplace/backend/update_product.php",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (data.success) {
        showPopup("Product updated successfully! Changes will be reflected immediately.", 'success');
        setTimeout(async () => {
          if (onUpdate) {
            await onUpdate(true);
          }
          onClose();
        }, 1500);
      } else {
        const errorMessage = data.message || "Unknown error occurred";
        const detailedError = data.error ? ` (${data.error})` : '';
        showPopup(`Failed to update product: ${errorMessage}${detailedError}`, 'error');
      }
    } catch (error) {
      console.error("Update error:", error);
      let errorMessage = "Error updating product. Please try again.";
      showPopup(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!product) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-green-50/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-green-600">Edit Product</h2>
              <p className="text-sm text-gray-600 mt-1">All fields are pre-populated with current product data</p>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              disabled={isLoading || isLoadingDetails}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {isLoadingDetails && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <span className="ml-3 text-gray-600">Loading product details...</span>
              </div>
            )}
            {!isLoadingDetails && !fullProductData && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Some product details may not be available. Please verify all information before saving.
                </p>
              </div>
            )}
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
                    disabled={isLoading || isLoadingDetails}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Enter product name"
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
                    disabled={isLoading || isLoadingDetails}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Enter price"
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
                    min="0"
                    disabled={isLoading || isLoadingDetails}
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
                      onClick={() => !isLoading && !isLoadingDetails && setShowCategoryDropdown(!showCategoryDropdown)}
                      className={`w-full px-4 py-2 border rounded-xl text-left transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 flex items-center justify-between disabled:bg-gray-50 disabled:cursor-not-allowed ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isLoading || isLoadingDetails}
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

                {/* Special Offer Dropdown */}
                <div className="space-y-2" ref={specialOfferDropdownRef}>
                  <label className="block text-base font-semibold text-gray-700">
                    Special Offer
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => !isLoading && !isLoadingDetails && setShowSpecialOfferDropdown(!showSpecialOfferDropdown)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-left transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 flex items-center justify-between disabled:bg-gray-50 disabled:cursor-not-allowed"
                      disabled={isLoading || isLoadingDetails}
                    >
                      <span className={formData.specialOffer ? "text-gray-900" : "text-gray-500"}>
                        {formData.specialOffer || "No Special Offer"}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-300 ${
                          showSpecialOfferDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showSpecialOfferDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {specialOfferOptions.map((offer) => (
                          <button
                            key={offer}
                            type="button"
                            onClick={() => handleSpecialOfferChange(offer)}
                            className={`w-full px-4 py-3 text-left hover:bg-green-50 hover:text-green-600 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl ${
                              formData.specialOffer === offer ? 'bg-green-50 text-green-600 font-medium' : ''
                            }`}
                          >
                            {offer}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
                rows="4"
                disabled={isLoading || isLoadingDetails}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Describe your product in detail"
              />
              {errors.productDescription && (
                <p className="text-red-500 text-sm">{errors.productDescription}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              disabled={isLoading || isLoadingDetails}
              className="px-6 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || isLoadingDetails}
              className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Popup */}
      <PopupMessage
        message={popupMessage}
        type={popupType}
        onClose={closePopup}
      />
    </>
  );
}; 

export default EditProductModal;