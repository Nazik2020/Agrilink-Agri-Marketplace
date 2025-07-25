<?php

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

// Load environment variables from reset_password.env
$dotenv = Dotenv::createImmutable(__DIR__, 'reset_password.env');
$dotenv->load();

class PasswordReset {

    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function requestReset($email, $userType) {
        try {
            // Determine table based on user type
            $table = ($userType === 'customer') ? 'customers' : 'sellers';
            
            // Check if user exists
            $stmt = $this->conn->prepare("SELECT id, email FROM {$table} WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$user) {
                return [
                    "success" => false, 
                    "message" => "No account found with this email address"
                ];
            }
            
            // Generate secure reset token
            $reset_token = bin2hex(random_bytes(32));
            $expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));

            // Save reset token to database
            $stmt = $this->conn->prepare("UPDATE {$table} SET reset_token = ?, reset_token_expires = ? WHERE email = ?");
            $success = $stmt->execute([$reset_token, $expires_at, $email]);

            if ($success) {
                $reset_link = "http://localhost:5178/reset-password?token={$reset_token}&userType={$userType}";

                $mail = new PHPMailer(true);
                $sent = false;
                try {
                    $mail->isSMTP();
                    $mail->Host       = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
                    $mail->SMTPAuth   = true;
                    $mail->Username   = getenv('SMTP_USER');
                    $mail->Password   = getenv('SMTP_PASS');
                    $mail->SMTPSecure = getenv('SMTP_SECURE') ?: 'tls';
                    $mail->Port       = getenv('SMTP_PORT') ?: 587;

                    $mail->setFrom(getenv('SMTP_USER'), 'AgriLink');
                    $mail->addAddress($email);
                    $mail->isHTML(true);
                    $mail->Subject = 'Password Reset Request';
                    $mail->Body    = "Click the following link to reset your password: <a href='$reset_link'>$reset_link</a><br>This link will expire in 1 hour.";

                    $mail->send();
                    $sent = true;
                } catch (PHPMailerException $e) {
                    $sent = false;
                    $errorMsg = $mail->ErrorInfo ? $mail->ErrorInfo : $e->getMessage();
                }

                return [
                    "success" => $sent,
                    "message" => $sent ? "Password reset link has been sent to your email" : ("Failed to send email: " . ($errorMsg ?? "Unknown error")),
                    "reset_link" => $reset_link
                ];
            } else {
                return [
                    "success" => false,
                    "message" => "Failed to generate reset link"
                ];
            }
            
        } catch (PDOException $e) {
            return [
                "success" => false,
                "message" => "Database error: " . $e->getMessage()
            ];
        }
    }
    
    public function resetPassword($token, $userType, $newPassword) {
        try {
            // Determine table based on user type
            $table = ($userType === 'customer') ? 'customers' : 'sellers';
            
            // Check if token is valid and not expired
            $stmt = $this->conn->prepare("SELECT id, email, reset_token_expires FROM {$table} WHERE reset_token = ?");
            $stmt->execute([$token]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$user) {
                return [
                    "success" => false,
                    "message" => "Invalid reset token"
                ];
            }
            
            // Check if token has expired
            $current_time = date('Y-m-d H:i:s');
            if ($current_time > $user['reset_token_expires']) {
                return [
                    "success" => false,
                    "message" => "Reset token has expired. Please request a new one."
                ];
            }
            
            // Hash the new password
            $hashed_password = password_hash($newPassword, PASSWORD_DEFAULT);
            
            // Update password and clear reset token
            $stmt = $this->conn->prepare("UPDATE {$table} SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ?");
            $success = $stmt->execute([$hashed_password, $token]);
            
            if ($success) {
                return [
                    "success" => true,
                    "message" => "Password has been reset successfully. You can now login with your new password."
                ];
            } else {
                return [
                    "success" => false,
                    "message" => "Failed to update password"
                ];
            }
            
        } catch (PDOException $e) {
            return [
                "success" => false,
                "message" => "Database error: " . $e->getMessage()
            ];
        }
    }
    
    public function validateToken($token, $userType) {
        try {
            $table = ($userType === 'customer') ? 'customers' : 'sellers';
            
            $stmt = $this->conn->prepare("SELECT id, reset_token_expires FROM {$table} WHERE reset_token = ?");
            $stmt->execute([$token]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$user) {
                return ["valid" => false, "message" => "Invalid token"];
            }
            
            $current_time = date('Y-m-d H:i:s');
            if ($current_time > $user['reset_token_expires']) {
                return ["valid" => false, "message" => "Token expired"];
            }
            
            return ["valid" => true, "message" => "Token is valid"];
            
        } catch (PDOException $e) {
            return ["valid" => false, "message" => "Database error"];
        }
    }
}
?>
