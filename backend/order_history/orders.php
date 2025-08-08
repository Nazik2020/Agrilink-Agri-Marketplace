<?php
// REAL ORDER HISTORY API - Using correct database connection
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include the correct database connection
require_once '../db.php';

// Get customer ID from request
$customerId = 4; // Default customer
$input = file_get_contents('php://input');
if ($input) {
    $data = json_decode($input, true);
    if (isset($data['customer_id'])) {
        $customerId = (int)$data['customer_id'];
    }
}

try {
    // Use the correct database connection from db.php
    $pdo = getDbConnection();

    // Get real orders from database
    $stmt = $pdo->prepare("
        SELECT 
            id as order_id,
            customer_id,
            seller_id,
            product_id,
            product_name,
            quantity,
            unit_price,
            total_amount,
            order_status,
            payment_status,
            payment_method,
            billing_name,
            billing_email,
            billing_address,
            billing_postal_code,
            billing_country,
            transaction_id,
            created_at,
            updated_at,
            CONCAT('AGR-', DATE_FORMAT(created_at, '%Y%m%d'), '-', LPAD(id, 3, '0')) as order_number
        FROM orders 
        WHERE customer_id = ? 
        ORDER BY created_at DESC
        LIMIT 50
    ");

    $stmt->execute([$customerId]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Add average_rating for each product in the orders
    foreach ($orders as &$order) {
        $avgStmt = $pdo->prepare("SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = ?");
        $avgStmt->execute([$order['product_id']]);
        $avg = $avgStmt->fetch(PDO::FETCH_ASSOC);
        $order['average_rating'] = $avg && $avg['avg_rating'] !== null ? round($avg['avg_rating'], 2) : null;
    }
    unset($order);

    if (count($orders) > 0) {
        // Real data found!
        echo json_encode([
            'success' => true,
            'message' => 'Real orders retrieved from database',
            'orders' => $orders,
            'customer_id' => $customerId,
            'count' => count($orders),
            'source' => 'database'
        ]);
        exit;
    } else {
        // No orders found for this customer
        echo json_encode([
            'success' => true,
            'message' => 'No orders found for customer ID: ' . $customerId,
            'orders' => [],
            'customer_id' => $customerId,
            'count' => 0,
            'source' => 'database_empty'
        ]);
        exit;
    }
    
} catch (Exception $e) {
    // Log the error
    error_log("Order History Database Error: " . $e->getMessage());
}

// If no database or no orders, return sample data
$sampleOrders = [
    [
        'order_id' => 1,
        'customer_id' => $customerId,
        'product_id' => 101,
        'product_name' => 'Organic Tomatoes',
        'quantity' => 2,
        'unit_price' => 12.50,
        'total_amount' => 25.00,
        'order_status' => 'delivered',
        'payment_status' => 'paid',
        'payment_method' => 'credit_card',
        'billing_name' => 'Customer ' . $customerId,
        'billing_email' => 'customer' . $customerId . '@example.com',
        'created_at' => '2024-01-15 10:30:00',
        'order_number' => 'AGR-20240115-001',
        'average_rating' => 4.5
    ],
    [
        'order_id' => 2,
        'customer_id' => $customerId,
        'product_id' => 102,
        'product_name' => 'Fresh Spinach',
        'quantity' => 1,
        'unit_price' => 8.75,
        'total_amount' => 8.75,
        'order_status' => 'shipped',
        'payment_status' => 'paid',
        'payment_method' => 'paypal',
        'billing_name' => 'Customer ' . $customerId,
        'billing_email' => 'customer' . $customerId . '@example.com',
        'created_at' => '2024-01-12 14:20:00',
        'order_number' => 'AGR-20240112-002',
        'average_rating' => 4.0
    ],
    [
        'order_id' => 3,
        'customer_id' => $customerId,
        'product_id' => 103,
        'product_name' => 'Premium Carrots',
        'quantity' => 3,
        'unit_price' => 6.50,
        'total_amount' => 19.50,
        'order_status' => 'processing',
        'payment_status' => 'paid',
        'payment_method' => 'stripe',
        'billing_name' => 'Customer ' . $customerId,
        'billing_email' => 'customer' . $customerId . '@example.com',
        'created_at' => '2024-01-10 09:15:00',
        'order_number' => 'AGR-20240110-003',
        'average_rating' => 5.0
    ]
];

echo json_encode([
    'success' => true,
    'message' => 'Sample order data (database not available)',
    'orders' => $sampleOrders,
    'customer_id' => $customerId,
    'count' => count($sampleOrders),
    'source' => 'sample'
]);
?>
