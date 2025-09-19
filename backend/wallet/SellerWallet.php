<?php
require_once '../db.php';

class SellerWallet {
    private $conn;
    private $seller_id;

    public function __construct($seller_id) {
        require_once '../db.php';
        $this->conn = getDbConnection();
        $this->seller_id = $seller_id;
    }

    // Total products sold (successful payments)
    public function getProductsSold() {
        // Include common successful payment statuses to avoid zero totals when legacy data used different labels
        $stmt = $this->conn->prepare(
            "SELECT COALESCE(SUM(quantity), 0) as total_sold
             FROM orders
             WHERE seller_id = ?
               AND COALESCE(payment_status, '') IN ('completed','paid','success','succeeded')"
        );
        $stmt->execute([$this->seller_id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? (int)$row['total_sold'] : 0;
    }

    // Total earnings (sum of successful order amounts)
    public function getTotalEarnings() {
        $stmt = $this->conn->prepare(
            "SELECT COALESCE(SUM(total_amount), 0) as earnings
             FROM orders
             WHERE seller_id = ?
               AND COALESCE(payment_status, '') IN ('completed','paid','success','succeeded')"
        );
        $stmt->execute([$this->seller_id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? (float)$row['earnings'] : 0.0;
    }

    // Total withdrawals
    public function getTotalWithdrawals() {
        $stmt = $this->conn->prepare("SELECT SUM(amount) as withdrawn FROM withdrawals WHERE seller_id = ? AND status = 'completed'");
        $stmt->execute([$this->seller_id]);
        $row = $stmt->fetch();
        return $row ? (float)$row['withdrawn'] : 0.0;
    }

    // Available balance
    public function getAvailableBalance() {
        return $this->getTotalEarnings() - $this->getTotalWithdrawals();
    }

    // Transaction history (sales and withdrawals)
    public function getTransactionHistory() {
        $history = [];
        // Sales (successful payments)
        $stmt = $this->conn->prepare(
            "SELECT created_at as date, total_amount as amount, 'Sale' as type, COALESCE(payment_status, 'completed') as status
             FROM orders
             WHERE seller_id = ?
               AND COALESCE(payment_status, '') IN ('completed','paid','success','succeeded')
             ORDER BY created_at DESC"
        );
        $stmt->execute([$this->seller_id]);
        $sales = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($sales as $sale) {
            $history[] = [
                'date' => $sale['date'],
                'type' => $sale['type'],
                'amount' => (float)$sale['amount'],
                'status' => $sale['status']
            ];
        }
        // Withdrawals
        $stmt = $this->conn->prepare(
            "SELECT withdrawal_date as date, amount, 'Withdrawal' as type, status
             FROM withdrawals
             WHERE seller_id = ?
             ORDER BY withdrawal_date DESC"
        );
        $stmt->execute([$this->seller_id]);
        $withdrawals = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($withdrawals as $w) {
            $history[] = [
                'date' => $w['date'],
                'type' => $w['type'],
                'amount' => -((float)$w['amount']), // negative for withdrawal
                'status' => $w['status']
            ];
        }
        // Sort by date DESC
        usort($history, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });
        return $history;
    }
}
