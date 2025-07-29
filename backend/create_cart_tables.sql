-- MIGRATION: Remove unique constraint for (customer_id, product_id) in reviews table to allow multiple reviews per customer per product
-- Run this SQL in your database:
-- ALTER TABLE reviews DROP INDEX unique_customer_product;
-- Create cart table to store customer cart information
CREATE TABLE IF NOT EXISTS cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Ensure one cart per customer
    UNIQUE KEY unique_customer_cart (customer_id),
    
    -- Indexes for better performance
    INDEX idx_customer_id (customer_id),
    INDEX idx_created_at (created_at)
);

-- Create cart_items table to store individual items in cart
CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    -- Ensure one item per product per cart (quantity will be updated)
    UNIQUE KEY unique_cart_product (cart_id, product_id),
    
    -- Indexes for better performance
    INDEX idx_cart_id (cart_id),
    INDEX idx_product_id (product_id),
    INDEX idx_added_at (added_at),
    
    -- Constraints
    CHECK (quantity > 0),
    CHECK (price >= 0)
);

-- Add sample data for testing (optional)
-- Note: Replace customer_id and product_id with actual IDs from your database

-- Sample cart for customer ID 1
INSERT INTO cart (customer_id) VALUES (1) ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Sample cart items (replace with actual product IDs)
-- INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES
-- (1, 1, 2, 25.99),
-- (1, 2, 1, 15.50),
-- (1, 3, 3, 8.75); 