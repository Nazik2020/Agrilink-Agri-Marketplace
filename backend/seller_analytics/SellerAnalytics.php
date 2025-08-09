<?php
class SellerAnalytics {
    private $pdo;
    private $sellerId;

    public function __construct($pdo, $sellerId) {
        $this->pdo = $pdo;
        $this->sellerId = $sellerId;
    }

    public function getTodaysOrders() {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM orders WHERE seller_id = ? AND DATE(created_at) = CURDATE()");
        $stmt->execute([$this->sellerId]);
        return (int)$stmt->fetchColumn();
    }

    public function getTodaysIncome() {
        $stmt = $this->pdo->prepare("SELECT SUM(total_amount) FROM orders WHERE seller_id = ? AND DATE(created_at) = CURDATE() AND order_status = 'delivered'");
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
        $stmt = $this->pdo->prepare("SELECT SUM(total_amount) FROM orders WHERE seller_id = ? AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) AND order_status = 'delivered'");
        $stmt->execute([$this->sellerId]);
        return (float)$stmt->fetchColumn();
    }

    public function getMonthlyIncomeBreakdown() {
        $stmt = $this->pdo->prepare("
            SELECT 
                YEAR(created_at) as year,
                MONTH(created_at) as month,
                SUM(total_amount) as income
            FROM orders
            WHERE seller_id = ? AND order_status = 'delivered'
            GROUP BY YEAR(created_at), MONTH(created_at)
            ORDER BY year, month
        ");
        $stmt->execute([$this->sellerId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Add more analytics methods as needed
}
