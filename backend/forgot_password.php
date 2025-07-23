<?php
header("Access-Control-Allow-Origin: *");
<<<<<<< Updated upstream
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
=======
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

$email = $data['email'] ?? '';
$userType = $data['userType'] ?? '';

<<<<<<< Updated upstream
// Validate input
=======
>>>>>>> Stashed changes
if (empty($email) || empty($userType)) {
    echo json_encode(["success" => false, "message" => "Email and user type are required"]);
    exit;
}

<<<<<<< Updated upstream
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email format"]);
    exit;
}

try {
    // Determine table based on user type
    $table = ($userType === 'customer') ? 'customers' : 'sellers';
    
    // Check if user exists
    $stmt = $conn->prepare("SELECT id FROM {$table} WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        echo json_encode(["success" => false, "message" => "No account found with this email address"]);
        exit;
    }
    
    // Generate secure reset token
    $resetToken = bin2hex(random_bytes(32));
    $expiryTime = date('Y-m-d H:i:s', strtotime('+1 hour')); // Token expires in 1 hour
    
    // Save token to database
    $stmt = $conn->prepare("UPDATE {$table} SET reset_token = ?, reset_token_expiry = ? WHERE email = ?");
    $stmt->execute([$resetToken, $expiryTime, $email]);
    
    // In a real application, you would send an email here
    // For now, we'll just return the reset link in the response
    $resetLink = "http://localhost:3000/reset-password?token={$resetToken}&type={$userType}";
    
    echo json_encode([
        "success" => true, 
        "message" => "Password reset link has been sent to your email",
        "resetLink" => $resetLink // Remove this in production
    ]);
    
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
=======
$passwordReset = new PasswordReset($conn);
$result = $passwordReset->requestReset($email, $userType);

echo json_encode($result);
?>
>>>>>>> Stashed changes
