<?php
// Set timezone for all analytics calculations
date_default_timezone_set('Asia/Colombo');
class SellerAnalytics {
    private $pdo;
    private $sellerId;

    public function __construct($pdo, $sellerId) {
        $this->pdo = $pdo;
        $this->sellerId = $sellerId;
    }

    public function getTodaysOrders() {
    $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM orders WHERE seller_id = ? AND DATE(CONVERT_TZ(created_at, '+00:00', '+05:30')) = CURDATE() AND payment_status = 'completed'");
    $stmt->execute([$this->sellerId]);
    return (int)$stmt->fetchColumn();
    }

    public function getTodaysIncome() {
    $stmt = $this->pdo->prepare("SELECT SUM(total_amount) FROM orders WHERE seller_id = ? AND DATE(CONVERT_TZ(created_at, '+00:00', '+05:30')) = CURDATE() AND payment_status = 'completed'");
    $stmt->execute([$this->sellerId]);
    return (float)$stmt->fetchColumn();
    }

    public function getTodaysCommission() {
        // Calculate 2.5% commission on today's income
        $todaysIncome = $this->getTodaysIncome();
        return round($todaysIncome * 0.025, 2);
    }

    public function getMonthlyIncome() {
    $stmt = $this->pdo->prepare("SELECT SUM(total_amount) FROM orders WHERE seller_id = ? AND MONTH(CONVERT_TZ(created_at, '+00:00', '+05:30')) = MONTH(CONVERT_TZ(NOW(), '+00:00', '+05:30')) AND YEAR(CONVERT_TZ(created_at, '+00:00', '+05:30')) = YEAR(CONVERT_TZ(NOW(), '+00:00', '+05:30')) AND payment_status = 'completed'");
    $stmt->execute([$this->sellerId]);
    return (float)$stmt->fetchColumn();
    }

    public function getMonthlyIncomeBreakdown() {
        $stmt = $this->pdo->prepare("
            SELECT 
                YEAR(CONVERT_TZ(created_at, '+00:00', '+05:30')) as year,
                MONTH(CONVERT_TZ(created_at, '+00:00', '+05:30')) as month,
                SUM(total_amount) as income
            FROM orders
            WHERE seller_id = ? AND payment_status = 'completed'
            GROUP BY YEAR(CONVERT_TZ(created_at, '+00:00', '+05:30')), MONTH(CONVERT_TZ(created_at, '+00:00', '+05:30'))
            ORDER BY year, month
        ");
        $stmt->execute([$this->sellerId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Return today's sold products for this seller with aggregated quantity and totals.
     */
    public function getTodaysSoldProducts() {
        $sql = "
            SELECT 
                o.product_id,
                o.product_name,
                MAX(o.unit_price) AS unit_price,
                SUM(o.quantity) AS total_quantity,
                SUM(o.total_amount) AS total_amount
            FROM orders o
            WHERE 
                o.seller_id = ?
                AND DATE(CONVERT_TZ(o.created_at, '+00:00', '+05:30')) = CURDATE()
                AND o.payment_status = 'completed'
            GROUP BY o.product_id, o.product_name
            ORDER BY total_amount DESC
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$this->sellerId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map(function ($row) {
            $row['unit_price'] = (float)$row['unit_price'];
            $row['total_quantity'] = (int)$row['total_quantity'];
            $row['total_amount'] = (float)$row['total_amount'];
            return $row;
        }, $rows);
    }

    // Add more analytics methods as needed
}
