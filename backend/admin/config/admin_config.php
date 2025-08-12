<?php
// Use absolute path to avoid issues with relative path resolution
require_once dirname(__FILE__) . '/../../db.php';

class AdminConfig {
    private $conn;
    private $adminTable = 'admin_users';
    
    public function __construct() {
        $this->conn = getDbConnection();
    }
    
    public function getConnection() {
        return $this->conn;
    }
    
    public function verifyAdminToken($token) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->adminTable} WHERE token = ? AND token_expires > NOW()");
        $stmt->execute([$token]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function isAdminLoggedIn() {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
        
        if (!$token) {
            return false;
        }
        
        $admin = $this->verifyAdminToken($token);
        return $admin ? true : false;
    }
    
    public function requireAdminAuth() {
        if (!$this->isAdminLoggedIn()) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Admin authentication required']);
            exit;
        }
    }
}
?>