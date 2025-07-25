import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import axios from "axios";
import { useCart } from "../cart/CartContext";

const Offers = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from database filtered by "Offers" category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost/backend/get_products.php?category=Offers");
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        setError("Error loading products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.product_name,
      seller: product.seller_name,
      category: product.category,
      price: parseFloat(product.price),
      maxQuantity: 10,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="ml-4 text-gray-600">Loading offers...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No products state
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No Special Offers Available Yet</h3>
          <p className="text-gray-600 text-lg mb-2">We currently don't have any special offers or deals.</p>
          <p className="text-gray-500">Check back later for amazing deals and discounts!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition flex flex-col h-[370px] w-full max-w-xs mx-auto relative"
        >
          {/* Discount Badge */}
          {product.discount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
              -{product.discount}%
            </span>
          )}
          <Link to={`/product/${product.id}`} className="block">
            <img
              src={product.product_images && product.product_images.length > 0 ? 
                `http://localhost/backend/${product.product_images[0]}` : 
                "/placeholder.svg"}
              alt={product.product_name}
              className="w-full h-40 object-cover rounded-t-2xl"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found"
              }}
            />
          </Link>
          <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-green-600 font-semibold text-sm">{product.category}</span>
              <span className="flex items-center text-yellow-500 text-sm font-semibold">
                <FaStar className="mr-1 text-base" />
                {product.rating || '5.0'}
              </span>
            </div>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-green-700">
                {product.product_name}
              </h3>
            </Link>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.product_description}</p>
            <div className="flex items-end justify-between mt-auto">
              <div>
                <span className="text-green-700 font-bold text-lg">${product.price.toFixed(2)}</span>
                {product.oldPrice && (
                  <span className="text-gray-400 text-base line-through ml-2">${product.oldPrice.toFixed(2)}</span>
                )}
              </div>
              <button
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition text-base"
                onClick={() => handleAddToCart(product)}
              >
                <FaShoppingCart className="text-lg" />
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Offers
