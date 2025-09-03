<?php
echo "Testing db.php inclusion from admin/config directory...\n";

// Check if the file exists
$path = '../../db.php';
echo "Checking path: $path\n";
echo "File exists: " . (file_exists($path) ? "YES" : "NO") . "\n";

// Try to include the file
if (file_exists($path)) {
    try {
        require_once $path;
        echo "db.php included successfully\n";
        echo "getDbConnection function exists: " . (function_exists('getDbConnection') ? "YES" : "NO") . "\n";
    } catch (Exception $e) {
        echo "Error including db.php: " . $e->getMessage() . "\n";
    }
} else {
    echo "db.php file not found\n";
}
?>