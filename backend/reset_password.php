<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$token = $data['token'] ?? '';
$userType = $data['userType'] ?? '';
$newPassword = $data['newPassword'] ?? '';

// Validate input
if (empty($token) || empty($userType) || empty($newPassword)) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

if (strlen($newPassword) < 6) {
    echo json_encode(["success" => false, "message" => "Password must be at least 6 characters long"]);
    exit;
}

try {
    // Determine table based on user type
    $table = ($userType === 'customer') ? 'customers' : 'sellers';
    
    // Check if token is valid and not expired
    $stmt = $conn->prepare("SELECT id FROM {$table} WHERE reset_token = ? AND reset_token_expiry > NOW()");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        echo json_encode(["success" => false, "message" => "Invalid or expired reset token"]);
        exit;
    }
    
    // Hash the new password
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
    
    // Update password and clear reset token
    $stmt = $conn->prepare("UPDATE {$table} SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?");
    $stmt->execute([$hashedPassword, $token]);
    
    echo json_encode([
        "success" => true, 
        "message" => "Password has been reset successfully"
    ]);
    
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>