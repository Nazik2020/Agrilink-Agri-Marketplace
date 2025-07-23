<?php
<<<<<<< Updated upstream
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
=======
header("Access-Control-Allow-Origin: http://localhost:5178");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

>>>>>>> Stashed changes
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

<<<<<<< Updated upstream
require 'db.php';
=======
require_once __DIR__ . '/vendor/autoload.php';
require 'db.php';
require 'PasswordReset.php';
>>>>>>> Stashed changes

$data = json_decode(file_get_contents("php://input"), true);

$token = $data['token'] ?? '';
$userType = $data['userType'] ?? '';
$newPassword = $data['newPassword'] ?? '';

<<<<<<< Updated upstream
// Validate input
=======
>>>>>>> Stashed changes
if (empty($token) || empty($userType) || empty($newPassword)) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

<<<<<<< Updated upstream
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
=======
$passwordReset = new PasswordReset($conn);
$result = $passwordReset->resetPassword($token, $userType, $newPassword);

echo json_encode($result);
?>
>>>>>>> Stashed changes
