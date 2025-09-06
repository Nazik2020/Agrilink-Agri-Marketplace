import React, { useState, useEffect } from 'react';
import { Package, Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../cart/CartContext';

const CustomizedProductsSection = ({ customerId }) => {
  const [customizedProducts, setCustomizedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (customerId) {
      fetchCustomizedProducts();
    }
  }, [customerId]);

  const fetchCustomizedProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost/Agrilink-Agri-Marketplace/backend/RequestCustomization/get_customer_customized_products.php?customerId=${customerId}`
      );
      const data = await response.json();
      
      if (data.success) {
        setCustomizedProducts(data.products);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch customized products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart({
        id: product.id,
        name: product.product_name,
        seller: product.seller_name,
        category: product.category,
        price: product.price,
        quantity: 1,
        maxQuantity: product.stock,
        isCustomized: true // Flag to identify customized products
      });
    }
  };

  const handleAddToWishlist = (product) => {
    // Add to wishlist logic here
    console.log('Adding to wishlist:', product);
    // You can integrate with your existing wishlist system
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600">Loading customized products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">Error: {error}</p>
      </div>
    );
  }

  if (customizedProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Customized Products</h3>
        <p className="text-gray-500">You don't have any customized products yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Customized Products</h2>
        <p className="text-sm text-gray-600">
          {customizedProducts.length} customized product{customizedProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {customizedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center h-48 mb-4">
              {product.product_images ? (
                <img
                  src={`http://localhost/Agrilink-Agri-Marketplace/backend/${product.product_images}`}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzljYTNhZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2Ij5ObyBJbWFnZTwvdGV4dD4KICA8L3N2Zz4K";
                  }}
                />
              ) : (
                <Package className="h-12 w-12 text-gray-400" />
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {product.product_name}
                </h3>
                <p className="text-sm text-gray-600">
                  by {product.seller_name}
                </p>
              </div>

              {/* Customization Badge */}
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Package className="h-3 w-3 mr-1" />
                Customized
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                {product.special_offer && (
                  <span className="text-sm text-red-600 font-medium">
                    {product.special_offer}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Stock: {product.stock}
                </span>
                <span className={`text-sm font-medium ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Customization Description */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  Customization Details:
                </h4>
                <p className="text-sm text-blue-700">
                  {product.customization_description}
                </p>
              </div>

              {/* Product Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">
                  Product Description:
                </h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {product.product_description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    product.stock > 0
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleAddToWishlist(product)}
                  className="flex items-center justify-center p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizedProductsSection;
