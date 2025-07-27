<?php
/**
 * Registration Handler API Endpoint
 * Handles user registration
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
    // Get JSON input
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (!$input || json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid JSON input'
        ]);
        exit();
    }

    // Validate required fields
    $required = ['username', 'password', 'confirmPassword', 'name', 'email', 'securityCode'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => ucfirst($field) . ' is required'
            ]);
            exit();
        }
    }

    $username = trim($input['username']);
    $password = $input['password'];
    $confirmPassword = $input['confirmPassword'];
    $name = trim($input['name']);
    $email = trim($input['email']);
    $securityCode = trim($input['securityCode']);

    // Validate password match
    if ($password !== $confirmPassword) {
        echo json_encode([
            'success' => false,
            'message' => 'Passwords do not match'
        ]);
        exit();
    }

    // Validate password strength
    if (strlen($password) < 6) {
        echo json_encode([
            'success' => false,
            'message' => 'Password must be at least 6 characters long'
        ]);
        exit();
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email format'
        ]);
        exit();
    }

    // Get database connection
    $database = Database::getInstance();
    $db = $database->getConnection();

    // Check if username already exists
    $checkUserQuery = "SELECT id FROM staff_accounts WHERE username = ?";
    $checkUserStmt = $db->prepare($checkUserQuery);
    $checkUserStmt->execute([$username]);

    if ($checkUserStmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'Username already exists'
        ]);
        exit();
    }

    // Check if email already exists
    $checkEmailQuery = "SELECT id FROM staff_accounts WHERE email = ?";
    $checkEmailStmt = $db->prepare($checkEmailQuery);
    $checkEmailStmt->execute([$email]);

    if ($checkEmailStmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'Email already registered'
        ]);
        exit();
    }

    // Verify security code
    $securityQuery = "SELECT id FROM security_codes WHERE code = ?";
    $securityStmt = $db->prepare($securityQuery);
    $securityStmt->execute([$securityCode]);
    $securityCodeData = $securityStmt->fetch();

    if (!$securityCodeData) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid security code'
        ]);
        exit();
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Determine rank based on security code (you can customize this logic)
    $rank = 'User'; // Default rank
    if (in_array($securityCode, ['123456789', 'ADMIN2024'])) {
        $rank = 'Admin';
    } elseif ($securityCode === 'MOD2024') {
        $rank = 'Moderator';
    } elseif ($securityCode === 'SUPPORT2024') {
        $rank = 'Supporter';
    }

    // Create new user
    $insertQuery = "INSERT INTO staff_accounts (username, password, name, email, rank, security_code_id)
                   VALUES (?, ?, ?, ?, ?, ?)";
    $insertStmt = $db->prepare($insertQuery);
    $insertStmt->execute([$username, $hashedPassword, $name, $email, $rank, $securityCodeData['id']]);

    $userId = $db->lastInsertId();

    // Start session for new user
    session_start();
    $_SESSION['user_id'] = $userId;
    $_SESSION['username'] = $username;
    $_SESSION['rank'] = $rank;
    $_SESSION['name'] = $name;

    // Log registration
    if (function_exists('logUserActivity')) {
        logUserActivity($db, $userId, $username, 'register', [
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ]);
    }

    // Return success with user data
    echo json_encode([
        'success' => true,
        'message' => 'Registration successful',
        'user' => [
            'id' => $userId,
            'username' => $username,
            'name' => $name,
            'email' => $email,
            'rank' => $rank,
            'avatar_url' => null
        ]
    ]);

} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error'
    ]);
}
?>
