<?php
// Set timezone for analytics API
date_default_timezone_set('Asia/Colombo');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';
require_once 'SellerAnalytics.php';

$input = json_decode(file_get_contents('php://input'), true);
$sellerId = $input['seller_id'] ?? null;

if (!$sellerId) {
    echo json_encode(['success' => false, 'message' => 'Missing seller_id']);
    exit();
}

$pdo = getDbConnection();
if (!$pdo) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

$analytics = new SellerAnalytics($pdo, $sellerId);

$monthlyBreakdown = $analytics->getMonthlyIncomeBreakdown();
$response = [
    'success' => true,
    'today_orders' => $analytics->getTodaysOrders(),
    'today_income' => $analytics->getTodaysIncome(),
    'today_commission' => $analytics->getTodaysCommission(),
    'monthly_income' => $analytics->getMonthlyIncome(),
    'monthly_income_breakdown' => $monthlyBreakdown,
    // Add more fields as needed
];

echo json_encode($response);
