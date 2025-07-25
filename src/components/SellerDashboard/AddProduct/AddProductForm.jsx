import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import ProfileFormField from "../SellerProfile/ProfileFormField";
import SpecialOfferDropdown from "./SpecialOfferDropdown";
import ProductImageUploader from "./ProductImageUploader";

const categories = ["Products", "Seeds", "Offers", "Fertilizer"];

const AddProductForm = ({ product, onChange, onUpload, sellerId }) => {
  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

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
      if (!product[field] || product[field].trim() === "") {
        newErrors[field] = "This field is required.";
      }
    });

    if (product.price && isNaN(product.price)) {
      newErrors.price = "Please enter a valid price.";
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

      imageFiles.forEach((file) => {
        formData.append("product_images[]", file);
      });

      try {
        const res = await axios.post(
          "http://localhost/backend/add_product.php",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (res.data.success) {
          alert("Product Listed Successfully!");
        } else {
          alert("Product listing failed!");
        }
      } catch (err) {
        alert("Error adding product");
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
    </div>
  );
};

export default AddProductForm;
