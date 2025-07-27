<?php
/**
 * Logout API Endpoint
 * Handles user logout and session cleanup
 */

require_once 'config/database.php';
require_once 'auth/auth_helper.php';
require_once 'cors_helper.php';

// Initialize CORS
initCors();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    session_start();

    $username = $_SESSION['username'] ?? null;
    $userId = $_SESSION['user_id'] ?? null;

    if ($username && $userId) {
        // Get database connection
        $database = Database::getInstance();
        $db = $database->getConnection();

        // Remove from online users
        $stmt = $db->prepare("DELETE FROM online_users WHERE username = ?");
        $stmt->execute([$username]);

        // Log logout activity
        logUserActivity($db, $userId, $username, 'logout', [
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ]);
    }

    // Destroy session
    session_destroy();

    echo json_encode([
        'success' => true,
        'message' => 'Logged out successfully'
    ]);

} catch (Exception $e) {
    error_log("Logout error: " . $e->getMessage());

    // Force destroy session even on error
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Logout failed',
        'error' => 'Internal server error'
    ]);
}
?>
