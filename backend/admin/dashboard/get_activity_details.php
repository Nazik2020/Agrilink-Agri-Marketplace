<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/admin_config.php';
require_once __DIR__ . '/../../services/OfferPricing.php';

$type = isset($_GET['type']) ? $_GET['type'] : '';
$id = isset($_GET['id']) ? $_GET['id'] : '';

try {
    $adminConfig = new AdminConfig();
    $conn = $adminConfig->getConnection();
    $details = null;

    if ($type === 'order') {
        $sql = "SELECT o.*, c.full_name AS customer_name, c.email AS customer_email FROM orders o LEFT JOIN customers c ON o.customer_id = c.id WHERE o.id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        $details = $stmt->fetch(PDO::FETCH_ASSOC);
        // Orders already hold offer-aware totals; expose a clearer alias
        if ($details) {
            $details['offer_total_amount'] = isset($details['total_amount']) ? (float)$details['total_amount'] : null;
        }
    } elseif ($type === 'product') {
        $sql = "SELECT p.*, s.business_name AS seller_name, s.email AS seller_email FROM products p LEFT JOIN sellers s ON p.seller_id = s.id WHERE p.id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        $details = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($details && isset($details['price'])) {
            $offer = isset($details['special_offer']) ? $details['special_offer'] : '';
            $calc = OfferPricing::compute((float)$details['price'], 1, $offer);
            $details['effective_price'] = $calc['unit_price'];
        }
    } elseif ($type === 'profile') {
        $sql = "SELECT * FROM customers WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        $details = $stmt->fetch(PDO::FETCH_ASSOC);
    } elseif ($type === 'registration') {
        $sql = "SELECT * FROM customers WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        $details = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if ($details) {
        echo json_encode(['success' => true, 'details' => $details]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No details found for this activity.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to get activity details: ' . $e->getMessage()
    ]);
}
