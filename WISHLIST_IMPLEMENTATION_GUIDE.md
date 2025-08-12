# Wishlist Implementation Guide

## Overview
This implementation provides a complete wishlist system that allows both guest users and logged-in customers to add products to their wishlist. Guest wishlist items are automatically synced to the customer's account upon login.

## Database Tables

### 1. Wishlist Table
```sql
CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_customer_product` (`customer_id`, `product_id`),
  KEY `customer_id` (`customer_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Backend Implementation

### OOP Classes

#### 1. Wishlist Class (`backend/Wishlist.php`)
- **Purpose**: Handles all wishlist operations following OOP principles
- **Key Methods**:
  - `addToWishlist($customerId, $productId)` - Add product to wishlist
  - `removeFromWishlist($customerId, $productId)` - Remove product from wishlist
  - `getCustomerWishlist($customerId)` - Get customer's wishlist with product details
  - `syncGuestWishlist($customerId, $productIds)` - Sync guest items to customer account
  - `isInWishlist($customerId, $productId)` - Check if product is in wishlist

#### 2. API Endpoints
- `add_to_wishlist.php` - Add products to wishlist
- `get_wishlist.php` - Get customer's wishlist
- `remove_from_wishlist.php` - Remove products from wishlist
- `sync_guest_wishlist.php` - Sync guest wishlist after login

## Frontend Implementation

### 1. WishlistContext (`src/components/wishlist/WishlistContext.jsx`)
- **Purpose**: Global state management for wishlist functionality
- **Features**:
  - Manages wishlist state across the application
  - Handles both guest and logged-in user scenarios
  - Automatic localStorage management for guest users
  - Real-time wishlist count updates

### 2. WishlistButton Component (`src/components/wishlist/WishlistButton.jsx`)
- **Purpose**: Reusable button component for adding/removing wishlist items
- **Features**:
  - Visual feedback (filled/unfilled heart)
  - Loading states
  - Automatic state updates
  - Tooltip information

### 3. Integration with Login (`src/components/Login/RightSection.jsx`)
- **Purpose**: Syncs guest wishlist items after successful login
- **Process**:
  1. User logs in successfully
  2. System checks for guest wishlist in localStorage
  3. If items exist, sends them to backend for syncing
  4. Clears guest wishlist from localStorage
  5. Updates customer's wishlist in database

## How It Works

### Guest User Flow
1. **Browse Products**: Guest user visits the marketplace
2. **Add to Wishlist**: Clicks wishlist button on product cards
3. **Local Storage**: Items are stored in `localStorage` under `guestWishlist` key
4. **Visual Feedback**: Wishlist button shows filled heart
5. **Persistent**: Items persist across browser sessions

### Login Flow
1. **User Login**: Customer logs in with credentials
2. **Check Guest Wishlist**: System checks for guest wishlist items
3. **Sync to Database**: Guest items are synced to customer's account
4. **Clear Local Storage**: Guest wishlist is cleared from localStorage
5. **Update UI**: Wishlist count and items are updated

### Logged-in Customer Flow
1. **Browse Products**: Customer visits the marketplace
2. **Add to Wishlist**: Clicks wishlist button on product cards
3. **Database Storage**: Items are stored directly in database
4. **Real-time Updates**: Wishlist count and items update immediately
5. **Persistent**: Items are permanently stored in database

## Usage Examples

### 1. Adding WishlistButton to Product Cards
```jsx
import WishlistButton from './components/wishlist/WishlistButton';

const ProductCard = ({ product }) => (
  <div className="product-card">
    <img src={product.image} alt={product.name} />
    <div className="absolute top-2 right-2">
      <WishlistButton productId={product.id} />
    </div>
    <h3>{product.name}</h3>
    <p>${product.price}</p>
  </div>
);
```

### 2. Using WishlistContext in Components
```jsx
import { useWishlist } from './components/wishlist/WishlistContext';

const MyComponent = () => {
  const { wishlist, wishlistCount, addToWishlist } = useWishlist();
  
  return (
    <div>
      <p>Wishlist Items: {wishlistCount}</p>
      {wishlist.map(item => (
        <div key={item.id}>{item.product_name}</div>
      ))}
    </div>
  );
};
```

## Security Features

### 1. Duplicate Prevention
- **Database Level**: Unique constraint on `(customer_id, product_id)`
- **Application Level**: Checks for existing items before adding

### 2. Product Validation
- **Existence Check**: Verifies product exists before adding to wishlist
- **Data Integrity**: Foreign key constraints ensure data consistency

### 3. User Authentication
- **Customer ID Validation**: Ensures only valid customers can add items
- **Session Management**: Proper user session handling

## Performance Optimizations

### 1. Database Indexes
- Index on `customer_id` for fast wishlist retrieval
- Index on `product_id` for product lookups
- Composite index on `(customer_id, product_id)` for uniqueness checks

### 2. Caching Strategy
- **Local Storage**: Guest wishlist items cached locally
- **Context State**: Logged-in user wishlist cached in React context
- **Minimal API Calls**: Only sync when necessary

### 3. Efficient Queries
- **JOIN Operations**: Single query to get wishlist with product details
- **Prepared Statements**: SQL injection prevention and query optimization

## Error Handling

### 1. Backend Errors
- **Database Errors**: Proper PDO exception handling
- **Validation Errors**: Input validation and error messages
- **Logging**: Error logging for debugging

### 2. Frontend Errors
- **Network Errors**: Graceful handling of API failures
- **Local Storage Errors**: Fallback mechanisms
- **User Feedback**: Clear error messages to users

## Testing

### 1. Backend Testing
- Test wishlist operations with valid/invalid data
- Test guest wishlist syncing
- Test duplicate prevention
- Test error scenarios

### 2. Frontend Testing
- Test guest user wishlist functionality
- Test logged-in user wishlist functionality
- Test login sync process
- Test UI state updates

## Maintenance

### 1. Database Maintenance
- Regular cleanup of orphaned wishlist entries
- Monitor wishlist table size
- Optimize queries as needed

### 2. Code Maintenance
- Keep dependencies updated
- Monitor for security vulnerabilities
- Regular code reviews and refactoring

## Future Enhancements

### 1. Advanced Features
- Wishlist sharing
- Wishlist categories
- Wishlist analytics
- Email notifications for wishlist items

### 2. Performance Improvements
- Server-side caching (Redis)
- Pagination for large wishlists
- Lazy loading of wishlist items

### 3. User Experience
- Drag-and-drop wishlist reordering
- Bulk operations (add/remove multiple items)
- Wishlist import/export functionality 