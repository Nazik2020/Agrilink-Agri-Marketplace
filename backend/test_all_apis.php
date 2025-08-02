<?php
// Test all APIs
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

$tests = [];

// Test 1: Order History
try {
    $url = "http://localhost:8080/backend/order_history/get_orders_real.php";
    $data = json_encode(["customer_id" => 4]);
    
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $data
        ]
    ]);
    
    $result = file_get_contents($url, false, $context);
    $tests['order_history'] = [
        'success' => $result !== false,
        'response' => $result ? json_decode($result, true) : 'Failed'
    ];
} catch (Exception $e) {
    $tests['order_history'] = ['success' => false, 'error' => $e->getMessage()];
}

// Test 2: Add to Cart
try {
    $url = "http://localhost:8080/backend/add_to_cart_real.php";
    $data = json_encode(["productId" => 106, "customerId" => 4, "quantity" => 1]);
    
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $data
        ]
    ]);
    
    $result = file_get_contents($url, false, $context);
    $tests['add_to_cart'] = [
        'success' => $result !== false,
        'response' => $result ? json_decode($result, true) : 'Failed'
    ];
} catch (Exception $e) {
    $tests['add_to_cart'] = ['success' => false, 'error' => $e->getMessage()];
}

// Test 3: Get Cart
try {
    $url = "http://localhost:8080/backend/get_cart_real.php";
    $data = json_encode(["customerId" => 4]);
    
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $data
        ]
    ]);
    
    $result = file_get_contents($url, false, $context);
    $tests['get_cart'] = [
        'success' => $result !== false,
        'response' => $result ? json_decode($result, true) : 'Failed'
    ];
} catch (Exception $e) {
    $tests['get_cart'] = ['success' => false, 'error' => $e->getMessage()];
}

echo json_encode([
    'success' => true,
    'message' => 'API Test Results',
    'tests' => $tests,
    'timestamp' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT);
?>
