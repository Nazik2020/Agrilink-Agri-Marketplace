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

try {
	$priceList = $analytics->getTodaysSoldProducts();
	echo json_encode([
		'success' => true,
		'price_list' => $priceList,
	]);
} catch (Throwable $e) {
	echo json_encode([
		'success' => false,
		'message' => 'Failed to fetch today\'s price list',
	]);
}







