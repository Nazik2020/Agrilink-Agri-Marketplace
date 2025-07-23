<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';
require 'PasswordReset.php';

$token = $_GET['token'] ?? '';
$userType = $_GET['userType'] ?? '';

if (empty($token) || empty($userType)) {
    echo json_encode(["valid" => false, "message" => "Token and user type are required"]);
    exit;
}

$passwordReset = new PasswordReset($conn);
$result = $passwordReset->validateToken($token, $userType);

echo json_encode($result);
?>