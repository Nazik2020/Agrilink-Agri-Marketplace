<?php
/**
 * Script to create the orders table in the database
 * This fixes the "Table 'agrilink.orders' doesn't exist" error
 */

require 'db.php';

// Read the SQL file
$sqlFile = 'create_orders_table.sql';
if (!file_exists($sqlFile)) {
    die("SQL file not found: $sqlFile\n");
}

$sqlContent = file_get_contents($sqlFile);

try {
    // Split the SQL content into separate statements
    $statements = array_filter(array_map('trim', explode(';', $sqlContent)));
    
    // Execute each statement
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            $conn->exec($statement);
            echo "Executed: " . substr($statement, 0, 50) . "...\n";
        }
    }
    
    echo "\n✅ Orders table created successfully!\n";
    echo "The 'Table agrilink.orders doesn't exist' error should now be fixed.\n";
    
} catch (Exception $e) {
    echo "❌ Error creating orders table: " . $e->getMessage() . "\n";
    
    // Check if it's a foreign key constraint issue
    if (strpos($e->getMessage(), 'foreign key') !== false) {
        echo "\n⚠️  This error might be due to missing referenced tables (customers, sellers, products).\n";
        echo "Please ensure these tables exist before creating the orders table.\n";
    }
}
?>