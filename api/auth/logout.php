<?php
// Logout endpoint
try {
    $username = Session::get('username');

    if ($username) {
        // Remove from online users
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("DELETE FROM online_users WHERE username = ?");
        $stmt->execute([$username]);
    }

    Session::destroy();
    ApiResponse::success(null, 'Logged out successfully');

} catch (Exception $e) {
    error_log("Logout error: " . $e->getMessage());
    ApiResponse::error('Logout failed', 500);
}
?>
