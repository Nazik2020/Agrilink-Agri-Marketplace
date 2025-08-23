<?php
/**
 * Order History API Index
 * Lists all available order history endpoints
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$endpoints = [
    'get_customer_orders' => [
        'file' => 'get_customer_orders.php',
        'method' => 'POST',
        'description' => 'Get all orders for a specific customer',
        'parameters' => [
            'customer_id' => 'integer (required) - Customer ID'
        ],
        'example_request' => [
            'customer_id' => 1
        ]
    ],
    'get_order_details' => [
        'file' => 'get_order_details.php',
        'method' => 'POST',
        'description' => 'Get detailed information for a specific order',
        'parameters' => [
            'order_id' => 'integer (optional) - Order ID',
            'order_number' => 'string (optional) - Order Number (use either order_id or order_number)'
        ],
        'example_request' => [
            'order_id' => 1
        ]
    ],
    'get_order_statistics' => [
        'file' => 'get_order_statistics.php',
        'method' => 'POST',
        'description' => 'Get order statistics and summary for a customer',
        'parameters' => [
            'customer_id' => 'integer (required) - Customer ID'
        ],
        'example_request' => [
            'customer_id' => 1
        ]
    ]
];

echo json_encode([
    'success' => true,
    'message' => 'Order History API Endpoints',
    'base_url' => 'http://localhost/Agrilink-Agri-Marketplace/backend/order_history/',
    'endpoints' => $endpoints,
    'version' => '1.0.0',
    'created' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT);
?>
