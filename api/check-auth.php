<?php
/**
 * Check Authentication Status API Endpoint
 * Returns current user authentication status
 */

require_once 'config/database.php';
require_once 'auth/auth_helper.php';
require_once 'cors_helper.php';

// Clean any output buffering and start fresh
if (ob_get_level()) {
    ob_end_clean();
}
ob_start();

// Initialize CORS
initCors();

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    session_start();

    // Check if user is logged in
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['username'])) {
        echo json_encode([
            'authenticated' => false,
            'message' => 'Not authenticated'
        ]);
        exit();
    }

    // Get database connection
    $database = Database::getInstance();
    $db = $database->getConnection();

    // Verify user still exists and is active
    $query = "SELECT id, username, name, email, rank, avatar_url, last_login, is_active
              FROM staff_accounts
              WHERE id = ? AND is_active = ?";

    $stmt = $db->prepare($query);
    $stmt->execute([$_SESSION['user_id'], true]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        // User no longer exists or is inactive, clear session
        session_destroy();
        echo json_encode([
            'authenticated' => false,
            'message' => 'User account not found or inactive'
        ]);
        exit();
    }

    // Update session data if needed
    $_SESSION['username'] = $user['username'];
    $_SESSION['rank'] = $user['rank'];
    $_SESSION['name'] = $user['name'];

    // Return user data
    echo json_encode([
        'authenticated' => true,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'name' => $user['name'],
            'email' => $user['email'],
            'rank' => $user['rank'],
            'avatar_url' => $user['avatar_url'],
            'last_login' => $user['last_login']
        ]
    ]);

} catch (Exception $e) {
    error_log("Check auth error: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'authenticated' => false,
        'error' => 'Internal server error'
    ]);
}

// Clean output and send
$output = ob_get_clean();
header('Content-Type: application/json');
echo $output;
