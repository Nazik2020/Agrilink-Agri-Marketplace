<?php
/**
 * Test the exact API call that frontend makes
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Simulate the exact POST request from frontend
$_SERVER['REQUEST_METHOD'] = 'POST';

$frontendData = [
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
            'product_id' => 46,
            'quantity' => 1,
            'price' => 20
        ],
        [
            'product_id' => 48,
            'quantity' => 1,
            'price' => 80
        ],
        [
            'product_id' => 49,
            'quantity' => 1,
            'price' => 49
        ],
        [
            'product_id' => 52,
            'quantity' => 1,
            'price' => 34
        ]
    ],
    'total_amount' => 193
];

echo "=== TESTING API CALL SIMULATION ===\n";
echo "Frontend data: " . json_encode($frontendData, JSON_PRETTY_PRINT) . "\n\n";

// Simulate the php://input
$tempFile = tempnam(sys_get_temp_dir(), 'test_input');
file_put_contents($tempFile, json_encode($frontendData));

// Override php://input for testing
class StreamOverride {
    private static $data = '';
    
    public static function setData($data) {
        self::$data = $data;
    }
    
    public static function getData() {
        return self::$data;
    }
}

StreamOverride::setData(json_encode($frontendData));

// Capture output
ob_start();

// Test the input parsing
$input = json_decode(json_encode($frontendData), true);

if (!$input) {
    echo json_encode([
        'success' => false,
        'error' => 'Invalid JSON data'
    ]);
    exit;
}

echo "Parsed input: " . json_encode($input, JSON_PRETTY_PRINT) . "\n\n";

// Test the validation logic from checkout_api.php
$isCartCheckout = isset($input['cart_items']) && is_array($input['cart_items']) && !empty($input['cart_items']);
echo "Is cart checkout: " . ($isCartCheckout ? 'YES' : 'NO') . "\n\n";

if ($isCartCheckout) {
    $required = ['cart_items', 'customer_id', 'billing_name', 'billing_email', 
                'billing_address', 'billing_postal_code', 'billing_country'];
    
    $missingFields = [];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            $missingFields[] = $field;
        }
    }
    
    if (!empty($missingFields)) {
        echo "Missing fields: " . implode(', ', $missingFields) . "\n";
    } else {
        echo "✓ All required fields present\n";
    }
    
    // Validate cart items structure
    $invalidItems = [];
    foreach ($input['cart_items'] as $index => $item) {
        if (empty($item['product_id']) || empty($item['quantity']) || !isset($item['price'])) {
            $invalidItems[] = "Item $index: " . json_encode($item);
        }
    }
    
    if (!empty($invalidItems)) {
        echo "Invalid cart items:\n" . implode("\n", $invalidItems) . "\n";
    } else {
        echo "✓ All cart items valid\n";
    }
}

// Now test the actual CheckoutService
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/services/CheckoutService.php';

try {
    $checkoutService = new CheckoutService($conn);
    echo "\nProcessing with CheckoutService...\n";
    $result = $checkoutService->processCheckout($input);
    echo "Result: " . json_encode($result, JSON_PRETTY_PRINT) . "\n";
} catch (Exception $e) {
    echo "CheckoutService error: " . $e->getMessage() . "\n";
}

$output = ob_get_clean();
echo $output;

// Clean up
unlink($tempFile);
?>
