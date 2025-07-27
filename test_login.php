<?php
// Test login API endpoint directly
require_once 'api/config/database.php';
require_once 'api/cors_helper.php';

// Simulate the login request
echo "Testing login API endpoint...\n";

try {
    // Test database connection first
    $db = Database::getInstance();
    $pdo = $db->getConnection();
    echo "✅ Database connection successful\n";

    // Test user lookup
    $username = 'admin';
    $password = 'admin123';

    $stmt = $pdo->prepare("SELECT id, username, password, name, rank, is_active FROM staff_accounts WHERE username = ? AND is_active = true");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo "✅ User found: {$user['username']} ({$user['name']})\n";

        // Test password verification
        if (password_verify($password, $user['password'])) {
            echo "✅ Password verification successful\n";

            // Test session start
            if (!session_id()) {
                session_start();
            }

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['rank'] = $user['rank'];
            $_SESSION['logged_in'] = true;

            echo "✅ Session variables set\n";
            echo "Session ID: " . session_id() . "\n";

            $response = [
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'name' => $user['name'],
                    'rank' => $user['rank']
                ]
            ];

            echo "✅ Login would succeed with response:\n";
            echo json_encode($response, JSON_PRETTY_PRINT) . "\n";

        } else {
            echo "❌ Password verification failed\n";
        }
    } else {
        echo "❌ User not found or inactive\n";
    }

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
