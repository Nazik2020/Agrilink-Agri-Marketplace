<?php
echo "Document Root: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'Not set') . "\n";
echo "Script path: " . __FILE__ . "\n";
echo "Current working directory: " . getcwd() . "\n";
?>
