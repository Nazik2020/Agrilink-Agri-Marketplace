<?php
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/debug.log');
error_log("TEST_LOG: This is a test at " . date('c'));
echo "done";
?>