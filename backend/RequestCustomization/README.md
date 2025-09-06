# Request Customization Feature

## Overview
The Request Customization feature allows customers to submit customization requests for products, which sellers can then review, accept/decline, and create customized products from.

## Database Tables

### 1. `customization_requests`
Stores customer customization requests.

```sql
CREATE TABLE `customization_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `product_id` int NOT NULL,
  `customization_details` text NOT NULL,
  `quantity` int NOT NULL,
  `notes` text,
  `status` enum('pending','accepted','declined') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `seller_id` (`seller_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `customization_requests_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `customization_requests_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`id`),
  CONSTRAINT `customization_requests_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### 2. `customized_products`
Stores customized products created from accepted requests.

```sql
CREATE TABLE `customized_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `original_product_id` int NOT NULL,
  `customization_request_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_description` text NOT NULL,
  `customization_description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT 1,
  `category` varchar(100) NOT NULL,
  `special_offer` varchar(255) DEFAULT NULL,
  `product_images` text,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `original_product_id` (`original_product_id`),
  KEY `customization_request_id` (`customization_request_id`),
  KEY `seller_id` (`seller_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `customized_products_ibfk_1` FOREIGN KEY (`original_product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `customized_products_ibfk_2` FOREIGN KEY (`customization_request_id`) REFERENCES `customization_requests` (`id`),
  CONSTRAINT `customized_products_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`id`),
  CONSTRAINT `customized_products_ibfk_4` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Backend Classes

### 1. CustomizationRequest Class
Handles all customization request operations.

**Location**: `backend/RequestCustomization/CustomizationRequest.php`

**Methods**:
- `createRequest()` - Creates a new customization request
- `getSellerRequests()` - Gets all requests for a seller
- `getCustomerRequests()` - Gets all requests for a customer
- `updateStatus()` - Updates request status (accept/decline)
- `getRequestById()` - Gets a specific request by ID

### 2. CustomizedProduct Class
Handles customized product operations.

**Location**: `backend/RequestCustomization/CustomizedProduct.php`

**Methods**:
- `createFromRequest()` - Creates a customized product from an accepted request
- `getCustomerProducts()` - Gets customized products for a specific customer
- `getSellerProducts()` - Gets customized products for a seller
- `getById()` - Gets a specific customized product by ID
- `update()` - Updates a customized product

## API Endpoints

### 1. Submit Customization Request
**Endpoint**: `POST /backend/RequestCustomization/submit_request.php`

**Request Body**:
```json
{
  "customer_id": 123,
  "seller_id": 456,
  "product_id": 789,
  "customization_details": "I need this product in blue color",
  "quantity": 2,
  "notes": "Additional requirements"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Customization request submitted successfully",
  "request_id": 1
}
```

### 2. Get Seller Requests
**Endpoint**: `GET /backend/RequestCustomization/get_seller_requests.php?sellerId=123`

**Response**:
```json
{
  "success": true,
  "requests": [
    {
      "id": 1,
      "customer_id": 123,
      "seller_id": 456,
      "product_id": 789,
      "customization_details": "I need this product in blue color",
      "quantity": 2,
      "notes": "Additional requirements",
      "status": "pending",
      "created_at": "2025-01-01 10:00:00",
      "product_name": "Product Name",
      "product_description": "Product description",
      "original_price": "29.99",
      "customer_name": "John Doe",
      "customer_email": "john@example.com"
    }
  ]
}
```

### 3. Update Request Status
**Endpoint**: `POST /backend/RequestCustomization/update_request_status.php`

**Request Body**:
```json
{
  "request_id": 1,
  "status": "accepted"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Request status updated successfully"
}
```

### 4. Create Customized Product
**Endpoint**: `POST /backend/RequestCustomization/create_customized_product.php`

**Request Body**:
```json
{
  "request_id": 1,
  "product_name": "Customized Product Name",
  "product_description": "Product description",
  "customization_description": "Customization details",
  "price": "39.99",
  "stock": 2,
  "category": "Products",
  "special_offer": "10% Off"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Customized product created successfully",
  "customized_product_id": 1
}
```

### 6. Get Customized Product by Original Product
**Endpoint**: `GET /backend/RequestCustomization/get_customized_product_by_original.php`

**Parameters**:
- `originalProductId` (required): The ID of the original product
- `customerId` (required): The ID of the customer

**Response** (Success):
```json
{
  "success": true,
  "product": {
    "id": 1,
    "original_product_id": 37,
    "name": "Agri Silica - Customized",
    "category": "Products",
    "price": 85.00,
    "description": "Updated product description...",
    "customization_description": "We have added 20% silica...",
    "special_offer": null,
    "images": ["http://localhost/..."],
    "created_at": "2025-09-04 05:20:00",
    "average_rating": 4.5,
    "stock": 2,
    "is_customized": true,
    "seller": {
      "id": 2,
      "name": "Seller Business Name",
      "description": "Seller description...",
      "contact": "+1234567890",
      "email": "seller@example.com",
      "address": "Seller Address",
      "logo": "http://localhost/..."
    }
  }
}
```

**Response** (Not Found):
```json
{
  "success": false,
  "message": "No customized version found for this customer"
}
```

## Frontend Components

### 1. CustomizationRequestForm
**Location**: `src/components/RequestCustomization/CustomizationRequestForm.jsx`

Customer-facing form to submit customization requests.

**Features**:
- Pre-populated with product information
- Form validation
- Loading states
- Error handling

### 2. CustomizationRequestsSection
**Location**: `src/components/SellerDashboard/MyStore/CustomizationRequestsSection.jsx`

Seller dashboard section to view and manage customization requests.

**Features**:
- List all customization requests
- Accept/decline requests
- View request details
- Create customized products from accepted requests

### 3. CreateCustomizedProductModal
**Location**: `src/components/SellerDashboard/MyStore/CreateCustomizedProductModal.jsx`

Modal for sellers to create customized products.

**Features**:
- Pre-populated with request data
- Form validation
- Category and special offer selection
- Loading states

### 4. CustomizedProductsSection
**Location**: `src/components/RequestCustomization/CustomizedProductsSection.jsx`

Customer-facing component to view their customized products.

**Features**:
- Display customized products with special styling
- Add to cart functionality
- Add to wishlist functionality
- Customization details display
- Stock status indicators

### 5. CustomizedProducts Page
**Location**: `src/pages/CustomizedProducts.jsx`

Dedicated page for customers to view their customized products.

**Features**:
- Authentication check
- Navigation integration
- Responsive design

## User Flow

### Customer Side
1. Customer views a product on the product details page
2. Clicks "Request Customization" button
3. Fills out customization form with:
   - Customization details
   - Quantity
   - Additional notes
4. Submits request
5. Receives confirmation
6. Can view their customized products in the "Customized Products" section
7. Can add customized products to cart and purchase them

### Seller Side
1. Seller views customization requests in their dashboard
2. For each request, seller can:
   - **Accept**: Creates a form to create customized product
   - **Decline**: Marks request as declined
   - **Delete**: Removes the request completely
3. When accepting, seller fills out:
   - Product name
   - Product description
   - Customization description
   - Price
   - Stock
   - Category
   - Special offers
4. Customized product is created and only visible to the requesting customer
5. Seller can delete requests to prevent page overload

## Integration Points

### 1. Product Details Page
- Added "Request Customization" button
- Integrated CustomizationRequestForm modal
- Button is disabled when product is out of stock
- **NEW**: Automatically shows customized version when available for the logged-in customer
- **NEW**: Displays "Customized for You" badge and customization details
- **NEW**: Shows updated price and description for customized products

### 2. Seller Dashboard
- Added "Customization Request Products" tab
- Integrated CustomizationRequestsSection component
- Shows pending, accepted, and declined requests

### 3. Navigation
- Customization requests are accessible from the seller's "My Store" page
- New tab specifically for customization requests

## Security Features

1. **Authentication**: Only logged-in customers can submit requests
2. **Authorization**: Only customers can submit requests, only sellers can view/manage them
3. **Data Validation**: All input is validated on both frontend and backend
4. **SQL Injection Protection**: Uses prepared statements
5. **CSRF Protection**: Form submissions include proper validation

## Error Handling

1. **Frontend Validation**: Real-time form validation with user-friendly error messages
2. **Backend Validation**: Server-side validation for all inputs
3. **Graceful Degradation**: Fallback handling for failed requests
4. **User Feedback**: Clear success/error messages for all operations

## Performance Considerations

1. **Efficient Queries**: Optimized database queries with proper JOINs
2. **Lazy Loading**: Customization requests are loaded only when needed
3. **Pagination**: Large lists are paginated for better performance
4. **Caching**: Product details are cached to reduce database calls

## Future Enhancements

1. **Email Notifications**: Notify customers when requests are accepted/declined
2. **Status Tracking**: Allow customers to track request status
3. **Bulk Operations**: Allow sellers to handle multiple requests at once
4. **Analytics**: Track customization request metrics
5. **Templates**: Pre-defined customization templates for common requests

## Testing

To test the feature:

1. **Create Database Tables**: Run the SQL queries provided above
2. **Test Customer Flow**:
   - Login as a customer
   - Navigate to a product page
   - Click "Request Customization"
   - Fill and submit the form
3. **Test Seller Flow**:
   - Login as a seller
   - Navigate to My Store
   - Click "Customization Request Products" tab
   - Accept/decline requests
   - Create customized products

## Troubleshooting

### Common Issues

1. **"Customization request not found"**: Check if the request ID exists in the database
2. **"Failed to create customized product"**: Verify all required fields are provided
3. **"Error fetching customization requests"**: Check database connection and seller ID

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify API endpoints are accessible
3. Check database connection and table structure
4. Verify user authentication and permissions

## Support

For technical support or questions about this feature, please refer to the development team or create an issue in the project repository.
