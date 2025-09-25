<?php
// backend/utils/purchase_guard.php
// Helper to verify a customer has purchased a product before allowing actions like review/flag.

if (!function_exists('pg_get_json_body')) {
    function pg_get_json_body() {
        $raw = file_get_contents('php://input');
        if (!$raw) return [];
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }
}

if (!function_exists('pg_extract_ids')) {
    function pg_extract_ids(array $post, array $json) {
        $cidKeys = ['customer_id','customerId','cid','user_id','userId'];
        $pidKeys = ['product_id','productId','pid'];

        $customerId = null;
        $productId = null;

        foreach ($cidKeys as $k) {
            if (isset($post[$k])) { $customerId = $post[$k]; break; }
            if (isset($json[$k])) { $customerId = $json[$k]; break; }
        }
        foreach ($pidKeys as $k) {
            if (isset($post[$k])) { $productId = $post[$k]; break; }
            if (isset($json[$k])) { $productId = $json[$k]; break; }
        }
        return [
            $customerId !== null ? (int)$customerId : null,
            $productId !== null ? (int)$productId : null,
        ];
    }
}

if (!function_exists('hasCustomerPurchased')) {
    function hasCustomerPurchased(PDO $pdo, $customerId, $productId) {
        if (!$customerId || !$productId) return false;

        $candidates = [
            // Project's flat orders schema: one row per product, with order_status/payment_status
            [
                "SELECT COUNT(*) AS c FROM orders WHERE customer_id = ? AND product_id = ? AND (payment_status IN ('completed','paid','succeeded') OR order_status IN ('confirmed','delivered','completed','paid'))",
                [$customerId, $productId]
            ],
            // If reviewing/flagging an original product that was purchased as a customized variant
            [
                "SELECT COUNT(*) AS c FROM orders WHERE customer_id = ? AND product_id IN (SELECT id FROM customized_products WHERE original_product_id = ?) AND (payment_status IN ('completed','paid','succeeded') OR order_status IN ('confirmed','delivered','completed','paid'))",
                [$customerId, $productId]
            ],
            // If reviewing/flagging a customized product, but purchase was for the original product
            [
                "SELECT COUNT(*) AS c FROM orders WHERE customer_id = ? AND product_id = (SELECT original_product_id FROM customized_products WHERE id = ?) AND (payment_status IN ('completed','paid','succeeded') OR order_status IN ('confirmed','delivered','completed','paid'))",
                [$customerId, $productId]
            ],
            // Common join patterns
            [
                "SELECT COUNT(*) AS c FROM orders o JOIN order_items oi ON oi.order_id = o.id WHERE o.customer_id = ? AND oi.product_id = ? AND (o.status IS NULL OR o.status IN ('paid','completed','delivered','confirmed'))",
                [$customerId, $productId]
            ],
            [
                "SELECT COUNT(*) AS c FROM orders o JOIN order_details oi ON oi.order_id = o.id WHERE o.customer_id = ? AND oi.product_id = ? AND (o.status IS NULL OR o.status IN ('paid','completed','delivered','confirmed'))",
                [$customerId, $productId]
            ],
            [
                "SELECT COUNT(*) AS c FROM orders o JOIN order_products oi ON oi.order_id = o.id WHERE o.customer_id = ? AND oi.product_id = ? AND (o.status IS NULL OR o.status IN ('paid','completed','delivered','confirmed'))",
                [$customerId, $productId]
            ],
            // Item table directly stores customer
            [
                "SELECT COUNT(*) AS c FROM order_items WHERE customer_id = ? AND product_id = ?",
                [$customerId, $productId]
            ],
            [
                "SELECT COUNT(*) AS c FROM order_details WHERE customer_id = ? AND product_id = ?",
                [$customerId, $productId]
            ],
            [
                "SELECT COUNT(*) AS c FROM order_products WHERE customer_id = ? AND product_id = ?",
                [$customerId, $productId]
            ],
            // Fallback: historical flat table
            [
                "SELECT COUNT(*) AS c FROM order_history WHERE customer_id = ? AND product_id = ?",
                [$customerId, $productId]
            ],
                // If reviewing an original product that was purchased as a customized variant
                [
                    "SELECT COUNT(*) AS c FROM orders WHERE customer_id = ? AND product_id IN (SELECT id FROM customized_products WHERE original_product_id = ?) AND (payment_status IN ('completed','paid','succeeded') OR order_status IN ('confirmed','delivered','completed','paid'))",
                    [$customerId, $productId]
                ],
        ];

        foreach ($candidates as $entry) {
            [$sql, $params] = $entry;
            try {
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($row && (int)$row['c'] > 0) return true;
            } catch (Throwable $e) {
                // Table may not exist in this schema; continue to next candidate.
                error_log('[purchase_guard] Skipping candidate due to error: ' . $e->getMessage());
                continue;
            }
        }
        return false;
    }
}

if (!function_exists('enforcePurchasedOrFail')) {
    function enforcePurchasedOrFail(PDO $pdo, $customerId, $productId) {
        if (!hasCustomerPurchased($pdo, $customerId, $productId)) {
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Please make sure you bought this product.',
                'code' => 'PURCHASE_REQUIRED'
            ]);
            exit;
        }
    }
}
