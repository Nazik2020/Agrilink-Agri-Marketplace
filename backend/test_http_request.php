<?php
/**
 * Test the actual checkout_api.php with HTTP request
 */

$url = 'http://localhost/backend/checkout_api.php';

$data = [
    'action' => 'create_payment_intent',
    'customer_id' => 4,
    'billing_name' => 'Nawas Mohamed Iflal',
    'billing_email' => 'mohamediflal037@gmail.com',
    'billing_address' => '47 12A School lane, Hirimbura, Galle',
    'billing_postal_code' => '20000',
    'billing_country' => 'Afghanistan',
    'cart_items' => [
        [
            'product_id' => 44,
            'quantity' => 1,
            'price' => 10
        ],
        [
            'product_id' => 48,
            'quantity' => 1,
            'price' => 80
        ]
    ],
    'total_amount' => 90
];

echo "=== TESTING REAL HTTP REQUEST ===\n";
echo "URL: $url\n";
echo "Data: " . json_encode($data, JSON_PRETTY_PRINT) . "\n\n";

// Use cURL to make the request
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen(json_encode($data))
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
if ($error) {
    echo "cURL Error: $error\n";
}

echo "Response: $response\n";

// Try to decode the response
$responseData = json_decode($response, true);
if ($responseData) {
    echo "Decoded Response: " . json_encode($responseData, JSON_PRETTY_PRINT) . "\n";
} else {
    echo "Failed to decode JSON response\n";
}
?>
