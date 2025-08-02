<?php
// Test the customer billing data API
echo "Testing get_customer_billing_data.php API\n";
echo "==========================================\n";

// Test with customer ID 4
$testData = [
    'customer_id' => 4,
    'customer_email' => 'mohamediflal037@gmail.com'
];

$url = "http://localhost/agrilink/backend/get_customer_billing_data.php";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "HTTP Code: " . $httpCode . "\n";
if ($error) {
    echo "cURL Error: " . $error . "\n";
}

echo "Response:\n";
echo $response . "\n";

// Also test direct file inclusion
echo "\n\nDirect test:\n";
echo "=============\n";

$_POST = $testData;
$_SERVER['REQUEST_METHOD'] = 'POST';

// Capture output
ob_start();
$input = json_encode($testData);
file_put_contents('php://input', $input);
include 'get_customer_billing_data.php';
$output = ob_get_clean();

echo "Direct output: " . $output . "\n";

?>
