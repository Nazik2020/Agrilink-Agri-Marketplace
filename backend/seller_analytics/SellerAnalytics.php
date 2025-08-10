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

    public function getTodaysExpenses() {
        $stmt = $this->pdo->prepare("SELECT SUM(amount) FROM expenses WHERE seller_id = ? AND expense_date = CURDATE()");
        $stmt->execute([$this->sellerId]);
        return (float)$stmt->fetchColumn();
    }

    public function getTodaysProfit() {
        return $this->getTodaysIncome() - $this->getTodaysExpenses();
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

    // Add more analytics methods as needed
}
