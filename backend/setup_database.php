<?php
/**
 * Comprehensive Database Setup Script
 * Creates all necessary tables for the Agrilink application
 */

require 'db.php';

echo "=== AGRILINK DATABASE SETUP ===\n\n";

// List of SQL files to execute
$sqlFiles = [
    'create_orders_table.sql',
    'create_flags_table.sql',
    'create_cart_tables.sql'
];

$successCount = 0;
$errorCount = 0;

foreach ($sqlFiles as $sqlFile) {
    echo "Processing $sqlFile...\n";
    
    if (!file_exists($sqlFile)) {
        echo "  ❌ File not found: $sqlFile\n";
        $errorCount++;
        continue;
    }
    
    try {
        $sqlContent = file_get_contents($sqlFile);
        $statements = array_filter(array_map('trim', explode(';', $sqlContent)));
        
        foreach ($statements as $statement) {
            if (!empty($statement)) {
                $conn->exec($statement);
            }
        }
        
        echo "  ✅ Successfully executed $sqlFile\n";
        $successCount++;
        
    } catch (Exception $e) {
        echo "  ❌ Error executing $sqlFile: " . $e->getMessage() . "\n";
        $errorCount++;
    }
    
    echo "\n";
}

echo "=== SETUP COMPLETE ===\n";
echo "Successful: $successCount files\n";
echo "Errors: $errorCount files\n";

if ($errorCount === 0) {
    echo "\n🎉 All database tables have been set up successfully!\n";
    echo "The application should now work without the 'table doesn't exist' errors.\n";
} else {
    echo "\n⚠️  Some files had errors. Please check the output above.\n";
}
?>