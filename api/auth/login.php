<?php
// Modern login endpoint
$data = Request::getBody();
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

// Validate input
if (empty($username) || empty($password)) {
    ApiResponse::error('Username and password are required');
}

try {
    $db = Database::getInstance()->getConnection();

    // Get user from database
    $stmt = $db->prepare("SELECT id, username, password, avatar_url, rank FROM staff_accounts WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        ApiResponse::error('Invalid username or password', 401);
    }

    // Set session data
    Session::set('loggedin', true);
    Session::set('id', $user['id']);
    Session::set('username', $user['username']);
    Session::set('avatar_url', $user['avatar_url']);
    Session::set('rank', $user['rank']);

    // Add user to online users table
    $stmt = $db->prepare("
        INSERT INTO online_users (username, avatar_url, last_seen)
        VALUES (?, ?, NOW())
        ON DUPLICATE KEY UPDATE last_seen = NOW()
    ");
    $stmt->execute([$user['username'], $user['avatar_url']]);

    // Return user data (without password)
    unset($user['password']);
    ApiResponse::success($user, 'Login successful');

} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    ApiResponse::error('Login failed. Please try again.', 500);
}
?>
