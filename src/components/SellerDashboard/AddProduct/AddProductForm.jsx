import React, { useState, useRef } from "react";
import { ChevronDown, CheckCircle, XCircle, X } from "lucide-react";
import axios from "axios";
import ProfileFormField from "../SellerProfile/ProfileFormField";
import SpecialOfferDropdown from "./SpecialOfferDropdown";
import ProductImageUploader from "./ProductImageUploader";

const categories = ["Products", "Seeds", "Offers", "Fertilizer"];

// Custom Popup Component
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

const AddProductForm = ({ product, onChange, onUpload, sellerId }) => {
  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState('success');
  const productImageUploaderRef = useRef(null);

  const showPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
  };

  const closePopup = () => {
    setPopupMessage(null);
  };

  const clearForm = () => {
    // Clear the product data
    onChange({
      productName: "",
      productDescription: "",
      price: "",
      stock: "",
      category: "",
      specialOffer: ""
    });
    
    // Clear image files
    setImageFiles([]);
    
    // Clear any errors
    setErrors({});
    
    // Close category dropdown if open
    setShowCategoryDropdown(false);
    
    // Clear the product image uploader
    if (productImageUploaderRef.current && productImageUploaderRef.current.clearImages) {
      productImageUploaderRef.current.clearImages();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...product, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCategoryChange = (e) => {
    onChange({ ...product, category: e.target.value });
    setErrors((prev) => ({ ...prev, category: "" }));
  };

  const handleSpecialOfferChange = (offer) => {
    onChange({ ...product, specialOffer: offer });
    setErrors((prev) => ({ ...prev, specialOffer: "" }));
  };

  const handleImageUpload = (files) => {
    setImageFiles(files);
    if (onUpload) onUpload(files);
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
        !product[field] ||
        (typeof product[field] === "string" && product[field].trim() === "")
      ) {
        newErrors[field] = "This field is required.";
      }
    });

    // Validate price
    if (product.price && isNaN(product.price)) {
      newErrors.price = "Please enter a valid price.";
    }

    // Validate stock
    if (
      product.stock === undefined ||
      product.stock === null ||
      product.stock === ""
    ) {
      newErrors.stock = "Quantity is required.";
    } else if (isNaN(product.stock) || parseInt(product.stock, 10) < 0) {
      newErrors.stock = "Please enter a valid quantity (0 or more).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const formData = new FormData();

      formData.append("seller_id", sellerId || product.seller_id);
      formData.append("product_name", product.productName);
      formData.append("product_description", product.productDescription);
      formData.append("price", product.price);
      formData.append("special_offer", product.specialOffer);
      formData.append("category", product.category);
      // Always send stock as integer
      formData.append(
        "stock",
        Number.isNaN(Number(product.stock)) ? 0 : parseInt(product.stock, 10)
      );

      imageFiles.forEach((file) => {
        formData.append("product_images[]", file);
      });

      try {
        const res = await axios.post(
          "http://localhost/Agrilink-Agri-Marketplace/backend/add_product.php",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        console.log("Add Product API Response:", res.data);
        if (res.data.success === true) {
          showPopup("Product Listed Successfully!", 'success');
          clearForm(); // Clear form after successful submission
        } else {
          showPopup(
            "Product listing failed! " + (res.data.error || "Please try again."), 
            'error'
          );
        }
      } catch (err) {
        showPopup("Error adding product. Please check your connection and try again.", 'error');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-green-600 mb-8 text-center">
          List a New Product
        </h1>

        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <ProfileFormField
              label="Product Name"
              name="productName"
              value={product.productName}
              onChange={handleInputChange}
              error={errors.productName}
              required
            />

            <div className="space-y-2">
              <label className="block text-base font-semibold text-gray-500">
                Product Description *
              </label>
              <textarea
                name="productDescription"
                value={product.productDescription}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-green-400 hover:shadow-md resize-none"
                placeholder="Describe your product in detail"
              />
              {errors.productDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productDescription}
                </p>
              )}
            </div>

            <ProfileFormField
              label="Price"
              name="price"
              type="number"
              value={product.price}
              onChange={handleInputChange}
              error={errors.price}
              required
            />

            <ProfileFormField
              label="Quantity"
              name="stock"
              type="number"
              value={product.stock === 0 ? "" : product.stock || ""}
              onChange={handleInputChange}
              error={errors.stock}
              min={0}
              required
            />

            {/* Category Dropdown (Nazik's version) */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Category *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown((prev) => !prev)}
                  className={`w-full px-4 py-2 border rounded-xl text-left transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 hover:shadow-md flex items-center justify-between ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <span
                    className={
                      product.category ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {product.category || "Select a Category"}
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
                        onClick={() => {
                          handleCategoryChange({
                            target: { value: cat, name: "category" },
                          });
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-green-50 hover:text-green-600 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <SpecialOfferDropdown
              value={product.specialOffer}
              onChange={handleSpecialOfferChange}
              error={errors.specialOffer}
            />

            <div className="mt-8">
              <ProductImageUploader
                ref={productImageUploaderRef}
                onUpload={handleImageUpload}
                imageFiles={imageFiles}
                maxImages={5}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            List Product
          </button>
        </div>
      </div>

      {/* Custom Popup Message */}
      <PopupMessage
        message={popupMessage}
        type={popupType}
        onClose={closePopup}
      />
    </div>
  );
};

export default AddProductForm;