<?php
/**
 * Fix cart_items table structure to ensure cart_item_id is properly set
 */

require_once __DIR__ . '/db.php';

try {
    echo "Fixing cart_items table structure...\n";
    
    // First, let's see the current structure
    $stmt = $conn->query("DESCRIBE cart_items");
    $structure = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Current cart_items structure:\n";
    foreach ($structure as $column) {
        echo "- " . $column['Field'] . " (" . $column['Type'] . ") " . $column['Key'] . " " . $column['Extra'] . "\n";
    }
    
    // Update existing null cart_item_id values using my_row_id
    $stmt = $conn->prepare("UPDATE cart_items SET cart_item_id = my_row_id WHERE cart_item_id IS NULL");
    $result = $stmt->execute();
    $updatedRows = $stmt->rowCount();
    
    echo "Updated {$updatedRows} rows with null cart_item_id\n";
    
    // Verify the fix
    $stmt = $conn->query("SELECT COUNT(*) as null_count FROM cart_items WHERE cart_item_id IS NULL");
    $nullCount = $stmt->fetch(PDO::FETCH_ASSOC)['null_count'];
    
    echo "Remaining null cart_item_id values: {$nullCount}\n";
    
    if ($nullCount == 0) {
        echo "SUCCESS: All cart_item_id values are now properly set!\n";
    } else {
        echo "WARNING: Some cart_item_id values are still null\n";
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>
