
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
    // Handle both JSON and FormData requests
    $isFormData = isset($_POST['productId']);

    if ($isFormData) {
        // FormData request
        $productId = intval($_POST['productId']);
        $productName = trim($_POST['product_name']);
        $productDescription = trim($_POST['product_description']);
        $price = floatval($_POST['price']);
        $stock = intval($_POST['stock']);
        $category = trim($_POST['category']);
        $specialOffer = isset($_POST['special_offer']) ? trim($_POST['special_offer']) : '';
    } else {
        // JSON request (backward compatibility)
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            echo json_encode([
                "success" => false,
                "message" => "Invalid JSON data",
                "error" => json_last_error_msg()
            ]);
            exit;
        }

        $productId = intval($data['productId']);
        $productName = trim($data['product_name']);
        $productDescription = trim($data['product_description']);
        $price = floatval($data['price']);
        $stock = intval($data['stock']);
        $category = trim($data['category']);
        $specialOffer = isset($data['special_offer']) ? trim($data['special_offer']) : '';
    }

    // Validate required fields
    if (!$productId || !$productName || !$productDescription || !$category) {
        echo json_encode([
            "success" => false, 
            "message" => "Missing required fields"
        ]);
        exit;
    }

    // Additional validation
    if ($price < 0) {
        echo json_encode([
            "success" => false, 
            "message" => "Price cannot be negative"
        ]);
        exit;
    }

    if ($stock < 0) {
        echo json_encode([
            "success" => false, 
            "message" => "Stock quantity cannot be negative"
        ]);
        exit;
    }

    // Validate category
    $validCategories = ["Products", "Seeds", "Offers", "Fertilizer"];
    if (!in_array($category, $validCategories)) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid category selected"
        ]);
        exit;
    }

    // Begin database transaction
    if ($conn instanceof PDO) {
        $conn->beginTransaction();

        try {
            // Check if updated_at column exists
            $checkColumnSql = "SHOW COLUMNS FROM products LIKE 'updated_at'";
            $checkStmt = $conn->prepare($checkColumnSql);
            $checkStmt->execute();
            $hasUpdatedAt = $checkStmt->rowCount() > 0;

            // Build SQL based on whether updated_at column exists
            if ($hasUpdatedAt) {
                $sql = "UPDATE products SET 
                        product_name = :product_name,
                        product_description = :product_description,
                        price = :price,
                        stock = :stock,
                        category = :category,
                        special_offer = :special_offer,
                        updated_at = NOW()
                        WHERE id = :productId";
            } else {
                $sql = "UPDATE products SET 
                        product_name = :product_name,
                        product_description = :product_description,
                        price = :price,
                        stock = :stock,
                        category = :category,
                        special_offer = :special_offer
                        WHERE id = :productId";
            }

            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':product_name', $productName, PDO::PARAM_STR);
            $stmt->bindParam(':product_description', $productDescription, PDO::PARAM_STR);
            $stmt->bindParam(':price', $price, PDO::PARAM_STR);
            $stmt->bindParam(':stock', $stock, PDO::PARAM_INT);
            $stmt->bindParam(':category', $category, PDO::PARAM_STR);
            $stmt->bindParam(':special_offer', $specialOffer, PDO::PARAM_STR);
            $stmt->bindParam(':productId', $productId, PDO::PARAM_INT);

            if (!$stmt->execute()) {
                $conn->rollBack();
                $errorInfo = $stmt->errorInfo();
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to update product",
                    "error" => $errorInfo[2]
                ]);
                exit;
            }

            $conn->commit();

            echo json_encode([
                "success" => true, 
                "message" => "Product updated successfully"
            ]);

        } catch (Exception $e) {
            $conn->rollBack();
            throw $e;
        }

    } else {
        // MySQLi version
        $conn->autocommit(FALSE);

        try {
            // Check if updated_at column exists
            $checkColumnSql = "SHOW COLUMNS FROM products LIKE 'updated_at'";
            $checkResult = $conn->query($checkColumnSql);
            $hasUpdatedAt = $checkResult->num_rows > 0;

            // Build SQL based on whether updated_at column exists
            if ($hasUpdatedAt) {
                $sql = "UPDATE products SET 
                        product_name = ?,
                        product_description = ?,
                        price = ?,
                        stock = ?,
                        category = ?,
                        special_offer = ?,
                        updated_at = NOW()
                        WHERE id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ssdissi", $productName, $productDescription, $price, $stock, $category, $specialOffer, $productId);
            } else {
                $sql = "UPDATE products SET 
                        product_name = ?,
                        product_description = ?,
                        price = ?,
                        stock = ?,
                        category = ?,
                        special_offer = ?
                        WHERE id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ssdissi", $productName, $productDescription, $price, $stock, $category, $specialOffer, $productId);
            }

            if (!$stmt) {
                $conn->rollback();
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to prepare update statement",
                    "error" => $conn->error
                ]);
                exit;
            }

            if (!$stmt->execute()) {
                $conn->rollback();
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to update product",
                    "error" => $stmt->error
                ]);
                exit;
            }
            $stmt->close();

            $conn->commit();

            echo json_encode([
                "success" => true, 
                "message" => "Product updated successfully"
            ]);

        } catch (Exception $e) {
            $conn->rollback();
            throw $e;
        } finally {
            $conn->autocommit(TRUE);
        }
    }

} catch (Exception $e) {
    error_log("Update product exception: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Server error occurred",
        "error" => $e->getMessage()
    ]);
} catch (Error $e) {
    error_log("Update product fatal error: " . $e->getMessage());
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