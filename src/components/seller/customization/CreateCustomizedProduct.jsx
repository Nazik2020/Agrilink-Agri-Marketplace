import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../../../config/api';

const CreateCustomizedProduct = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [customizationRequest, setCustomizationRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [productDescription, setProductDescription] = useState('');
  const [customizationDescription, setCustomizationDescription] = useState('');

  // Get the customization request details
  useEffect(() => {
    const fetchCustomizationRequest = async () => {
      try {
        setLoading(true);
        const response = await axios.get(getApiUrl('GET_CUSTOMIZATION_REQUEST_DETAILS'), {
          params: { request_id: requestId }
        });
        
        if (response.data.success) {
          setCustomizationRequest(response.data.request);
          // Prefill form with data from the request
          setProductName(response.data.request.product_name);
          setQuantity(response.data.request.quantity || 1);
          // Other prefills
        } else {
          setError('Failed to fetch customization request');
        }
      } catch (err) {
        setError('Error loading customization request');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchCustomizationRequest();
    }
  }, [requestId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = {
        request_id: requestId,
        product_name: productName,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        product_description: productDescription,
        customization_description: customizationDescription
      };
      
      const response = await axios.post(getApiUrl('CREATE_CUSTOMIZED_PRODUCT'), formData);
      
      if (response.data.success) {
        navigate('/seller/dashboard/products');
      } else {
        setError(response.data.message || 'Failed to create customized product');
      }
    } catch (err) {
      setError('Error creating customized product');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">Create Customized Product</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-800"
        >
          ×
        </button>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Original Request Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Product:</p>
            <p className="font-medium">{customizationRequest?.product_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Customer:</p>
            <p className="font-medium">{customizationRequest?.customer_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Quantity:</p>
            <p className="font-medium">{customizationRequest?.quantity}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Price at Request Time:</p>
            <p className="font-medium">
              <span className="text-green-600">${customizationRequest?.price?.toFixed(2)}</span>
              {customizationRequest?.original_price && (
                <span className="text-gray-500 line-through ml-2">
                  ${customizationRequest.original_price.toFixed(2)}
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">Customization Request:</p>
          <p className="p-2 bg-white rounded border border-gray-200">
            {customizationRequest?.customization_request}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-600">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded appearance-none"
            >
              <option value="">Select Category</option>
              <option value="Products">Products</option>
              <option value="Seeds">Seeds</option>
              <option value="Fertilizer">Fertilizer</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter your offered price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0.01"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Description <span className="text-red-600">*</span>
          </label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
            rows={5}
            className="w-full p-2 border border-gray-300 rounded resize-none"
          ></textarea>
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customization Description <span className="text-red-600">*</span>
          </label>
          <textarea
            placeholder="Describe the seller-defined customization (e.g., packaging, size, extra processing)"
            value={customizationDescription}
            onChange={(e) => setCustomizationDescription(e.target.value)}
            rows={5}
            className="w-full p-2 border border-gray-300 rounded resize-none"
          ></textarea>
        </div>
        
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomizedProduct;