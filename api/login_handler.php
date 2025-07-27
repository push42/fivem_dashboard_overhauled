<?php
/**
 * Login Handler API Endpoint
 * Handles user authentication
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

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid JSON input'
        ]);
        exit();
    }

    // Validate required fields
    if (!isset($input['username']) || !isset($input['password'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Username and password are required'
        ]);
        exit();
    }

    $username = trim($input['username']);
    $password = $input['password'];

    if (empty($username) || empty($password)) {
        echo json_encode([
            'success' => false,
            'message' => 'Username and password cannot be empty'
        ]);
        exit();
    }

    // Get database connection
    $database = Database::getInstance();
    $db = $database->getConnection();

    // Check for user
    $query = "SELECT id, username, password, name, email, rank, avatar_url, is_active,
                     failed_login_attempts, locked_until
              FROM staff_accounts
              WHERE username = ?";

    $stmt = $db->prepare($query);
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid username or password'
        ]);
        exit();
    }

    // Check if account is active
    if (!$user['is_active']) {
        echo json_encode([
            'success' => false,
            'message' => 'Account is disabled. Please contact an administrator.'
        ]);
        exit();
    }

    // Check if account is locked
    if ($user['locked_until'] && strtotime($user['locked_until']) > time()) {
        $lockTime = date('Y-m-d H:i:s', strtotime($user['locked_until']));
        echo json_encode([
            'success' => false,
            'message' => "Account is locked until {$lockTime}. Please try again later."
        ]);
        exit();
    }

    // Verify password
    if (!password_verify($password, $user['password'])) {
        // Increment failed login attempts
        $newAttempts = $user['failed_login_attempts'] + 1;
        $lockedUntil = null;

        // Lock account after 5 failed attempts for 15 minutes
        if ($newAttempts >= 5) {
            $lockedUntil = date('Y-m-d H:i:s', strtotime('+15 minutes'));
        }

        $updateQuery = "UPDATE staff_accounts
                       SET failed_login_attempts = ?, locked_until = ?
                       WHERE id = ?";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->execute([$newAttempts, $lockedUntil, $user['id']]);

        echo json_encode([
            'success' => false,
            'message' => 'Invalid username or password'
        ]);
        exit();
    }

    // Login successful - reset failed attempts and start session
    $updateQuery = "UPDATE staff_accounts
                   SET failed_login_attempts = 0, locked_until = NULL, last_login = CURRENT_TIMESTAMP
                   WHERE id = ?";
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->execute([$user['id']]);

    // Start session
    session_start();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['rank'] = $user['rank'];
    $_SESSION['name'] = $user['name'];

    // Log successful login
    logUserActivity($db, $user['id'], $user['username'], 'login', [
        'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ]);

    // Return success with user data
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'name' => $user['name'],
            'email' => $user['email'],
            'rank' => $user['rank'],
            'avatar_url' => $user['avatar_url']
        ]
    ]);

} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error'
    ]);
}

// Clean output and send
$output = ob_get_clean();
header('Content-Type: application/json');
echo $output;
