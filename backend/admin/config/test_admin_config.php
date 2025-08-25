<?php
echo "Testing admin_config.php...\n";

try {
    require_once 'admin_config.php';
    echo "admin_config.php included successfully\n";
    
    $adminConfig = new AdminConfig();
    $conn = $adminConfig->getConnection();
    
    if ($conn) {
        echo "Database connection successful!\n";
    } else {
        echo "Database connection failed!\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>