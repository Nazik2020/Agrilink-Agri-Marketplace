<?php
// STANDALONE TEST - No dependencies
// Fix CORS completely for React localhost:3000

// Set CORS headers FIRST - before any output
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Return sample order data for customer ID 1
$sampleOrders = [
    [
        'order_id' => 'ORD-001',
        'product_id' => 101,
        'product_name' => 'Organic Tomatoes',
        'quantity' => 2,
        'price' => '12.50',
        'total_amount' => '25.00',
        'order_date' => '2024-01-15 10:30:00',
        'status' => 'delivered'
    ],
    [
        'order_id' => 'ORD-001',
        'product_id' => 102,
        'product_name' => 'Fresh Spinach',
        'quantity' => 1,
        'price' => '8.75',
        'total_amount' => '8.75',
        'order_date' => '2024-01-15 10:30:00',
        'status' => 'delivered'
    ],
    [
        'order_id' => 'ORD-002',
        'product_id' => 103,
        'product_name' => 'Premium Carrots',
        'quantity' => 3,
        'price' => '6.50',
        'total_amount' => '19.50',
        'order_date' => '2024-01-12 14:20:00',
        'status' => 'shipped'
    ],
    [
        'order_id' => 'ORD-003',
        'product_id' => 104,
        'product_name' => 'Organic Lettuce',
        'quantity' => 2,
        'price' => '4.25',
        'total_amount' => '8.50',
        'order_date' => '2024-01-10 16:45:00',
        'status' => 'processing'
    ]
];

// Get customer ID from request
$input = json_decode(file_get_contents('php://input'), true);
$customerId = $input['customer_id'] ?? $_GET['customer_id'] ?? 1;

// Log the request
error_log("Order History API called for customer: " . $customerId);

// Return success response
$response = [
    'success' => true,
    'message' => 'Orders retrieved successfully',
    'data' => $sampleOrders,
    'debug' => [
        'customer_id' => $customerId,
        'timestamp' => date('Y-m-d H:i:s'),
        'method' => $_SERVER['REQUEST_METHOD'],
        'origin' => $_SERVER['HTTP_ORIGIN'] ?? 'none'
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
