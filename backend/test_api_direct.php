<?php
/**
 * Test checkout_api.php directly
 */

// Simulate the same POST request that the frontend makes
$_SERVER['REQUEST_METHOD'] = 'POST';

// Simulate the frontend data
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
            'product_id' => 48,
            'quantity' => 1,
            'price' => 80
        ]
    ],
    'total_amount' => 90
];

// Set up a temporary input stream
$inputData = json_encode($frontendData);
$tempStream = fopen('php://memory', 'r+');
fwrite($tempStream, $inputData);
rewind($tempStream);

// Override php://input
stream_wrapper_unregister('php');
stream_wrapper_register('php', 'TestPhpInputWrapper');

class TestPhpInputWrapper {
    private $position = 0;
    private static $data = '';
    
    public static function setData($data) {
        self::$data = $data;
    }
    
    public function stream_open($path, $mode, $options, &$opened_path) {
        if ($path === 'php://input') {
            return true;
        }
        return false;
    }
    
    public function stream_read($count) {
        $ret = substr(self::$data, $this->position, $count);
        $this->position += strlen($ret);
        return $ret;
    }
    
    public function stream_eof() {
        return $this->position >= strlen(self::$data);
    }
    
    public function stream_stat() {
        return array();
    }
}

TestPhpInputWrapper::setData($inputData);

echo "=== TESTING CHECKOUT_API.PHP DIRECTLY ===\n";
echo "Input data: " . $inputData . "\n\n";

// Include and execute the checkout_api.php
ob_start();
include __DIR__ . '/checkout_api.php';
$output = ob_get_clean();

echo "Output from checkout_api.php:\n";
echo $output . "\n";

// Restore the original php stream wrapper
stream_wrapper_restore('php');
?>
