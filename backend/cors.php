<?php
/**
 * CORS Helper - Include this at the top of every API file
 * Handles cross-origin requests properly for React development
 */

function setCORSHeaders() {
    // Allow requests from common local dev servers
    $allowed_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:5173",
    ];
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : "";

    // If origin is in allowed list or matches localhost/127.0.0.1 on any port, echo it back
    $isLocalhostPattern = $origin && (preg_match('#^http://localhost(:\d+)?$#', $origin) || preg_match('#^http://127\.0\.0\.1(:\d+)?$#', $origin));
    if (($origin && in_array($origin, $allowed_origins)) || $isLocalhostPattern) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // Fallback to a safe default for non-browser or unspecified origins
        header("Access-Control-Allow-Origin: http://localhost:3000");
    }
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json; charset=UTF-8");
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Call the function
setCORSHeaders();
?>
