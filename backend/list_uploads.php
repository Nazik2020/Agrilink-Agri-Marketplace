<?php
// list_uploads.php
header('Content-Type: text/plain; charset=UTF-8');
$dir = __DIR__ . '/uploads/products/';
echo "Listing files in: $dir\n\n";
if (!is_dir($dir)) {
    echo "Directory does not exist.";
    exit;
}
$files = scandir($dir);
foreach ($files as $file) {
    if ($file !== '.' && $file !== '..') {
        echo $file . "\n";
    }
}
?>
