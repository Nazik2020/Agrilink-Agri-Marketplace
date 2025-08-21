<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

try {
    // Check if postal_code column already exists
    $stmt = $conn->query("SHOW COLUMNS FROM customers LIKE 'postal_code'");
    $columnExists = $stmt->rowCount() > 0;
    
    if (!$columnExists) {
        // Add postal_code column
        $sql = "ALTER TABLE customers ADD COLUMN postal_code VARCHAR(20) AFTER country";
        $conn->exec($sql);
        
        // Update existing records with empty postal_code
        $updateSql = "UPDATE customers SET postal_code = '' WHERE postal_code IS NULL";
        $conn->exec($updateSql);
        
        $message = "Postal code column added successfully";
    } else {
        $message = "Postal code column already exists";
    }
    
    // Verify the column was added
    $stmt = $conn->query("DESCRIBE customers");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get sample customer data to verify
    $sampleCustomers = $conn->query("SELECT id, full_name, email, address, contactno, country, postal_code FROM customers LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "message" => $message,
        "column_exists" => $columnExists,
        "table_structure" => $columns,
        "sample_data" => $sampleCustomers,
        "next_steps" => [
            "1. Test customer profile update with postal code",
            "2. Verify postal code is saved in database",
            "3. Test billing data retrieval with postal code"
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error updating customers table",
        "error" => $e->getMessage()
    ]);
}
?> 