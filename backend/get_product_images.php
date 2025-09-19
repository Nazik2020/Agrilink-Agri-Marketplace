<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    // Get product ID from query parameter
    if (!isset($_GET['productId']) || empty($_GET['productId'])) {
        echo json_encode([
            "success" => false,
            "message" => "Product ID is required"
        ]);
        exit;
    }

    $productId = intval($_GET['productId']);

    if ($productId <= 0) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid product ID"
        ]);
        exit;
    }

    // PDO VERSION
    if ($conn instanceof PDO) {
        // Check if updated_at column exists, if not use created_at
        $checkColumnSql = "SHOW COLUMNS FROM products LIKE 'updated_at'";
        $checkStmt = $conn->prepare($checkColumnSql);
        $checkStmt->execute();
        $hasUpdatedAt = $checkStmt->rowCount() > 0;
        
        $timeColumn = $hasUpdatedAt ? 'updated_at' : 'created_at';
        
        $sql = "SELECT product_images, {$timeColumn} as timestamp FROM products WHERE id = :productId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':productId', $productId, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$result) {
                echo json_encode([
                    "success" => false,
                    "message" => "Product not found"
                ]);
                exit;
            }
            
            $images = [];
            
            // Debug: Log the raw product_images data
            error_log("Product ID: $productId, Raw product_images data: " . $result['product_images']);
            
            if (!empty($result['product_images'])) {
                $imageArray = json_decode($result['product_images'], true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    error_log("JSON decode error for product $productId: " . json_last_error_msg());
                    echo json_encode([
                        "success" => false,
                        "message" => "Invalid image data format"
                    ]);
                    exit;
                }
                
                if (is_array($imageArray) && count($imageArray) > 0) {
                    foreach ($imageArray as $index => $imagePath) {
                        // Clean the path - remove any leading slashes
                        $cleanPath = ltrim($imagePath, '/');
                        
                        // Create the full server path for file existence check
                        $serverPath = __DIR__ . '/../' . $cleanPath;
                        
                        // Create the URL path for the frontend
                        $urlPath = 'http://localhost/Agrilink-Agri-Marketplace/backend/' . $cleanPath;
                        
                        // Check if file exists
                        if (file_exists($serverPath)) {
                            $images[] = [
                                'id' => $index,
                                'image_path' => $cleanPath,
                                'full_url' => $urlPath,
                                'server_path' => $serverPath // Debug info
                            ];
                        } else {
                            // Log missing image with full path info
                            error_log("Missing image file for product $productId: Server path: $serverPath, Original path: $imagePath");
                        }
                    }
                }
            }
            
            echo json_encode([
                "success" => true,
                "images" => $images,
                "count" => count($images),
                "product_id" => $productId,
                "debug" => [
                    "raw_data" => $result['product_images'],
                    "decoded_array" => isset($imageArray) ? $imageArray : null
                ]
            ]);
        } else {
            $errorInfo = $stmt->errorInfo();
            echo json_encode([
                "success" => false,
                "message" => "Failed to fetch images",
                "error" => $errorInfo[2]
            ]);
        }
    }
    // MYSQLI VERSION
    else {
        // Check if updated_at column exists
        $checkColumnSql = "SHOW COLUMNS FROM products LIKE 'updated_at'";
        $checkResult = $conn->query($checkColumnSql);
        $hasUpdatedAt = $checkResult->num_rows > 0;
        
        $timeColumn = $hasUpdatedAt ? 'updated_at' : 'created_at';
        
        $sql = "SELECT product_images, {$timeColumn} as timestamp FROM products WHERE id = ?";
        $stmt = $conn->prepare($sql);
        
        if (!$stmt) {
            echo json_encode([
                "success" => false,
                "message" => "Failed to prepare statement",
                "error" => $conn->error
            ]);
            exit;
        }
        
        $stmt->bind_param("i", $productId);
        
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            
            if (!$row) {
                echo json_encode([
                    "success" => false,
                    "message" => "Product not found"
                ]);
                exit;
            }
            
            $images = [];
            
            // Debug: Log the raw product_images data
            error_log("Product ID: $productId, Raw product_images data: " . $row['product_images']);
            
            if (!empty($row['product_images'])) {
                $imageArray = json_decode($row['product_images'], true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    error_log("JSON decode error for product $productId: " . json_last_error_msg());
                    echo json_encode([
                        "success" => false,
                        "message" => "Invalid image data format"
                    ]);
                    exit;
                }
                
                if (is_array($imageArray) && count($imageArray) > 0) {
                    foreach ($imageArray as $index => $imagePath) {
                        // Clean the path - remove any leading slashes
                        $cleanPath = ltrim($imagePath, '/');
                        
                        // Create the full server path for file existence check
                        $serverPath = __DIR__ . '/../' . $cleanPath;
                        
                        // Create the URL path for the frontend
                        $urlPath = 'http://localhost/Agrilink-Agri-Marketplace/backend/' . $cleanPath;
                        
                        // Check if file exists
                        if (file_exists($serverPath)) {
                            $images[] = [
                                'id' => $index,
                                'image_path' => $cleanPath,
                                'full_url' => $urlPath,
                                'server_path' => $serverPath // Debug info
                            ];
                        } else {
                            // Log missing image with full path info
                            error_log("Missing image file for product $productId: Server path: $serverPath, Original path: $imagePath");
                        }
                    }
                }
            }
            
            echo json_encode([
                "success" => true,
                "images" => $images,
                "count" => count($images),
                "product_id" => $productId,
                "debug" => [
                    "raw_data" => $row['product_images'],
                    "decoded_array" => isset($imageArray) ? $imageArray : null
                ]
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to fetch images",
                "error" => $stmt->error
            ]);
        }
        
        $stmt->close();
    }

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Server error occurred",
        "error" => $e->getMessage()
    ]);
} catch (Error $e) {
    echo json_encode([
        "success" => false,
        "message" => "Fatal error occurred",
        "error" => $e->getMessage()
    ]);
}

// Close connection if it's MySQLi
if (isset($conn) && !($conn instanceof PDO)) {
    $conn->close();
}
?>