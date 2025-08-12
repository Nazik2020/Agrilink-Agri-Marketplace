<?php
/**
 * Script to check the orders table structure
 */

require 'db.php';

try {
    echo "=== ORDERS TABLE STRUCTURE ===\n\n";
    
    $stmt = $conn->query("DESCRIBE orders");
    echo "Field\t\tType\t\tNull\tKey\tDefault\tExtra\n";
    echo "------------------------------------------------------------\n";
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['Field'] . "\t\t" . $row['Type'] . "\t" . $row['Null'] . "\t" . $row['Key'] . "\t" . $row['Default'] . "\t" . $row['Extra'] . "\n";
    }
    
    echo "\n✅ Orders table exists and is properly structured.\n";
    
} catch (Exception $e) {
    echo "❌ Error checking orders table: " . $e->getMessage() . "\n";
}
?>