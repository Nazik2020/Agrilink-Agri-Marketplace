<?php
/**
 * Centralized CORS Configuration for Session Management
 * Include this file in all backend endpoints that need session support
 */

// Set CORS headers for session support
$allowedOrigins = [
    'http://localhost:5173', // Vite default
    'http://127.0.0.1:5173',
    'http://localhost:3000', // React default
    'http://127.0.0.1:3000'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Fallback for same-origin or when no Origin header provided
    header("Access-Control-Allow-Origin: http://localhost:5173");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configure session cookie BEFORE starting session
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '', // Empty domain allows subdomains and ports
        'secure' => false, // set true in production (HTTPS)
        'httponly' => true,
        'samesite' => 'Lax' // 'Lax' works for same-site navigation
    ]);
    session_start();
}
?>
