<?php
// Simple order endpoint with comprehensive CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Log incoming request for debugging
    error_log("ORDER REQUEST: " . file_get_contents("php://input"));

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data) {
        error_log("ORDER ERROR: No data received or invalid JSON");
        echo json_encode(["success" => false, "message" => "No data received or invalid JSON"]);
        exit();
    }

    require_once 'db.php';
    require_once __DIR__ . '/models/Order.php';

    if (!$conn) {
        error_log("ORDER ERROR: Database connection failed");
        echo json_encode(["success" => false, "message" => "Database connection failed"]);
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

    if (!$customer_id) {
        error_log("ORDER ERROR: Missing customer ID");
        echo json_encode(["success" => false, "message" => "Missing customer ID"]);
        exit();
    }

    $card_type = 'Visa';
    if (substr($card_number, 0, 1) == '5') $card_type = 'Mastercard';
    if (substr($card_number, 0, 2) == '34' || substr($card_number, 0, 2) == '37') $card_type = 'American Express';
    $card_last_four = substr($card_number, -4);
    $transaction_id = 'pi_' . bin2hex(random_bytes(6));

    $orderModel = new Order($conn);
    $ordersCreated = [];
    $errors = [];

    if (isset($data['cart_items']) && is_array($data['cart_items']) && count($data['cart_items']) > 0) {
        error_log("ORDER INFO: Processing " . count($data['cart_items']) . " cart items");
        foreach ($data['cart_items'] as $item) {
            $orderData = [
                'customer_id' => $customer_id,
                'seller_id' => $item['seller_id'] ?? 16,
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
                'transaction_id' => $transaction_id
            ];
            error_log("ORDER INFO: Attempting to insert order for product " . $orderData['product_id']);
            $orderId = $orderModel->create($orderData);
            if ($orderId) {
                error_log("ORDER SUCCESS: Order $orderId created");
                $ordersCreated[] = $orderId;
            } else {
                error_log("ORDER ERROR: Failed to create order for product " . $orderData['product_id']);
                $errors[] = [
                    'item' => $item,
                    'error' => 'Order creation failed'
                ];
            }
        }
        if (count($ordersCreated) > 0) {
            echo json_encode([
                "success" => true,
                "message" => "Cart order placed successfully",
                "order_ids" => $ordersCreated,
                "card_type" => $card_type,
                "errors" => $errors
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "All orders failed",
                "errors" => $errors
            ]);
        }
    } else {
        error_log("ORDER ERROR: No cart items found in request");
        echo json_encode(["success" => false, "message" => "No cart items found"]);
    }
} catch (Exception $e) {
    error_log("ORDER EXCEPTION: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Server error",
        "error" => $e->getMessage()
    ]);
}
?>
