-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    status ENUM('active', 'inactive') DEFAULT 'active',
    token VARCHAR(255) NULL,
    token_expires DATETIME NULL,
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_token (token)
);

-- Admin Messages Table (for sending messages to users)
CREATE TABLE IF NOT EXISTS admin_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_type ENUM('customer', 'seller') NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_id, user_type),
    INDEX idx_sent_at (sent_at),
    INDEX idx_is_read (is_read)
);

-- Admin Activity Log Table (for audit trail)
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NULL,
    action VARCHAR(100) NOT NULL,
    data JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_admin_id (admin_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- Add status and banned fields to existing tables if they don't exist
-- For customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS status ENUM('active', 'banned', 'pending') DEFAULT 'active',
ADD COLUMN IF NOT EXISTS banned_reason TEXT NULL,
ADD COLUMN IF NOT EXISTS banned_at DATETIME NULL,
ADD COLUMN IF NOT EXISTS user_type VARCHAR(20) DEFAULT 'customer';

-- For sellers table  
ALTER TABLE sellers 
ADD COLUMN IF NOT EXISTS status ENUM('active', 'banned', 'pending') DEFAULT 'active',
ADD COLUMN IF NOT EXISTS banned_reason TEXT NULL,
ADD COLUMN IF NOT EXISTS banned_at DATETIME NULL,
ADD COLUMN IF NOT EXISTS user_type VARCHAR(20) DEFAULT 'seller';

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, email, password, full_name, role) 
VALUES ('admin', 'admin@agrilink.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'super_admin')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
CREATE INDEX IF NOT EXISTS idx_sellers_status ON sellers(status);
CREATE INDEX IF NOT EXISTS idx_sellers_created_at ON sellers(created_at); 