<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!isset($data['productId'])) {
        echo json_encode(["success" => false, "message" => "Missing productId"]);
        exit;
    }

    $productId = intval($data['productId']);

    // PDO VERSION - Use this if your db.php creates a PDO connection
    if ($conn instanceof PDO) {
        $sql = "UPDATE products SET status = 'deleted' WHERE id = :productId";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            echo json_encode([
                "success" => false,
                "message" => "Failed to prepare statement"
            ]);
            exit;
        }
        $stmt->bindParam(':productId', $productId, PDO::PARAM_INT);
        if ($stmt->execute()) {
            $rowsAffected = $stmt->rowCount();
            if ($rowsAffected > 0) {
                echo json_encode(["success" => true, "message" => "Product marked as deleted (soft delete)"]);
            } else {
                echo json_encode(["success" => false, "message" => "No product found with this ID"]);
            }
        } else {
            $errorInfo = $stmt->errorInfo();
            echo json_encode([
                "success" => false,
                "message" => "Failed to mark product as deleted",
                "error" => $errorInfo[2]
            ]);
        }
    } 
    // MYSQLI VERSION - Use this if your db.php creates a MySQLi connection
    else {
        $sql = "UPDATE products SET status = 'deleted' WHERE id = ?";
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
            if ($stmt->affected_rows > 0) {
                echo json_encode(["success" => true, "message" => "Product marked as deleted (soft delete)"]);
            } else {
                echo json_encode(["success" => false, "message" => "No product found with this ID"]);
            }
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to mark product as deleted",
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
}

// Close connection if it's MySQLi
if (isset($conn) && !($conn instanceof PDO)) {
    $conn->close();
}
?>