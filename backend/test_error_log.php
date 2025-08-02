<?php
echo "Error log location: " . ini_get('error_log') . "\n";
echo "Log errors enabled: " . (ini_get('log_errors') ? 'Yes' : 'No') . "\n";
echo "Display errors: " . ini_get('display_errors') . "\n";

// Test error logging
error_log("TEST ERROR LOG MESSAGE");
echo "Test error logged\n";
?>
