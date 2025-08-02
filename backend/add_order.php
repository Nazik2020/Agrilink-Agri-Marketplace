<?php
// Add order with card type detection
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'db.php';
require_once __DIR__ . '/models/Order.php';

// Log incoming request for debugging
error_log("Order request received: " . file_get_contents("php://input"));

$data = json_decode(file_get_contents("php://input"), true);

// Check if JSON was parsed correctly
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "message" => "Invalid JSON data", "error" => json_last_error_msg()]);
    exit();
}


$customer_id = $data['customer_id'] ?? null;
$card_number = $data['card_number'] ?? '';
$order_total = $data['order_total'] ?? 0;
$billing_name = $data['billing_name'] ?? '';
$billing_email = $data['billing_email'] ?? '';
$billing_address = $data['billing_address'] ?? '';
$billing_postal_code = $data['billing_postal_code'] ?? '';
$billing_country = $data['billing_country'] ?? '';

// Detect card type
function getCardType($number) {
    $number = preg_replace('/\s+/', '', $number);
    if (preg_match('/^4[0-9]{12}(?:[0-9]{3})?$/', $number)) return 'Visa';
    if (preg_match('/^5[1-5][0-9]{14}$/', $number)) return 'Mastercard';
    if (preg_match('/^3[47][0-9]{13}$/', $number)) return 'American Express';
    return 'Unknown';
}


$card_type = getCardType($card_number);
$card_last_four = substr($card_number, -4);




$orderModel = new Order($conn);
$ordersCreated = [];
$errors = [];

if (isset($data['cart_items']) && is_array($data['cart_items'])) {
    // Cart checkout: multiple items
    foreach ($data['cart_items'] as $item) {
        $orderData = [
            'customer_id' => $customer_id,
            'seller_id' => $item['seller_id'] ?? null,
            'product_id' => $item['product_id'] ?? null,
            'product_name' => $item['product_name'] ?? '',
            'quantity' => $item['quantity'] ?? 1,
            'unit_price' => $item['price'] ?? 0,
            'total_amount' => ($item['price'] ?? 0) * ($item['quantity'] ?? 1),
            'order_status' => 'pending',
            'payment_status' => 'completed',
            'payment_method' => $card_type,
            'billing_name' => $billing_name,
            'billing_email' => $billing_email,
            'billing_address' => $billing_address,
            'billing_postal_code' => $billing_postal_code,
            'billing_country' => $billing_country,
            'card_last_four' => $card_last_four,
            'transaction_id' => null
        ];
        $orderId = $orderModel->create($orderData);
        if ($orderId) {
            $ordersCreated[] = $orderId;
        } else {
            $errors[] = [
                'item' => $item,
                'error' => 'Order not inserted - check Order model',
                'orderData' => $orderData
            ];
        }
    }
    if (count($ordersCreated) > 0) {
        echo json_encode(["success" => true, "message" => "Cart order placed", "order_ids" => $ordersCreated, "card_type" => $card_type, "errors" => $errors]);
    } else {
        echo json_encode(["success" => false, "message" => "Cart order failed", "errors" => $errors]);
    }
} else {
    // Single product checkout
    $orderData = [
        'customer_id' => $customer_id,
        'seller_id' => $data['seller_id'] ?? null,
        'product_id' => $data['product_id'] ?? null,
        'product_name' => $data['product_name'] ?? '',
        'quantity' => $data['quantity'] ?? 1,
        'unit_price' => $data['price'] ?? 0,
        'total_amount' => $order_total,
        'order_status' => 'pending',
        'payment_status' => 'completed',
        'payment_method' => $card_type,
        'billing_name' => $billing_name,
        'billing_email' => $billing_email,
        'billing_address' => $billing_address,
        'billing_postal_code' => $billing_postal_code,
        'billing_country' => $billing_country,
        'card_last_four' => $card_last_four,
        'transaction_id' => null
    ];
    $orderId = $orderModel->create($orderData);
    if ($orderId) {
        echo json_encode(["success" => true, "message" => "Order placed", "order_id" => $orderId, "card_type" => $card_type]);
    } else {
        echo json_encode(["success" => false, "message" => "Order failed", "orderData" => $orderData]);
    }
}
?>
