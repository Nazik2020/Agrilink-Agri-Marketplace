
<?php
error_log("DEBUG_MARKER: add_order_simple.php executed at " . date('c'));
require_once __DIR__ . '/cors.php';

try {
    // Log incoming request for debugging
    error_log("ORDER REQUEST: " . file_get_contents("php://input"));

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data) {
        error_log("ORDER ERROR: No data received or invalid JSON");
        echo json_encode(["success" => false, "message" => "No data received or invalid JSON", "test_marker" => "debug_patch_active"]);
        exit();
    }


    require_once 'db.php';
    require_once __DIR__ . '/models/Order.php';
    require_once 'ProductStockManager.php';

    // Use PDO connection everywhere
    $pdo = getDbConnection();
    if (!$pdo) {
        error_log("ORDER ERROR: Database connection failed");
        echo json_encode(["success" => false, "message" => "Database connection failed", "test_marker" => "debug_patch_active"]);
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
        echo json_encode(["success" => false, "message" => "Missing customer ID", "test_marker" => "debug_patch_active"]);
        exit();
    }

    $card_type = 'Visa';
    if (substr($card_number, 0, 1) == '5') $card_type = 'Mastercard';
    if (substr($card_number, 0, 2) == '34' || substr($card_number, 0, 2) == '37') $card_type = 'American Express';
    $card_last_four = substr($card_number, -4);
    $transaction_id = 'pi_' . bin2hex(random_bytes(6));

    $orderModel = new Order($pdo);
    $stockManager = new ProductStockManager($pdo);
    $ordersCreated = [];
    $errors = [];
    $debugStockResults = [];

    if (isset($data['cart_items']) && is_array($data['cart_items']) && count($data['cart_items']) > 0) {
        error_log("ORDER INFO: Processing " . count($data['cart_items']) . " cart items");
        foreach ($data['cart_items'] as $item) {
            $product_id = $item['product_id'] ?? null;
            $quantity = $item['quantity'] ?? 1;
            if (!$product_id) {
                $errors[] = [
                    'item' => $item,
                    'error' => 'Missing product_id'
                ];
                continue;
            }
            $currentStock = $stockManager->getStock($product_id);
            if ($currentStock === null) {
                $errors[] = [
                    'item' => $item,
                    'error' => 'Product not found'
                ];
                continue;
            }
            if ($currentStock < $quantity) {
                $errors[] = [
                    'item' => $item,
                    'error' => 'Not enough stock',
                    'available_stock' => $currentStock
                ];
                continue;
            }
            $orderData = [
                'customer_id' => $customer_id,
                'seller_id' => $item['seller_id'] ?? 16,
                'product_id' => $product_id,
                'product_name' => $item['product_name'] ?? '',
                'quantity' => $quantity,
                'unit_price' => $item['price'] ?? 0,
                'total_amount' => ($item['price'] ?? 0) * $quantity,
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
                // Decrease stock after successful order creation
                $decreaseResult = $stockManager->decreaseStock($product_id, $quantity);
                $debugStockResults[] = [
                    'item' => $item,
                    'order_id' => $orderId,
                    'debug' => $decreaseResult
                ];
                if ($decreaseResult['success']) {
                    error_log("ORDER SUCCESS: Order $orderId created and stock updated");
                    $ordersCreated[] = $orderId;
                } else {
                    // Rollback order if stock update fails (optional: delete order)
                    error_log("ORDER ERROR: Order $orderId created but failed to update stock");
                    $errors[] = [
                        'item' => $item,
                        'error' => 'Order created but failed to update stock',
                        'debug' => $decreaseResult
                    ];
                }
            } else {
                error_log("ORDER ERROR: Failed to create order for product " . $orderData['product_id']);
                $errors[] = [
                    'item' => $item,
                    'error' => 'Order creation failed'
                ];
            }
        }
        // Always include debug in response
        $response = [
            "success" => count($ordersCreated) > 0,
            "message" => count($ordersCreated) > 0 ? "Cart order placed successfully" : "All orders failed",
            "order_ids" => $ordersCreated,
            "card_type" => $card_type,
            "errors" => $errors,
            "debug" => $debugStockResults,
            "test_marker" => "debug-always-included"
        ];
        echo json_encode($response);
    } else if (isset($data['product_id']) && isset($data['quantity'])) {
        // Single product order support
        $product_id = $data['product_id'];
        $quantity = $data['quantity'];
        $currentStock = $stockManager->getStock($product_id);
        if ($currentStock === null) {
            error_log("ORDER ERROR: Product not found for single product order");
            echo json_encode(["success" => false, "message" => "Product not found", "test_marker" => "debug_patch_active"]);
            exit();
        }
        if ($currentStock < $quantity) {
            error_log("ORDER ERROR: Not enough stock for single product order");
            echo json_encode(["success" => false, "message" => "Not enough stock", "available_stock" => $currentStock, "test_marker" => "debug_patch_active"]);
            exit();
        }
        $orderData = [
            'customer_id' => $customer_id,
            'seller_id' => $data['seller_id'] ?? 16,
            'product_id' => $product_id,
            'product_name' => $data['product_name'] ?? '',
            'quantity' => $quantity,
            'unit_price' => $data['price'] ?? 0,
            'total_amount' => ($data['price'] ?? 0) * $quantity,
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
        error_log("ORDER INFO: Attempting to insert single product order for product " . $orderData['product_id']);
        $orderId = $orderModel->create($orderData);
        if ($orderId) {
            $decreaseResult = $stockManager->decreaseStock($product_id, $quantity);
            $debugStockResults = [
                [
                    'product_id' => $product_id,
                    'order_id' => $orderId,
                    'debug' => $decreaseResult
                ]
            ];
            if ($decreaseResult['success']) {
                error_log("ORDER SUCCESS: Single product order $orderId created and stock updated");
                echo json_encode([
                    "success" => true,
                    "message" => "Order placed successfully",
                    "order_id" => $orderId,
                    "card_type" => $card_type,
                    "debug" => $debugStockResults,
                    "test_marker" => "debug_patch_active"
                ]);
            } else {
                error_log("ORDER ERROR: Single product order $orderId created but failed to update stock");
                echo json_encode([
                    "success" => false,
                    "message" => "Order created but failed to update stock",
                    "debug" => $debugStockResults,
                    "test_marker" => "debug_patch_active"
                ]);
            }
        } else {
            error_log("ORDER ERROR: Failed to create single product order for product " . $orderData['product_id']);
            echo json_encode([
                "success" => false,
                "message" => "Order creation failed",
                "test_marker" => "debug_patch_active"
            ]);
        }
    } else {
        error_log("ORDER ERROR: No cart items or single product info found in request");
        echo json_encode(["success" => false, "message" => "No cart items or single product info found", "test_marker" => "debug_patch_active"]);
    }
} catch (Exception $e) {
    error_log("ORDER EXCEPTION: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Server error",
        "error" => $e->getMessage(),
        "test_marker" => "debug_patch_active"
    ]);
}
?>
