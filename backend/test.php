<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

echo json_encode([
    'success' => true,
    'message' => 'Server is working!',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
