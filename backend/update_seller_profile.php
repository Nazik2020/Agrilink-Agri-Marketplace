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
$address = $_POST['address'] ?? null;
// Email field removed since it cannot be changed

// Validate required fields
if (empty($seller_id)) {
    echo json_encode(["success" => false, "message" => "Seller ID is required"]);
    exit;
}

if (empty($business_name)) {
    echo json_encode(["success" => false, "message" => "Business name is required"]);
    exit;
}

// Handle logo upload
$logo_path = null;
$logo_upload_debug = [];
if (isset($_FILES['business_logo']) && $_FILES['business_logo']['error'] == 0) {
    $target_dir = __DIR__ . "/uploads/logos/";
    $relative_dir = "uploads/logos/";
    if (!is_dir($target_dir)) {
        if (!mkdir($target_dir, 0777, true)) {
            $logo_upload_debug[] = "Failed to create directory: $target_dir";
        } else {
            $logo_upload_debug[] = "Directory created: $target_dir";
        }
    }
    if (!is_writable($target_dir)) {
        $logo_upload_debug[] = "Directory not writable: $target_dir";
    }
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $filetype = mime_content_type($_FILES["business_logo"]["tmp_name"]);
    if (!in_array($filetype, $allowed_types)) {
        $logo_upload_debug[] = "File type not allowed: $filetype";
    } else {
        $file_extension = pathinfo($_FILES["business_logo"]["name"], PATHINFO_EXTENSION);
        $filename = uniqid('logo_', true) . '_' . $seller_id . '.' . $file_extension;
        $target_file = $target_dir . $filename;
        $relative_file = $relative_dir . $filename;
        $logo_upload_debug[] = "Attempting to move file to: $target_file";
        if (move_uploaded_file($_FILES["business_logo"]["tmp_name"], $target_file)) {
            $logo_upload_debug[] = "File moved successfully: $target_file";
            $logo_path = $relative_file;
        } else {
            $logo_upload_debug[] = "Failed to move file: " . $_FILES["business_logo"]["name"] . " to $target_file";
        }
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

    // Update seller profile (email field removed from update)
    if ($logo_path) {
        $sql = "UPDATE sellers SET username=?, business_name=?, business_description=?, country=?, contact_number=?, address=?, business_logo=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute([$username, $business_name, $business_description, $country, $contact_number, $address, $logo_path, $seller_id]);
    } else {
        $sql = "UPDATE sellers SET username=?, business_name=?, business_description=?, country=?, contact_number=?, address=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute([$username, $business_name, $business_description, $country, $contact_number, $address, $seller_id]);
    }
    
    if ($result) {
        echo json_encode([
            "success" => true, 
            "message" => "Profile updated successfully",
            "logo_path" => $logo_path,
            "logo_upload_debug" => $logo_upload_debug
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update profile", "logo_upload_debug" => $logo_upload_debug]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
