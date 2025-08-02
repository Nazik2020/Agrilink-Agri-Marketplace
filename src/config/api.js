// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/backend',
  ENDPOINTS: {
    // Order History
    ORDER_HISTORY: '/order_history/get_customer_orders_enhanced.php',
    ORDER_HISTORY_SIMPLE: '/order_history/get_customer_orders_simple.php',
    ORDER_HISTORY_ORIGINAL: '/order_history/get_customer_orders.php',
    
    // Cart
    GET_CART: '/get_cart.php',
    ADD_TO_CART: '/add_to_cart.php',
    UPDATE_CART: '/update_cart_item.php',
    REMOVE_FROM_CART: '/remove_from_cart.php',
    
    // Wishlist
    GET_WISHLIST: '/get_wishlist.php',
    ADD_TO_WISHLIST: '/add_to_wishlist.php',
    REMOVE_FROM_WISHLIST: '/remove_from_wishlist.php',
    
    // Products
    GET_PRODUCTS: '/get_products.php',
    GET_PRODUCT_DETAILS: '/get_product_details.php',
    ADD_PRODUCT: '/add_product.php',
    
    // Authentication
    LOGIN: '/Login.php',
    SIGNUP_CUSTOMER: '/SignupCustomer.php',
    SIGNUP_SELLER: '/SignupSeller.php',
    RESET_PASSWORD: '/reset_password.php',
    VALIDATE_TOKEN: '/validate_token.php',
    
    // Profile
    GET_CUSTOMER_PROFILE: '/get_customer_profile.php',
    UPDATE_CUSTOMER_PROFILE: '/update_customer_profile.php',
    GET_SELLER_PROFILE: '/get_seller_profile.php',
    UPDATE_SELLER_PROFILE: '/update_seller_profile.php',
    
    // Reviews
    GET_REVIEWS: '/get_reviews.php',
    ADD_REVIEW: '/add_review.php',
    DELETE_REVIEW: '/delete_review.php',
    
    // Test
    TEST_SERVER: '/test_server.php'
  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Convenience functions
export const getApiUrl = (endpointKey) => {
  const endpoint = API_CONFIG.ENDPOINTS[endpointKey];
  if (!endpoint) {
    throw new Error(`Unknown API endpoint: ${endpointKey}`);
  }
  return buildApiUrl(endpoint);
};

export default API_CONFIG;
