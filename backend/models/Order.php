<?php
/**
 * Order Model - Handles all order database operations
 * Following OOP principles for clean, maintainable code
 */

class Order {
    private $conn;
    private $table = 'orders';
    
    // Order properties
    public $id;
    public $customer_id;
    public $seller_id;
    public $product_id;
    public $product_name;
    public $quantity;
    public $unit_price;
    public $total_amount;
    public $order_status;
    public $payment_status;
    public $payment_method;
    public $billing_name;
    public $billing_email;
    public $billing_address;
    public $billing_city;
    public $billing_postal_code;
    public $billing_country;
    public $card_last_four;
    public $transaction_id;
    public $created_at;
    
    /**
     * Constructor - Dependency Injection
     */
    public function __construct($database) {
        $this->conn = $database;
    }
    
    /**
     * Create new order
     */
    public function create($orderData) {
        try {
            $sql = "INSERT INTO {$this->table} 
                    (customer_id, seller_id, product_id, product_name, quantity, 
                     unit_price, total_amount, order_status, payment_status, 
                     payment_method, billing_name, billing_email, billing_address, 
                     billing_city, billing_postal_code, billing_country, 
                     card_last_four, transaction_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->conn->prepare($sql);
            
            $result = $stmt->execute([
                $orderData['customer_id'],
                $orderData['seller_id'],
                $orderData['product_id'],
                $orderData['product_name'],
                $orderData['quantity'],
                $orderData['unit_price'],
                $orderData['total_amount'],
                $orderData['order_status'] ?? 'pending',
                $orderData['payment_status'] ?? 'pending',
                $orderData['payment_method'] ?? 'credit_card',
                $orderData['billing_name'],
                $orderData['billing_email'],
                $orderData['billing_address'],
                $orderData['billing_city'],
                $orderData['billing_postal_code'],
                $orderData['billing_country'],
                $orderData['card_last_four'] ?? null,
                $orderData['transaction_id'] ?? null
            ]);
            
            if ($result) {
                return $this->conn->lastInsertId();
            }
            
            return false;
            
        } catch (PDOException $e) {
            error_log("Order creation error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Find order by ID
     */
    public function findById($orderId) {
        try {
            $sql = "SELECT o.*, p.product_name as product_title, s.business_name as seller_name 
                    FROM {$this->table} o
                    LEFT JOIN products p ON o.product_id = p.id
                    LEFT JOIN sellers s ON o.seller_id = s.id
                    WHERE o.id = ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$orderId]);
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            error_log("Order fetch error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Update order status
     */
    public function updateStatus($orderId, $orderStatus, $paymentStatus = null) {
        try {
            $sql = "UPDATE {$this->table} SET order_status = ?";
            $params = [$orderStatus];
            
            if ($paymentStatus !== null) {
                $sql .= ", payment_status = ?";
                $params[] = $paymentStatus;
            }
            
            $sql .= " WHERE id = ?";
            $params[] = $orderId;
            
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute($params);
            
        } catch (PDOException $e) {
            error_log("Order status update error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get orders by customer
     */
    public function getByCustomer($customerId, $limit = 10) {
        try {
            $sql = "SELECT o.*, p.product_name as product_title 
                    FROM {$this->table} o
                    LEFT JOIN products p ON o.product_id = p.id
                    WHERE o.customer_id = ?
                    ORDER BY o.created_at DESC
                    LIMIT ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$customerId, $limit]);
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            error_log("Customer orders fetch error: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Get orders by seller
     */
    public function getBySeller($sellerId, $limit = 10) {
        try {
            $sql = "SELECT o.*, c.full_name as customer_name 
                    FROM {$this->table} o
                    LEFT JOIN customers c ON o.customer_id = c.id
                    WHERE o.seller_id = ?
                    ORDER BY o.created_at DESC
                    LIMIT ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$sellerId, $limit]);
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            error_log("Seller orders fetch error: " . $e->getMessage());
            return [];
        }
    }
}
?>
