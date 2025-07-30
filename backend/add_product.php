<?php
header("Content-Type: application/json");

$response = [
    "success" => false,
    "message" => "",
    "debug_info" => []
];

try {
    require_once("db.php");

    $seller_id = isset($_POST['seller_id']) ? trim($_POST['seller_id']) : null;
    $product_name = isset($_POST['product_name']) ? trim($_POST['product_name']) : null;
    $product_description = isset($_POST['product_description']) ? trim($_POST['product_description']) : null;
    $price = isset($_POST['price']) ? trim($_POST['price']) : null;
    $special_offer = isset($_POST['special_offer']) ? trim($_POST['special_offer']) : null;
    $category = isset($_POST['category']) ? trim($_POST['category']) : null;

    // Handle multiple image uploads
    $image_paths = [];
    if (isset($_FILES['product_images'])) {
        $target_dir = __DIR__ . "/uploads/products/";
        $relative_dir = "uploads/products/";
        $upload_debug = [];
        $upload_debug[] = "Target dir: $target_dir";

        if (!is_dir($target_dir)) {
            $upload_debug[] = "Target dir does not exist, attempting to create...";
            if (!mkdir($target_dir, 0777, true)) {
                $upload_debug[] = "Failed to create directory: $target_dir";
            } else {
                $upload_debug[] = "Directory created: $target_dir";
            }
        } else {
            $upload_debug[] = "Target dir exists.";
        }

        if (!is_writable($target_dir)) {
            $upload_debug[] = "Directory not writable: $target_dir";
        } else {
            $upload_debug[] = "Directory is writable: $target_dir";
        }

        $files = $_FILES['product_images'];
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $upload_debug[] = "Files received: " . print_r($files['name'], true);

        for ($i = 0; $i < count($files['name']); $i++) {
            $upload_debug[] = "Processing file: " . $files['name'][$i];

            if ($files['error'][$i] === 0) {
                $filetype = mime_content_type($files['tmp_name'][$i]);
                $upload_debug[] = "File type: $filetype";

                if (!in_array($filetype, $allowed_types)) {
                    $upload_debug[] = "File type not allowed: " . $filetype;
                    continue; // skip non-image files
                }

                $ext = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
                $filename = uniqid('prod_', true) . '.' . $ext;
                $target_file = $target_dir . $filename;
                $relative_file = $relative_dir . $filename;
                $upload_debug[] = "Attempting to move file to: $target_file";

                if (move_uploaded_file($files['tmp_name'][$i], $target_file)) {
                    $upload_debug[] = "File moved successfully: $target_file";
                    $image_paths[] = $relative_file;
                } else {
                    $upload_debug[] = "Failed to move file: " . $files['name'][$i] . " to $target_file";
                }
            } else {
                $upload_debug[] = "File upload error for " . $files['name'][$i] . ": error code " . $files['error'][$i];
            }
        }
    }

    $image_paths_json = json_encode($image_paths);

    $stmt = $pdo->prepare("INSERT INTO products (seller_id, product_name, product_description, price, special_offer, category, image_paths) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $success = $stmt->execute([$seller_id, $product_name, $product_description, $price, $special_offer, $category, $image_paths_json]);
    $errorInfo = $stmt->errorInfo();

    echo json_encode([
        "success" => $success,
        "error" => $errorInfo,
        "debug" => [
            "seller_id" => $seller_id,
            "product_name" => $product_name,
            "product_description" => $product_description,
            "price" => $price,
            "special_offer" => $special_offer,
            "category" => $category,
            "image_paths_json" => $image_paths_json,
            "_POST" => $_POST,
            "_FILES" => $_FILES,
            "upload_debug" => isset($upload_debug) ? $upload_debug : null
        ]
    ]);
} catch (Exception $e) {
    $response["success"] = false;
    $response["message"] = $e->getMessage();
    $response["exception"] = $e->getTraceAsString();
    echo json_encode($response);
}
