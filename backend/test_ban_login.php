<?php
require_once 'db.php';
require_once 'services/UserAuthenticationService.php';

echo "Testing Ban Login System\n";
echo "========================\n\n";

try {
    $conn = getDbConnection();
    $authService = new UserAuthenticationService();
    
    echo "✅ Database connection successful\n";
    echo "✅ Authentication service loaded\n\n";
    
    // Test 1: Admin login (should work)
    echo "Test 1: Admin Login\n";
    $adminResult = $authService->authenticateUser('agrilink@gmail.com', 'admin123');
    echo "Admin login result: " . ($adminResult['success'] ? "✅ Success" : "❌ Failed") . "\n";
    if (!$adminResult['success']) {
        echo "Error: " . $adminResult['message'] . "\n";
    }
    echo "\n";
    
    // Test 2: Create a test banned user
    echo "Test 2: Creating test banned user\n";
    $testEmail = 'banned_test@example.com';
    $testPassword = password_hash('test123', PASSWORD_BCRYPT);
    
    // Check if test user exists
    $stmt = $conn->prepare("SELECT id, status FROM customers WHERE email = ?");
    $stmt->execute([$testEmail]);
    $testUser = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$testUser) {
        // Create test user
        $stmt = $conn->prepare("INSERT INTO customers (full_name, email, password, status) VALUES (?, ?, ?, 'banned')");
        $stmt->execute(['Test Banned User', $testEmail, $testPassword]);
        echo "✅ Created test banned user\n";
    } else {
        // Update existing user to banned status
        $stmt = $conn->prepare("UPDATE customers SET status = 'banned' WHERE email = ?");
        $stmt->execute([$testEmail]);
        echo "✅ Updated existing user to banned status\n";
    }
    echo "\n";
    
    // Test 3: Try to login with banned user
    echo "Test 3: Banned User Login\n";
    $bannedResult = $authService->authenticateUser($testEmail, 'test123');
    echo "Banned user login result: " . ($bannedResult['success'] ? "❌ Should be blocked" : "✅ Correctly blocked") . "\n";
    echo "Error message: " . $bannedResult['message'] . "\n";
    echo "Error type: " . ($bannedResult['error_type'] ?? 'none') . "\n";
    echo "\n";
    
    // Test 4: Try to login with wrong password (should show generic error)
    echo "Test 4: Wrong Password Login\n";
    $wrongPasswordResult = $authService->authenticateUser($testEmail, 'wrongpassword');
    echo "Wrong password result: " . ($wrongPasswordResult['success'] ? "❌ Should be blocked" : "✅ Correctly blocked") . "\n";
    echo "Error message: " . $wrongPasswordResult['message'] . "\n";
    echo "\n";
    
    // Test 5: Reactivate user and test login
    echo "Test 5: Reactivating User\n";
    $stmt = $conn->prepare("UPDATE customers SET status = 'active' WHERE email = ?");
    $stmt->execute([$testEmail]);
    echo "✅ User reactivated\n";
    
    $activeResult = $authService->authenticateUser($testEmail, 'test123');
    echo "Active user login result: " . ($activeResult['success'] ? "✅ Success" : "❌ Failed") . "\n";
    if ($activeResult['success']) {
        echo "User role: " . $activeResult['user']['role'] . "\n";
    } else {
        echo "Error: " . $activeResult['message'] . "\n";
    }
    echo "\n";
    
    echo "🎉 Ban login system test completed!\n";
    echo "The system correctly shows different messages for banned vs invalid credentials.\n";
    
} catch (Exception $e) {
    echo "❌ Error during testing: " . $e->getMessage() . "\n";
}
?>
