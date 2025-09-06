<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'user_management/UserManager.php';

try {
    echo "Testing UserManager connection...\n";
    
    $userManager = new UserManager();
    echo "UserManager created successfully\n";
    
    // Test with a sample user (you'll need to replace with actual user ID)
    $testUserId = 1; // Replace with actual user ID from your database
    $testUserType = 'customer'; // or 'seller'
    $testStatus = 'suspended';
    
    echo "Testing updateUserStatus with:\n";
    echo "User ID: $testUserId\n";
    echo "User Type: $testUserType\n";
    echo "Status: $testStatus\n";
    
    $result = $userManager->updateUserStatus($testUserId, $testUserType, $testStatus);
    
    echo "Result: " . json_encode($result, JSON_PRETTY_PRINT) . "\n";
    
    // Test getting user details
    echo "\nTesting getUserDetails...\n";
    $userDetails = $userManager->getUserDetails($testUserId, $testUserType);
    echo "User Details: " . json_encode($userDetails, JSON_PRETTY_PRINT) . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>

