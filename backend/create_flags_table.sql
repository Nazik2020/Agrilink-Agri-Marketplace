-- Create flags table with correct structure
CREATE TABLE IF NOT EXISTS flags (
    flag_id INT AUTO_INCREMENT PRIMARY KEY,
    flagged_by_customer_id INT NOT NULL,
    seller_id INT NOT NULL,
    product_id INT NULL,
    category VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'resolved', 'dismissed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (flagged_by_customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    
    INDEX idx_customer_seller (flagged_by_customer_id, seller_id),
    INDEX idx_product (product_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);