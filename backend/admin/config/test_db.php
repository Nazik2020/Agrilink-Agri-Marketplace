<?php
echo "Testing db.php inclusion...\n";

// Try to include the db.php file
$path = '../../db.php';
echo "Checking path: $path\n";
echo "File exists: " . (file_exists($path) ? "YES" : "NO") . "\n";
echo "Real path: " . realpath($path) . "\n";

// Try absolute path
$absolutePath = dirname(__FILE__) . '/../../db.php';
echo "Absolute path: $absolutePath\n";
echo "Absolute file exists: " . (file_exists($absolutePath) ? "YES" : "NO") . "\n";
echo "Absolute real path: " . realpath($absolutePath) . "\n";

if (file_exists($absolutePath)) {
    require_once $absolutePath;
    echo "db.php included successfully\n";
} else {
    echo "db.php could not be included\n";
}
?>