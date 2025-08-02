<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'success' => true,
    'message' => 'Checkout API is reachable',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
