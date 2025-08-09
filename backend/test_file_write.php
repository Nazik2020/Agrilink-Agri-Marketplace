<?php
// test_file_write.php
$file = __DIR__ . '/test_write.txt';
file_put_contents($file, "Test file write at " . date('c') . "\n", FILE_APPEND);
echo file_exists($file) ? "File written successfully." : "File write failed.";
?>
