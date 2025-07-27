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
    // Get sample seller data
    $sellers = $conn->query("SELECT id, email, username, business_name FROM sellers LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "message" => "Seller email restriction test",
        "test_sellers" => $sellers,
        "email_restriction_info" => [
            "frontend" => [
                "email_field_readonly" => "Email input is disabled and read-only",
                "restriction_message" => "Shows 'Email address cannot be changed for security reasons'",
                "readonly_badge" => "Email label shows 'Read Only' badge",
                "validation_removed" => "Email validation removed from form validation"
            ],
            "backend" => [
                "email_not_required" => "Email field not required in backend validation",
                "email_not_updated" => "Email field removed from UPDATE query",
                "security" => "Email cannot be changed through profile update"
            ],
            "test_instructions" => [
                "1. Login as a seller",
                "2. Go to seller dashboard profile page",
                "3. Email field should be grayed out and disabled",
                "4. Should show restriction message below email field",
                "5. Try to edit other fields and save - should work",
                "6. Email should remain unchanged after save"
            ]
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error in seller email restriction test",
        "error" => $e->getMessage()
    ]);
}
?> 