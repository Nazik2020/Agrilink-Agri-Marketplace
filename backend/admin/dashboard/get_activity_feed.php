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

try {
    $adminConfig = new AdminConfig();
    $conn = $adminConfig->getConnection();

    // Month filter (format: YYYY-MM)
    $month = isset($_GET['month']) ? $_GET['month'] : null;
    $monthStart = null;
    $monthEnd = null;
    if ($month && preg_match('/^\d{4}-\d{2}$/', $month)) {
        $monthStart = $month . '-01 00:00:00';
        $monthEnd = date('Y-m-t 23:59:59', strtotime($monthStart));
    }

    $activities = [];

    // Profile updates
    $profileSql = "SELECT c.id AS activity_id, c.full_name AS user, 'Updated profile' AS action, c.updated_at AS time, 'profile' AS type FROM customers c WHERE c.updated_at IS NOT NULL";
    if ($monthStart && $monthEnd) {
        $profileSql .= " AND c.updated_at BETWEEN '" . $monthStart . "' AND '" . $monthEnd . "'";
    }
    $profileSql .= " ORDER BY c.updated_at DESC LIMIT 20";
    foreach ($conn->query($profileSql) as $row) {
        $activities[] = [
            'id' => $row['activity_id'],
            'user' => $row['user'],
            'action' => $row['action'],
            'time' => timeAgo($row['time']),
            'time_raw' => $row['time'],
            'type' => $row['type']
        ];
    }

    // Orders
    $orderSql = "SELECT o.id AS activity_id, c.full_name AS user, CONCAT('Placed order #', o.id) AS action, o.created_at AS time, 'order' AS type, o.total_amount, o.payment_status FROM orders o LEFT JOIN customers c ON o.customer_id = c.id";
    if ($monthStart && $monthEnd) {
        $orderSql .= " WHERE o.created_at BETWEEN '" . $monthStart . "' AND '" . $monthEnd . "'";
    }
    $orderSql .= " ORDER BY o.created_at DESC LIMIT 20";
    foreach ($conn->query($orderSql) as $row) {
        $activities[] = [
            'id' => $row['activity_id'],
            'user' => $row['user'],
            'action' => $row['action'],
            'time' => timeAgo($row['time']),
            'time_raw' => $row['time'],
            'type' => $row['type'],
            'total_amount' => isset($row['total_amount']) ? (float)$row['total_amount'] : null,
            'payment_status' => isset($row['payment_status']) ? $row['payment_status'] : null
        ];
    }

    // Products added
    $productSql = "SELECT p.id AS activity_id, s.business_name AS user, 'Added new product' AS action, p.created_at AS time, 'product' AS type, p.price, p.special_offer FROM products p LEFT JOIN sellers s ON p.seller_id = s.id";
    if ($monthStart && $monthEnd) {
        $productSql .= " WHERE p.created_at BETWEEN '" . $monthStart . "' AND '" . $monthEnd . "'";
    }
    $productSql .= " ORDER BY p.created_at DESC LIMIT 20";
    foreach ($conn->query($productSql) as $row) {
        $price = isset($row['price']) ? (float)$row['price'] : null;
        $offer = isset($row['special_offer']) ? $row['special_offer'] : '';
        $effective = null;
        if ($price !== null) {
            $calc = OfferPricing::compute($price, 1, $offer);
            $effective = $calc['unit_price'];
        }
        $activities[] = [
            'id' => $row['activity_id'],
            'user' => $row['user'],
            'action' => $row['action'],
            'time' => timeAgo($row['time']),
            'time_raw' => $row['time'],
            'type' => $row['type'],
            'price' => $price,
            'special_offer' => $offer,
            'effective_price' => $effective
        ];
    }


    // Registrations
    $regSql = "SELECT c.id AS activity_id, c.full_name AS user, 'Registered new account' AS action, c.created_at AS time, 'registration' AS type FROM customers c";
    if ($monthStart && $monthEnd) {
        $regSql .= " WHERE c.created_at BETWEEN '" . $monthStart . "' AND '" . $monthEnd . "'";
    }
    $regSql .= " ORDER BY c.created_at DESC LIMIT 20";
    foreach ($conn->query($regSql) as $row) {
        $activities[] = [
            'id' => $row['activity_id'],
            'user' => $row['user'],
            'action' => $row['action'],
            'time' => timeAgo($row['time']),
            'time_raw' => $row['time'],
            'type' => $row['type']
        ];
    }

    // Sort all activities by time_raw descending
    usort($activities, function($a, $b) {
        return strtotime($b['time_raw']) - strtotime($a['time_raw']);
    });

    echo json_encode([
        'success' => true,
        'activities' => $activities
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to get activity feed: ' . $e->getMessage()
    ]);
}

function timeAgo($datetime) {
    $timestamp = strtotime($datetime);
    $diff = time() - $timestamp;
    if ($diff < 60) return $diff . ' seconds ago';
    if ($diff < 3600) return floor($diff/60) . ' minutes ago';
    if ($diff < 86400) return floor($diff/3600) . ' hours ago';
    return floor($diff/86400) . ' days ago';
}
