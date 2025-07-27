<?php
/**
 * CORS Helper Functions
 * Handles Cross-Origin Resource Sharing for development and production
 */

/**
 * Set CORS headers based on the request origin
 * Supports both development (localhost:3000) and production (fivem_dashboard.test)
 */
function setCorsHeaders() {
    $allowedOrigins = [
        'http://localhost:3000',               // Development server (legacy)
        'http://localhost:5173',               // Vite development server
        'http://fivem_dashboard.test:3000',    // Development server on custom domain
        'http://fivem_dashboard.test:5173',    // Vite development server on custom domain
        'http://fivem_dashboard.test',         // Development domain
        'https://fivem_dashboard.test',        // Development domain with SSL
        'https://5md.p42.studio'               // Production domain
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    // Set basic headers
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization');
    header('Access-Control-Allow-Credentials: true');

    // Set origin-specific header
    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // For same-origin requests or allowed local development
        header('Access-Control-Allow-Origin: http://fivem_dashboard.test');
    }
}

/**
 * Handle preflight OPTIONS requests
 * Returns true if it was a preflight request (and handled)
 */
function handlePreflightRequest() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        setCorsHeaders();
        http_response_code(200);
        exit();
    }
    return false;
}

/**
 * Validate origin for security
 * Returns true if the origin is allowed
 */
function isOriginAllowed($origin = null) {
    $allowedOrigins = [
        'http://localhost:3000',
        'http://fivem_dashboard.test',
        'https://fivem_dashboard.test'
    ];

    $origin = $origin ?? $_SERVER['HTTP_ORIGIN'] ?? '';
    return in_array($origin, $allowedOrigins);
}

/**
 * Initialize CORS for an API endpoint
 * Call this at the beginning of each API file
 */
function initCors() {
    setCorsHeaders();
    handlePreflightRequest();
}
?>
