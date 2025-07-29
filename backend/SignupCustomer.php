<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';
require 'User.php';

$data = json_decode(file_get_contents("php://input"), true);

$full_name = $data['fullName'] ?? '';
$username = $data['userName'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$address = $data['address'] ?? '';
$contactno = $data['contactno'] ?? '';
$country = $data['country'] ?? '';
$postal_code = $data['postal_code'] ?? '';

if (empty($full_name) || empty($username) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}


$customer = new User($conn, "customers");

try {
    $customer->create($data);
    echo json_encode(["success" => true, "message" => "Customer registered successfully"]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(["success" => false, "message" => "Email already exists"]);
    } else {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}
