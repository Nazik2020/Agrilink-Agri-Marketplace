<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Get sample data for testing
    $customers = $conn->query("SELECT id, email, full_name FROM customers LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    $products = $conn->query("SELECT id, name, price FROM products LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    $cartItems = $conn->query("SELECT * FROM cart_items LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "message" => "Buy Now Cart Integration Test",
        "test_data" => [
            "customers" => $customers,
            "products" => $products,
            "cart_items" => $cartItems
        ],
        "integration_info" => [
            "frontend_changes" => [
                "product_details" => [
                    "buy_now_button_removed" => "Buy Now button removed from ProductDetails.jsx",
                    "only_add_to_cart" => "Only 'Add to Cart' button remains"
                ],
                "cart_context" => [
                    "buy_now_state" => "Added showBuyNowModal state to CartContext",
                    "handle_buy_now" => "Added handleBuyNow function with user validation",
                    "toggle_function" => "Added toggleBuyNowModal function"
                ],
                "order_summary" => [
                    "proceed_to_checkout" => "Proceed to Checkout button now triggers buy now",
                    "user_validation" => "Checks if user is logged in as customer",
                    "cart_validation" => "Checks if cart has items"
                ],
                "cart_modal" => [
                    "buy_now_modal" => "BuyNowModal integrated into CartModal",
                    "cart_checkout" => "isCartCheckout prop set to true"
                ]
            ],
            "buy_now_modal_updates" => [
                "cart_support" => "Added isCartCheckout prop to handle cart vs single product",
                "cart_items_display" => "Shows all cart items in order summary",
                "cart_totals" => "Uses cart totals (subtotal, shipping, tax) instead of single product",
                "payment_handling" => "Sends cart items to backend instead of single product",
                "success_step" => "Shows cart items in success confirmation",
                "cart_clear" => "Clears cart after successful payment"
            ],
            "user_flow" => [
                "1. Add to Cart" => "User adds products to cart from product details",
                "2. Open Cart" => "User opens shopping cart modal",
                "3. Proceed to Checkout" => "User clicks 'Proceed to Checkout' button",
                "4. User Validation" => "System checks if user is logged in as customer",
                "5. Cart Validation" => "System checks if cart has items",
                "6. Buy Now Modal" => "BuyNowModal opens with cart items",
                "7. Payment Process" => "User completes payment process",
                "8. Success & Clear" => "Payment successful, cart cleared"
            ],
            "test_instructions" => [
                "1. Login as a customer",
                "2. Go to marketplace and add multiple products to cart",
                "3. Open shopping cart",
                "4. Click 'Proceed to Checkout'",
                "5. Verify BuyNowModal opens with cart items",
                "6. Verify order summary shows all cart items",
                "7. Complete payment process",
                "8. Verify cart is cleared after success"
            ]
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error in buy now cart integration test",
        "error" => $e->getMessage()
    ]);
}
?> 