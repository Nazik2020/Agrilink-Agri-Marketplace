<?php
require_once '../config/admin_config.php';

class DashboardStats {
    private $conn;
    private $adminConfig;
    
    public function __construct() {
        $this->adminConfig = new AdminConfig();
        $this->conn = $this->adminConfig->getConnection();
    }
    
    /**
     * Get comprehensive dashboard statistics
     */
    public function getDashboardStats() {
        try {
            $stats = [
                'total_users' => $this->getTotalUsers(),
                'active_sellers' => $this->getActiveSellers(),
                'flagged_content' => $this->getFlaggedContent(),
                'revenue' => $this->getRevenue(),
                'recent_activities' => $this->getRecentActivities(),
                'user_growth' => $this->getUserGrowth(),
                'revenue_growth' => $this->getRevenueGrowth()
            ];
            
            return [
                'success' => true,
                'stats' => $stats
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error fetching dashboard stats: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get total users (customers + sellers)
     */
    private function getTotalUsers() {
        $stmt = $this->conn->query("
            SELECT 
                (SELECT COUNT(*) FROM customers) as customers_count,
                (SELECT COUNT(*) FROM sellers) as sellers_count
        ");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $totalUsers = $result['customers_count'] + $result['sellers_count'];
        
        // Calculate growth from last month
        $lastMonthUsers = $this->getLastMonthUsers();
        $growth = $lastMonthUsers > 0 ? (($totalUsers - $lastMonthUsers) / $lastMonthUsers) * 100 : 0;
        
        return [
            'count' => $totalUsers,
            'growth' => round($growth, 1),
            'customers' => $result['customers_count'],
            'sellers' => $result['sellers_count']
        ];
    }
    
    /**
     * Get active sellers count
     */
    private function getActiveSellers() {
        $stmt = $this->conn->query("
            SELECT COUNT(*) as count 
            FROM sellers 
            WHERE COALESCE(status, 'active') = 'active'
        ");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Calculate growth from last month
        $lastMonthSellers = $this->getLastMonthActiveSellers();
        $growth = $lastMonthSellers > 0 ? (($result['count'] - $lastMonthSellers) / $lastMonthSellers) * 100 : 0;
        
        return [
            'count' => $result['count'],
            'growth' => round($growth, 1)
        ];
    }
    
    /**
     * Get flagged content count
     */
    private function getFlaggedContent() {
        // Check if flags table exists
        $stmt = $this->conn->query("SHOW TABLES LIKE 'flags'");
        if ($stmt->rowCount() > 0) {
            $stmt = $this->conn->query("SELECT COUNT(*) as count FROM flags WHERE status = 'pending'");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return [
                'count' => $result['count'],
                'status' => $result['count'] > 0 ? 'Requires attention' : 'All clear'
            ];
        } else {
            // If flags table doesn't exist, return 0
            return [
                'count' => 0,
                'status' => 'No flags system'
            ];
        }
    }
    
    /**
     * Get total revenue
     */
    private function getRevenue() {
        $stmt = $this->conn->query("
            SELECT COALESCE(SUM(total_amount), 0) as total_revenue 
            FROM orders 
            WHERE status = 'completed'
        ");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Calculate growth from last month
        $lastMonthRevenue = $this->getLastMonthRevenue();
        $growth = $lastMonthRevenue > 0 ? (($result['total_revenue'] - $lastMonthRevenue) / $lastMonthRevenue) * 100 : 0;
        
        return [
            'amount' => $result['total_revenue'],
            'formatted' => '$' . number_format($result['total_revenue'], 2),
            'growth' => round($growth, 1)
        ];
    }
    
    /**
     * Get recent activities
     */
    private function getRecentActivities() {
        $activities = [];
        
        // Recent orders
        $stmt = $this->conn->query("
            SELECT o.id, o.total_amount, o.created_at, c.full_name as customer_name
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            ORDER BY o.created_at DESC
            LIMIT 5
        ");
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($orders as $order) {
            $activities[] = [
                'type' => 'order',
                'message' => "Order #{$order['id']} placed by {$order['customer_name']}",
                'amount' => $order['total_amount'],
                'time' => $this->getTimeAgo($order['created_at'])
            ];
        }
        
        // Recent user registrations
        $stmt = $this->conn->query("
            SELECT full_name, created_at, 'customer' as type
            FROM customers
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            UNION ALL
            SELECT business_name as full_name, created_at, 'seller' as type
            FROM sellers
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            ORDER BY created_at DESC
            LIMIT 3
        ");
        $registrations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($registrations as $reg) {
            $activities[] = [
                'type' => 'registration',
                'message' => "New {$reg['type']} registered: {$reg['full_name']}",
                'time' => $this->getTimeAgo($reg['created_at'])
            ];
        }
        
        // Sort by time and return top 10
        usort($activities, function($a, $b) {
            return strtotime($b['time']) - strtotime($a['time']);
        });
        
        return array_slice($activities, 0, 10);
    }
    
    /**
     * Get user growth from last month
     */
    private function getLastMonthUsers() {
        $stmt = $this->conn->query("
            SELECT 
                (SELECT COUNT(*) FROM customers WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)) as customers_count,
                (SELECT COUNT(*) FROM sellers WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)) as sellers_count
        ");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['customers_count'] + $result['sellers_count'];
    }
    
    /**
     * Get active sellers from last month
     */
    private function getLastMonthActiveSellers() {
        $stmt = $this->conn->query("
            SELECT COUNT(*) as count 
            FROM sellers 
            WHERE COALESCE(status, 'active') = 'active' 
            AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)
        ");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'];
    }
    
    /**
     * Get revenue from last month
     */
    private function getLastMonthRevenue() {
        $stmt = $this->conn->query("
            SELECT COALESCE(SUM(total_amount), 0) as total_revenue 
            FROM orders 
            WHERE status = 'completed' 
            AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)
        ");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['total_revenue'];
    }
    
    /**
     * Get user growth percentage
     */
    private function getUserGrowth() {
        $currentUsers = $this->getTotalUsers()['count'];
        $lastMonthUsers = $this->getLastMonthUsers();
        
        if ($lastMonthUsers > 0) {
            return round((($currentUsers - $lastMonthUsers) / $lastMonthUsers) * 100, 1);
        }
        return 0;
    }
    
    /**
     * Get revenue growth percentage
     */
    private function getRevenueGrowth() {
        $currentRevenue = $this->getRevenue()['amount'];
        $lastMonthRevenue = $this->getLastMonthRevenue();
        
        if ($lastMonthRevenue > 0) {
            return round((($currentRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1);
        }
        return 0;
    }
    
    /**
     * Convert timestamp to "time ago" format
     */
    private function getTimeAgo($timestamp) {
        $time = time() - strtotime($timestamp);
        
        if ($time < 60) {
            return 'Just now';
        } elseif ($time < 3600) {
            $minutes = floor($time / 60);
            return $minutes . ' minute' . ($minutes > 1 ? 's' : '') . ' ago';
        } elseif ($time < 86400) {
            $hours = floor($time / 3600);
            return $hours . ' hour' . ($hours > 1 ? 's' : '') . ' ago';
        } else {
            $days = floor($time / 86400);
            return $days . ' day' . ($days > 1 ? 's' : '') . ' ago';
        }
    }
    
    /**
     * Get platform metrics
     */
    public function getPlatformMetrics() {
        try {
            $metrics = [
                'total_products' => $this->getTotalProducts(),
                'total_orders' => $this->getTotalOrders(),
                'average_order_value' => $this->getAverageOrderValue(),
                'top_selling_products' => $this->getTopSellingProducts(),
                'user_activity' => $this->getUserActivity()
            ];
            
            return [
                'success' => true,
                'metrics' => $metrics
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error fetching platform metrics: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get total products
     */
    private function getTotalProducts() {
        $stmt = $this->conn->query("SELECT COUNT(*) as count FROM products");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'];
    }
    
    /**
     * Get total orders
     */
    private function getTotalOrders() {
        $stmt = $this->conn->query("SELECT COUNT(*) as count FROM orders");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'];
    }
    
    /**
     * Get average order value
     */
    private function getAverageOrderValue() {
        $stmt = $this->conn->query("
            SELECT COALESCE(AVG(total_amount), 0) as avg_value 
            FROM orders 
            WHERE status = 'completed'
        ");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return round($result['avg_value'], 2);
    }
    
    /**
     * Get top selling products
     */
    private function getTopSellingProducts() {
        $stmt = $this->conn->query("
            SELECT p.name, COUNT(o.id) as order_count
            FROM products p
            LEFT JOIN orders o ON p.id = o.product_id
            GROUP BY p.id, p.name
            ORDER BY order_count DESC
            LIMIT 5
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * Get user activity (recent logins, registrations)
     */
    private function getUserActivity() {
        // Recent registrations
        $stmt = $this->conn->query("
            SELECT COUNT(*) as new_users
            FROM (
                SELECT created_at FROM customers WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                UNION ALL
                SELECT created_at FROM sellers WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            ) as recent_users
        ");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return [
            'new_users_this_week' => $result['new_users'],
            'active_users_today' => $this->getActiveUsersToday()
        ];
    }
    
    /**
     * Get active users today (users with orders today)
     */
    private function getActiveUsersToday() {
        $stmt = $this->conn->query("
            SELECT COUNT(DISTINCT customer_id) as count
            FROM orders
            WHERE DATE(created_at) = CURDATE()
        ");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'];
    }
}
?> 