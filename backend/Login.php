<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';
require 'User.php';

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$db = new Database();
$seller = new User($db->conn, "sellers");
$customer = new User($db->conn, "customers");

try {
    // Check sellers
    $user = $seller->findByEmail($email);
    if ($user) {
        if (password_verify($password, $user['password'])) {
            unset($user['password']);
            $user['role'] = 'seller';
            echo json_encode(["success" => true, "message" => "Login successful (seller)", "user" => $user]);
            exit;
        } else {
            echo json_encode(["success" => false, "message" => "Password incorrect for seller"]);
            exit;
        }
    }
    // Check customers
    $user = $customer->findByEmail($email);
    if ($user) {
        if (password_verify($password, $user['password'])) {
            unset($user['password']);
            $user['role'] = 'customer';
            echo json_encode(["success" => true, "message" => "Login successful (customer)", "user" => $user]);
            exit;
        } else {
            echo json_encode(["success" => false, "message" => "Password incorrect for customer"]);
            exit;
        }
    }
    echo json_encode(["success" => false, "message" => "Email not found in sellers or customers"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} 