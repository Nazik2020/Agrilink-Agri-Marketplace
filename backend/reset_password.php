<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/vendor/autoload.php';
require 'db.php';
require 'PasswordReset.php';

$data = json_decode(file_get_contents("php://input"), true);

$token = $data['token'] ?? '';
$userType = $data['userType'] ?? '';
$newPassword = $data['newPassword'] ?? '';

if (empty($token) || empty($userType) || empty($newPassword)) {
    echo json_encode(["success" => false, "message" => "Token, user type, and new password are required"]);
    exit;
}

$passwordReset = new PasswordReset($conn);
$result = $passwordReset->resetPassword($token, $userType, $newPassword);

echo json_encode($result);
?>
