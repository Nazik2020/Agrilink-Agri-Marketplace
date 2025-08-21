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
require 'src/PHPMailer.php';
require 'src/SMTP.php';
require 'src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load environment variables
$env = [];
if (file_exists('reset_password.env')) {
    $lines = file('reset_password.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $env[trim($key)] = trim($value);
        }
    }
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$userType = $data['userType'] ?? '';

// Validate input
if (empty($email) || empty($userType)) {
    echo json_encode(["success" => false, "message" => "Email and user type are required"]);
    exit;
}

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
    $stmt = $conn->prepare("UPDATE {$table} SET reset_token = ?, reset_token_expires = ? WHERE email = ?");
    $stmt->execute([$resetToken, $expiryTime, $email]);
    
    // Send email with reset link
    $resetLink = "http://localhost:3000/reset-password?token={$resetToken}&userType={$userType}";
    
    $mail = new PHPMailer(true);
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = $env['SMTP_HOST'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $env['SMTP_USER'];
        $mail->Password   = $env['SMTP_PASS'];
        $mail->SMTPSecure = $env['SMTP_SECURE'];
        $mail->Port       = $env['SMTP_PORT'];

        // Recipients
        $mail->setFrom($env['SMTP_USER'], 'Agricultural Marketplace');
        $mail->addAddress($email);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Password Reset Request - Agricultural Marketplace';
        $mail->Body    = "
        <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password for your Agricultural Marketplace account.</p>
            <p>Click the link below to reset your password:</p>
            <p><a href='{$resetLink}' target='_self' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;'>Reset Password</a></p>
            <p>Or copy and paste this link in your current browser tab:</p>
            <p style='word-break: break-all; color: #666; font-size: 14px;'>{$resetLink}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request this password reset, please ignore this email.</p>
            <br>
            <p>Best regards,<br>Agricultural Marketplace Team</p>
        </body>
        </html>";

        $mail->send();
        
        echo json_encode([
            "success" => true, 
            "message" => "Password reset link has been sent to your email"
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            "success" => false, 
            "message" => "Failed to send email. Please try again later."
        ]);
    }
    
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>