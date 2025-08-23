<?php
// Final test of all APIs
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$tests = [];

// Test Order History
try {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://localhost/Agrilink-Agri-Marketplace/backend/order_history/orders.php");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, '{"customer_id":4}');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $tests['order_history'] = [
        'status' => $httpCode,
        'working' => $httpCode == 200,
        'has_data' => $result && strpos($result, '"success":true') !== false
    ];
} catch (Exception $e) {
    $tests['order_history'] = ['status' => 'error', 'working' => false];
}

// Test Get Cart
try {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://localhost/Agrilink-Agri-Marketplace/backend/get_cart.php");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, '{"customer_id":4}');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $tests['get_cart'] = [
        'status' => $httpCode,
        'working' => $httpCode == 200,
        'has_data' => $result && strpos($result, '"success":true') !== false
    ];
} catch (Exception $e) {
    $tests['get_cart'] = ['status' => 'error', 'working' => false];
}

// Test Add to Cart
try {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://localhost/Agrilink-Agri-Marketplace/backend/add_to_cart.php");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, '{"customer_id":4,"product_id":44,"quantity":1}');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $tests['add_to_cart'] = [
        'status' => $httpCode,
        'working' => $httpCode == 200,
        'has_data' => $result && strpos($result, '"success":true') !== false
    ];
} catch (Exception $e) {
    $tests['add_to_cart'] = ['status' => 'error', 'working' => false];
}

// Test Get Wishlist
try {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://localhost/Agrilink-Agri-Marketplace/backend/get_wishlist.php");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, '{"customerId":4}');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $tests['get_wishlist'] = [
        'status' => $httpCode,
        'working' => $httpCode == 200,
        'has_data' => $result && strpos($result, '"success":true') !== false
    ];
} catch (Exception $e) {
    $tests['get_wishlist'] = ['status' => 'error', 'working' => false];
}

echo json_encode([
    'success' => true,
    'message' => 'API Status Check Complete',
    'timestamp' => date('Y-m-d H:i:s'),
    'all_tests' => $tests,
    'summary' => [
        'working_apis' => count(array_filter($tests, function($test) { return $test['working']; })),
        'total_apis' => count($tests),
        'all_working' => count(array_filter($tests, function($test) { return $test['working']; })) == count($tests)
    ]
], JSON_PRETTY_PRINT);
?>
