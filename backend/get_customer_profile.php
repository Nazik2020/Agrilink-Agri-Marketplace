<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';
require 'Customer.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';

// Debug: Log the received data
error_log("Received data: " . print_r($data, true));
error_log("Email received: " . $email);

if (empty($email)) {
    echo json_encode(["success" => false, "message" => "Email is required"]);
    exit;
}

try {
    // Debug: Check what's in the database
    $stmt = $conn->prepare("SELECT id, full_name, email FROM customers");
    $stmt->execute();
    $allCustomers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    error_log("All customers in database: " . print_r($allCustomers, true));
    
    $customer = new Customer($conn);
    $user = $customer->getByEmail($email);
    
    error_log("User found: " . print_r($user, true));
    
    if ($user) {
        echo json_encode([
            "success" => true, 
            "profile" => $user,
            "debug" => "Data retrieved successfully for email: " . $email
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "Customer not found",
            "debug" => "No data found for email: " . $email,
            "all_emails" => array_column($allCustomers, 'email')
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false, 
        "message" => "Database error: " . $e->getMessage(),
        "debug" => "PDO Exception occurred"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false, 
        "message" => "General error: " . $e->getMessage(),
        "debug" => "General Exception occurred"
    ]);
} 