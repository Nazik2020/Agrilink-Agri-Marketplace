import React, { useState } from 'react';
import ProfileFormField from '../SellerProfile/ProfileFormField';
import SpecialOfferDropdown from './SpecialOfferDropdown';
import ProductImageUploader from './ProductImageUploader';

const AddProductForm = ({ product, onChange, onUpload }) => {
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...product, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSpecialOfferChange = (offer) => {
    onChange({ ...product, specialOffer: offer });
    setErrors((prev) => ({ ...prev, specialOffer: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'productName',
      'productDescription',
      'price',
    ];

    requiredFields.forEach((field) => {
      if (!product[field] || product[field].trim() === '') {
        newErrors[field] = 'This field is required.';
      }
    });

    // Price validation
    if (product.price && isNaN(product.price)) {
      newErrors.price = 'Please enter a valid price.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      alert('Product Listed Successfully!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-green-600 mb-8 text-center">
          List a New Product
        </h1>
        
        <div className="max-w-2xl mx-auto">
         
          <div className="space-y-6 ">
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
                <p className="text-red-500 text-sm mt-1">{errors.productDescription}</p>
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
          

          
          <div className="space-y-6">
            <SpecialOfferDropdown
              value={product.specialOffer}
              onChange={handleSpecialOfferChange}
              error={errors.specialOffer}
            />
            
            {/* Product Image Uploader */}
            <div className="mt-8">
              <ProductImageUploader onUpload={onUpload} />
            </div>
          </div>
        </div>
</div>
        {/* List Product Button */}
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