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
            
            // Step 2: Get product details and calculate total
            $productData = $this->getProductData($checkoutData['product_id']);
            if (!$productData) {
                return [
                    'success' => false,
                    'error' => 'Product not found'
                ];
            }
            
            $totalAmount = $productData['price'] * $checkoutData['quantity'];
            
            // Step 3: Create payment intent with Stripe
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
            
            // Step 4: Create order in database (pending status)
            $orderData = [
                'customer_id' => $checkoutData['customer_id'],
                'seller_id' => $productData['seller_id'],
                'product_id' => $checkoutData['product_id'],
                'product_name' => $productData['product_name'],
                'quantity' => $checkoutData['quantity'],
                'unit_price' => $productData['price'],
                'total_amount' => $totalAmount,
                'order_status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => 'credit_card',
                'billing_name' => $checkoutData['billing_name'],
                'billing_email' => $checkoutData['billing_email'],
                'billing_address' => $checkoutData['billing_address'],
                'billing_city' => $checkoutData['billing_city'],
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
            
            // Step 5: Return success with payment intent
            return [
                'success' => true,
                'payment_intent' => $paymentIntent['payment_intent'],
                'order' => [
                    'total_amount' => $totalAmount,
                    'product_name' => $productData['product_name'],
                    'quantity' => $checkoutData['quantity']
                ]
            ];
            
        } catch (Exception $e) {
            error_log("Checkout process error: " . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Checkout process failed'
            ];
        }
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
        
        // Required fields validation
        $required = [
            'customer_id', 'product_id', 'quantity',
            'billing_name', 'billing_email', 'billing_address',
            'billing_city', 'billing_postal_code', 'billing_country'
        ];
        
        foreach ($required as $field) {
            if (empty($data[$field])) {
                $errors[] = "Missing required field: {$field}";
            }
        }
        
        // Email validation
        if (!empty($data['billing_email']) && !filter_var($data['billing_email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Invalid email address";
        }
        
        // Quantity validation
        if (!empty($data['quantity']) && ($data['quantity'] < 1 || $data['quantity'] > 100)) {
            $errors[] = "Invalid quantity";
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
