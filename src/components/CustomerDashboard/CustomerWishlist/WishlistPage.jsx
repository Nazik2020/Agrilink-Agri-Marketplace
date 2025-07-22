import React, { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Organic Tomatoes',
      price: 24.99,
      originalPrice: 29.99,
      image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      rating: 4.5,
      seller: 'Green Valley Farm',
      inStock: true
    },
    {
      id: 2,
      name: 'Fresh Spinach',
      price: 18.50,
      originalPrice: 22.00,
      image: 'https://images.pexels.com/photos/2255925/pexels-photo-2255925.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      rating: 4.8,
      seller: 'Organic Farms Co.',
      inStock: true
    },
    {
      id: 3,
      name: 'Premium Carrots',
      price: 16.75,
      originalPrice: 20.00,
      image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      rating: 4.2,
      seller: 'Farm Fresh Direct',
      inStock: false
    }
  ]);

  const removeFromWishlist = (id) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const addToCart = (item) => {
    console.log('Added to cart:', item);
    // Handle add to cart logic here
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-green-600" size={32} />
        <h2 className="text-3xl font-bold text-green-600">My Wishlist</h2>
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
          {wishlistItems.length} items
        </span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500">Add products you love to keep track of them</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mt-10">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors duration-300"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                  {item.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({item.rating})</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{item.seller}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">${item.price}</span>
                    <span className="text-sm text-gray-400 line-through">${item.originalPrice}</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">
                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                  </span>
                </div>
                
                <button
                  onClick={() => addToCart(item)}
                  disabled={!item.inStock}
                  className={`w-full py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    item.inStock 
                      ? 'bg-green-500 hover:bg-green-600 text-white hover:shadow-md transform hover:scale-105' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart size={16} />
                  {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;