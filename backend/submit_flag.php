<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require 'db.php';
require_once __DIR__ . '/admin/content_moderation/FlagService.php';

$data = json_decode(file_get_contents("php://input"), true);

try {
    $service = new FlagService();
    $result = $service->createFlag(
        (int)($data['flagged_by_customer_id'] ?? 0),
        (int)($data['seller_id'] ?? 0),
        isset($data['product_id']) ? (int)$data['product_id'] : null,
        (string)($data['category'] ?? ''),
        (string)($data['reason'] ?? '')
    );
    echo json_encode($result);
} catch (Throwable $e) {
    error_log('submit_flag error: ' . $e->getMessage());
    error_log('submit_flag error trace: ' . $e->getTraceAsString());
    echo json_encode([
        "success" => false,
        "message" => "Server error. Please try again.",
        "debug" => $e->getMessage() // Remove in production
    ]);
}
?>