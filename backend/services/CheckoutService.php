<?php
/**
 * Checkout Service - Orchestrates the complete checkout process
 * Handles business logic for orders and payments
 */

require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/StripePaymentService.php';

class CheckoutService {
    private $orderModel;
    private $paymentService;
    private $conn;
    
    /**
     * Constructor - Dependency Injection
     */
    public function __construct($database) {
        $this->conn = $database;
        $this->orderModel = new Order($database);
        $this->paymentService = new StripePaymentService();
    }
    
    /**
     * Process complete checkout flow
     */
    public function processCheckout($checkoutData) {
        try {
            // Step 1: Validate checkout data
            $validation = $this->validateCheckoutData($checkoutData);
            if (!$validation['valid']) {
                return [
                    'success' => false,
                    'error' => 'Validation failed',
                    'details' => $validation['errors']
                ];
            }
            
            // Check if this is a cart checkout or single product checkout
            $isCartCheckout = isset($checkoutData['cart_items']) && is_array($checkoutData['cart_items']) && !empty($checkoutData['cart_items']);
            
            if ($isCartCheckout) {
                return $this->processCartCheckout($checkoutData);
            } else {
                return $this->processSingleProductCheckout($checkoutData);
            }
            
        } catch (Exception $e) {
            error_log("CheckoutService error: " . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Checkout processing failed'
            ];
        }
    }

    /**
     * Process single product checkout
     */
    private function processSingleProductCheckout($checkoutData) {
        // Step 1: Get product details and calculate total
        $productData = $this->getProductData($checkoutData['product_id']);
        if (!$productData) {
            return [
                'success' => false,
                'error' => 'Product not found'
            ];
        }
        
        $totalAmount = $productData['price'] * $checkoutData['quantity'];
        
        // Step 2: Create payment intent with Stripe
        $paymentIntent = $this->paymentService->createPaymentIntent(
            $totalAmount,
            'usd',
            [
                'product_id' => $checkoutData['product_id'],
                'customer_id' => $checkoutData['customer_id'],
                'quantity' => $checkoutData['quantity']
            ]
        );
        
        if (!$paymentIntent['success']) {
            return [
                'success' => false,
                'error' => 'Payment initialization failed'
            ];
        }
        
        // Step 3: Create order in database (pending status)
        // Handle NULL seller_id - use default seller ID 1 if NULL
        $sellerId = $productData['seller_id'] ?? 1;
        
        $orderData = [
            'customer_id' => $checkoutData['customer_id'],
            'seller_id' => $sellerId,
            'product_id' => $checkoutData['product_id'],
            'product_name' => $productData['product_name'], // Use 'product_name' from your table
            'quantity' => $checkoutData['quantity'],
            'unit_price' => $productData['price'],
            'total_amount' => $totalAmount,
            'order_status' => 'pending',
            'payment_status' => 'pending',
            'payment_method' => 'credit_card',
            'billing_name' => $checkoutData['billing_name'],
            'billing_email' => $checkoutData['billing_email'],
            'billing_address' => $checkoutData['billing_address'],
            'billing_postal_code' => $checkoutData['billing_postal_code'],
            'billing_country' => $checkoutData['billing_country'],
            'transaction_id' => $paymentIntent['payment_intent']['id']
        ];
        
        $orderCreated = $this->orderModel->create($orderData);
        
        if (!$orderCreated) {
            return [
                'success' => false,
                'error' => 'Order creation failed'
            ];
        }
        
        // Step 4: Return success with payment intent
        return [
            'success' => true,
            'payment_intent' => $paymentIntent['payment_intent'],
            'order_id' => $orderCreated,
            'total_amount' => $totalAmount
        ];
    }

    /**
     * Process cart checkout
     */
    private function processCartCheckout($checkoutData) {
        $cartItems = $checkoutData['cart_items'];
        $totalAmount = $checkoutData['total_amount'] ?? 0;
        
        // Step 1: Validate all products exist
        foreach ($cartItems as $item) {
            $productData = $this->getProductData($item['product_id']);
            if (!$productData) {
                return [
                    'success' => false,
                    'error' => "Product not found: {$item['product_id']}"
                ];
            }
        }
        
        // Step 2: Create payment intent with Stripe
        $paymentIntent = $this->paymentService->createPaymentIntent(
            $totalAmount,
            'usd',
            [
                'customer_id' => $checkoutData['customer_id'],
                'cart_items' => $cartItems,
                'total_amount' => $totalAmount
            ]
        );
        
        if (!$paymentIntent['success']) {
            return [
                'success' => false,
                'error' => 'Payment initialization failed'
            ];
        }
        
        // Step 3: Create orders for each cart item
        $orderIds = [];
        foreach ($cartItems as $item) {
            error_log("Processing cart item: " . json_encode($item));
            
            $productData = $this->getProductData($item['product_id']);
            error_log("Product data for ID {$item['product_id']}: " . json_encode($productData));
            
            if (!$productData) {
                error_log("Product not found for ID: " . $item['product_id']);
                return [
                    'success' => false,
                    'error' => "Product not found: {$item['product_id']}"
                ];
            }
            
            $itemTotal = $productData['price'] * $item['quantity'];
            error_log("Item total calculated: " . $itemTotal);
            
            // Handle NULL seller_id - use default seller ID 1 if NULL
            $sellerId = $productData['seller_id'] ?? 1;
            
            $orderData = [
                'customer_id' => $checkoutData['customer_id'],
                'seller_id' => $sellerId,
                'product_id' => $item['product_id'],
                'product_name' => $productData['product_name'], // Use 'product_name' from your table
                'quantity' => $item['quantity'],
                'unit_price' => $productData['price'],
                'total_amount' => $itemTotal,
                'order_status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => 'credit_card',
                'billing_name' => $checkoutData['billing_name'],
                'billing_email' => $checkoutData['billing_email'],
                'billing_address' => $checkoutData['billing_address'],
                'billing_postal_code' => $checkoutData['billing_postal_code'],
                'billing_country' => $checkoutData['billing_country'],
                'transaction_id' => $paymentIntent['payment_intent']['id']
            ];
            
            error_log("Order data prepared: " . json_encode($orderData));

            $orderCreated = $this->orderModel->create($orderData);
            error_log("Order creation result for item {$item['product_id']}: " . ($orderCreated ? $orderCreated : 'false'));
            // If order creation fails, log the error and continue processing other items
            if ($orderCreated) {
                $orderIds[] = $orderCreated;
            } else {
                error_log("Failed to create order for item: " . $item['product_id']);
            }
        }
        
        if (empty($orderIds)) {
            error_log("No orders were created successfully");
            return [
                'success' => false,
                'error' => 'Order creation failed'
            ];
        }
        
        // Step 4: Return success with payment intent
        return [
            'success' => true,
            'payment_intent' => $paymentIntent['payment_intent'],
            'order_ids' => $orderIds,
            'total_amount' => $totalAmount
        ];
    }
    
    /**
     * Confirm payment and update order
     */
    public function confirmPayment($paymentIntentId, $orderId) {
        try {
            // Confirm payment with Stripe
            $paymentResult = $this->paymentService->confirmPayment($paymentIntentId);
            
            if ($paymentResult['success']) {
                // Update order status
                $this->orderModel->updateStatus($orderId, 'processing', 'completed');
                
                return [
                    'success' => true,
                    'message' => 'Payment confirmed successfully',
                    'payment' => $paymentResult['payment']
                ];
            } else {
                // Update order with failed status
                $this->orderModel->updateStatus($orderId, 'cancelled', 'failed');
                
                return [
                    'success' => false,
                    'error' => 'Payment confirmation failed'
                ];
            }
            
        } catch (Exception $e) {
            error_log("Payment confirmation error: " . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Payment confirmation process failed'
            ];
        }
    }
    
    /**
     * Validate checkout data
     */
    private function validateCheckoutData($data) {
        $errors = [];
        
        // Check if this is a cart checkout or single product checkout
        $isCartCheckout = isset($data['cart_items']) && is_array($data['cart_items']) && !empty($data['cart_items']);
        
        if ($isCartCheckout) {
            // Cart checkout validation
            $required = [
                'customer_id', 'billing_name', 'billing_email', 'billing_address', 
                'billing_postal_code', 'billing_country', 'cart_items', 'total_amount'
            ];
            
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    $errors[] = "Missing required field: {$field}";
                }
            }
            
            // Validate cart items structure
            if (isset($data['cart_items']) && is_array($data['cart_items'])) {
                foreach ($data['cart_items'] as $index => $item) {
                    if (empty($item['product_id'])) {
                        $errors[] = "Cart item {$index}: Missing product_id";
                    }
                    if (empty($item['quantity']) || $item['quantity'] <= 0) {
                        $errors[] = "Cart item {$index}: Invalid quantity";
                    }
                    if (!isset($item['price']) || $item['price'] <= 0) {
                        $errors[] = "Cart item {$index}: Invalid price";
                    }
                }
            }
        } else {
            // Single product checkout validation
            $required = [
                'product_id', 'quantity', 'customer_id', 'billing_name', 'billing_email', 
                'billing_address', 'billing_postal_code', 'billing_country'
            ];
            
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    $errors[] = "Missing required field: {$field}";
                }
            }
            
            // Validate quantity
            if (isset($data['quantity']) && ($data['quantity'] <= 0 || !is_numeric($data['quantity']))) {
                $errors[] = "Invalid quantity";
            }
        }
        
        // Common validation for both types
        if (isset($data['billing_email']) && !filter_var($data['billing_email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Invalid email format";
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
    
    /**
     * Get product data from database
     */
    private function getProductData($productId) {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM products WHERE id = ?");
            $stmt->execute([$productId]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Product fetch error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get publishable key for frontend
     */
    public function getPublishableKey() {
        return $this->paymentService->getPublishableKey();
    }
}
?>
