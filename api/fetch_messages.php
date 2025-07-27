<?php
require_once 'config/database.php';
require_once 'cors_helper.php';

// Clean any output buffering and start fresh
if (ob_get_level()) {
    ob_end_clean();
}
ob_start();

// Initialize CORS
initCors();

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();

    // Get recent chat messages
    $stmt = $pdo->prepare("
        SELECT username, avatar_url, message, timestamp, rank
        FROM chat_messages
        ORDER BY timestamp DESC
        LIMIT 50
    ");
    $stmt->execute();
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get message statistics
    $statsStmt = $pdo->prepare("
        SELECT
            COUNT(*) as total_messages,
            COUNT(DISTINCT username) as unique_users,
            MAX(timestamp) as last_message
        FROM chat_messages
    ");
    $statsStmt->execute();
    $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'messages' => $messages,
        'stats' => $stats
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch messages: ' . $e->getMessage()
    ]);
}

// Clean output and send
$output = ob_get_clean();
header('Content-Type: application/json');
echo $output;
