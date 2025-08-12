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
     * Generate a unique order number in the format: ORD-YYYYMMDD-XXXX
     */
    private function generateOrderNumber() {
        $datePart = date('Ymd'); // e.g., 20250801

        // Get the last order number for today
        $sql = "SELECT COUNT(*) FROM {$this->table} WHERE DATE(created_at) = CURDATE()";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $todayCount = $stmt->fetchColumn();

        $nextNumber = str_pad($todayCount + 1, 4, '0', STR_PAD_LEFT);
        return "ORD-$datePart-$nextNumber";
    }

    /**
     * Create new order
     */
    public function create($orderData) {
        try {
            error_log("Order creation attempt - Data: " . json_encode($orderData));

            // Validate required fields
            $required = [
                'customer_id', 'seller_id', 'product_id', 'product_name', 'quantity',
                'unit_price', 'total_amount', 'order_status', 'payment_status',
                'payment_method', 'billing_name', 'billing_email', 'billing_address',
                'billing_postal_code', 'billing_country', 'card_last_four', 'transaction_id'
            ];
            $missing = [];
            foreach ($required as $field) {
                if (!isset($orderData[$field]) || $orderData[$field] === null || $orderData[$field] === '') {
                    $missing[] = $field;
                }
            }
            if (count($missing) > 0) {
                error_log("Order creation failed: Missing required fields: " . implode(", ", $missing));
                return false;
            }

            // Generate unique order number
            $orderNumber = $this->generateOrderNumber();
            error_log("Generated Order Number: " . $orderNumber);

            $sql = "INSERT INTO {$this->table} 
                    (customer_id, seller_id, product_id, product_name, quantity, 
                     unit_price, total_amount, order_status, payment_status, 
                     payment_method, billing_name, billing_email, billing_address, 
                     billing_postal_code, billing_country, 
                     card_last_four, transaction_id, created_at, updated_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

            error_log("SQL Query: " . $sql);

            $stmt = $this->conn->prepare($sql);

            $params = [
                $orderData['customer_id'],
                $orderData['seller_id'],
                $orderData['product_id'],
                $orderData['product_name'],
                $orderData['quantity'],
                $orderData['unit_price'],
                $orderData['total_amount'],
                $orderData['order_status'],
                $orderData['payment_status'],
                $orderData['payment_method'],
                $orderData['billing_name'],
                $orderData['billing_email'],
                $orderData['billing_address'],
                $orderData['billing_postal_code'],
                $orderData['billing_country'],
                $orderData['card_last_four'],
                $orderData['transaction_id']
            ];

            error_log("Parameters: " . json_encode($params));

            $result = $stmt->execute($params);

            if ($result) {
                $orderId = $this->conn->lastInsertId();
                error_log("Order created successfully with ID: " . $orderId);
                return $orderId;
            } else {
                $errorInfo = $stmt->errorInfo();
                error_log("Order creation failed - execute() returned false. SQLSTATE: " . $errorInfo[0] . ", Error: " . $errorInfo[2]);
                return false;
            }

        } catch (PDOException $e) {
            error_log("Order creation PDO error: " . $e->getMessage());
            error_log("Order creation error code: " . $e->getCode());
            return false;
        } catch (Exception $e) {
            error_log("Order creation general error: " . $e->getMessage());
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
