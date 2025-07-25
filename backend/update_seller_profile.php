<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

$seller_id = $_POST['seller_id'] ?? null;
$username = $_POST['username'] ?? null;
$business_name = $_POST['business_name'] ?? null;
$business_description = $_POST['business_description'] ?? null;
$country = $_POST['country'] ?? null;
$contact_number = $_POST['contact_number'] ?? null;
$email = $_POST['email'] ?? null;
$address = $_POST['address'] ?? null;

// Validate required fields
if (empty($seller_id)) {
    echo json_encode(["success" => false, "message" => "Seller ID is required"]);
    exit;
}

if (empty($business_name) || empty($email)) {
    echo json_encode(["success" => false, "message" => "Business name and email are required"]);
    exit;
}

// Handle logo upload
$logo_path = null;
if (isset($_FILES['business_logo']) && $_FILES['business_logo']['error'] == 0) {
    $target_dir = "uploads/logos/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    
    $file_extension = pathinfo($_FILES["business_logo"]["name"], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . $seller_id . '.' . $file_extension;
    $target_file = $target_dir . $filename;
    
    if (move_uploaded_file($_FILES["business_logo"]["tmp_name"], $target_file)) {
        $logo_path = $target_file;
    }
}

try {
    // First check if seller exists
    $check_stmt = $conn->prepare("SELECT id FROM sellers WHERE id = ?");
    $check_stmt->execute([$seller_id]);
    if (!$check_stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Seller not found"]);
        exit;
    }

    // Update seller profile
    if ($logo_path) {
        $sql = "UPDATE sellers SET username=?, business_name=?, business_description=?, country=?, contact_number=?, email=?, address=?, business_logo=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute([$username, $business_name, $business_description, $country, $contact_number, $email, $address, $logo_path, $seller_id]);
    } else {
        $sql = "UPDATE sellers SET username=?, business_name=?, business_description=?, country=?, contact_number=?, email=?, address=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute([$username, $business_name, $business_description, $country, $contact_number, $email, $address, $seller_id]);
    }
    
    if ($result) {
        echo json_encode([
            "success" => true, 
            "message" => "Profile updated successfully",
            "logo_path" => $logo_path
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update profile"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
