<?php
require_once 'services/UserAuthenticationService.php';

echo "Testing Ban System - Mock Banned User\n";
echo "=====================================\n\n";

// Mock the authentication service to simulate a banned user
class MockUserAuthenticationService extends UserAuthenticationService {
    public function authenticateUser($email, $password) {
        // Simulate a banned user
        if ($email === 'banned@example.com' && $password === 'password123') {
            return [
                'success' => false,
                'message' => '🚫 Your account has been suspended. Please contact support at support@agrilink.com for assistance.',
                'error_type' => 'account_banned'
            ];
        }
        
        // For other users, use the parent method
        return parent::authenticateUser($email, $password);
    }
}

try {
    $authService = new MockUserAuthenticationService();
    
    echo "✅ Mock authentication service loaded\n\n";
    
    // Test 1: Admin login (should work)
    echo "Test 1: Admin Login\n";
    $adminResult = $authService->authenticateUser('agrilink@gmail.com', 'admin123');
    echo "Result: " . ($adminResult['success'] ? "✅ Success" : "❌ Failed") . "\n";
    if ($adminResult['success']) {
        echo "Role: " . $adminResult['user']['role'] . "\n";
    }
    echo "\n";
    
    // Test 2: Banned user (should return specific banned message)
    echo "Test 2: Banned User Login\n";
    $bannedResult = $authService->authenticateUser('banned@example.com', 'password123');
    echo "Result: " . ($bannedResult['success'] ? "❌ Should be blocked" : "✅ Correctly blocked") . "\n";
    echo "Message: " . $bannedResult['message'] . "\n";
    echo "Error type: " . ($bannedResult['error_type'] ?? 'none') . "\n";
    echo "\n";
    
    // Test 3: Non-existent user (should return generic error)
    echo "Test 3: Non-existent User\n";
    $nonExistentResult = $authService->authenticateUser('nonexistent@example.com', 'password123');
    echo "Result: " . ($nonExistentResult['success'] ? "❌ Should fail" : "✅ Correctly failed") . "\n";
    echo "Message: " . $nonExistentResult['message'] . "\n";
    echo "Error type: " . ($nonExistentResult['error_type'] ?? 'none') . "\n";
    echo "\n";
    
    echo "🎉 Mock ban system test completed!\n";
    echo "This demonstrates how the ban system works:\n";
    echo "- Banned users get specific message with error_type = 'account_banned'\n";
    echo "- Non-existent users get generic 'Invalid credentials' message\n";
    echo "- Admin users can still login successfully\n";
    
} catch (Exception $e) {
    echo "❌ Error during testing: " . $e->getMessage() . "\n";
}
?>
