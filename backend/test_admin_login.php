<?php
require_once 'services/UserAuthenticationService.php';

echo "Testing Admin Login (No DB Required)\n";
echo "====================================\n\n";

try {
    $authService = new UserAuthenticationService();
    
    echo "✅ Authentication service loaded\n\n";
    
    // Test admin login (should work without DB)
    echo "Test: Admin Login\n";
    $adminResult = $authService->authenticateUser('agrilink@gmail.com', 'admin123');
    echo "Admin login result: " . ($adminResult['success'] ? "✅ Success" : "❌ Failed") . "\n";
    if ($adminResult['success']) {
        echo "User role: " . $adminResult['user']['role'] . "\n";
        echo "Message: " . $adminResult['message'] . "\n";
    } else {
        echo "Error: " . $adminResult['message'] . "\n";
    }
    echo "\n";
    
    // Test wrong admin credentials
    echo "Test: Wrong Admin Credentials\n";
    $wrongAdminResult = $authService->authenticateUser('agrilink@gmail.com', 'wrongpassword');
    echo "Wrong admin result: " . ($wrongAdminResult['success'] ? "❌ Should fail" : "✅ Correctly failed") . "\n";
    echo "Error message: " . $wrongAdminResult['message'] . "\n";
    echo "\n";
    
    echo "🎉 Admin login test completed!\n";
    echo "Admin login works without database connection.\n";
    
} catch (Exception $e) {
    echo "❌ Error during testing: " . $e->getMessage() . "\n";
}
?>
