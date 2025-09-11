import React, { useState, useEffect } from 'react';
import { Package, Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../cart/CartContext';

// PopupMessage and ProductDetailsModal styled like ContentModeration
function PopupMessage({ message, type, onClose }) {
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
            {/* Success or error icon */}
            <span style={{fontWeight:'bold',fontSize:'1.5em'}}>{isSuccess ? '✔️' : '❌'}</span>
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
            ×
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
}

function ProductDetailsModal({ open, product, onClose }) {
  if (!open || !product) return null;
  // Get image URL from product.product_images (same logic as product card)
  let imgUrl = "https://via.placeholder.com/300x200?text=No+Image";
  if (product.product_images) {
    let arr = Array.isArray(product.product_images)
      ? product.product_images
      : String(product.product_images)
          .replace(/[\[\]"]/g, "")
          .split(",");
    let img = arr[0] && arr[0].trim();
    if (img) {
      if (!/^https?:\/\//.test(img)) {
        img = `http://localhost/Agrilink-Agri-Marketplace/backend/${img}`;
      }
      imgUrl = img;
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-50/50">
  <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-10 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-2">Product Details</h2>
        <div className="flex flex-col items-center mb-4">
          <div className="w-full flex justify-center items-center" style={{minHeight: '220px'}}>
            <img
              src={imgUrl}
              alt="Product"
              className="max-h-56 max-w-full object-contain rounded-lg mb-2 bg-gray-100"
              style={{background: '#f3f4f6'}}
              onError={e => {e.target.src = "https://via.placeholder.com/300x200?text=No+Image";}}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div><span className="font-semibold">Product Name:</span> {product.product_name}</div>
          <div><span className="font-semibold">Description:</span> {product.product_description}</div>
          <div><span className="font-semibold">Customization Details:</span> {product.customization_details || product.customization_description || 'N/A'}</div>
          <div><span className="font-semibold">Price:</span> Rs. {product.price}</div>
          <div><span className="font-semibold">Quantity:</span> {product.stock}</div>
        </div>
      </div>
    </div>
  );
}

const CustomizedProductsSection = ({ customerId }) => {
  const [customizedProducts, setCustomizedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [viewProduct, setViewProduct] = useState(null);
  // Fix: define handleViewProduct inside component
  const handleViewProduct = (product) => {
    setViewProduct(product);
  };

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
        <h2 className="text-3xl font-bold text-green-600 mb-5">Your Customized Products</h2>
        <p className="text-sm text-gray-600">
          {customizedProducts.length} customized product{customizedProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {customizedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-white-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="w-full flex justify-center items-center rounded-lg overflow-hidden h-56 mb-4 bg-white-100">
              <img
                src={(function() {
                  if (!product.product_images) return "https://via.placeholder.com/300x200?text=No+Image";
                  let arr = Array.isArray(product.product_images)
                    ? product.product_images
                    : String(product.product_images)
                        .replace(/[\[\]"]/g, "")
                        .split(",");
                  let img = arr[0] && arr[0].trim();
                  if (img && !/^https?:\/\//.test(img)) {
                    img = `http://localhost/Agrilink-Agri-Marketplace/backend/${img}`;
                  }
                  return img || "https://via.placeholder.com/300x200?text=No+Image";
                })()}
                alt={product.product_name}
                className="max-h-52 max-w-full object-contain rounded-lg bg-gray-100"
                style={{background: '#f3f4f6'}}
                onError={e => {e.target.src = "https://via.placeholder.com/300x200?text=No+Image";}}
              />
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

              {/* Customization details and product description removed from grid. Only shown in popup. */}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-4">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  onClick={() => handleViewProduct(product)}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProductDetailsModal
        open={!!viewProduct}
        product={viewProduct}
        onClose={() => setViewProduct(null)}
      />
    </div>
  );
};

export default CustomizedProductsSection;
