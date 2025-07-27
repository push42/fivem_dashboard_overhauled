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

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['message']) || !isset($input['username'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Message and username are required'
        ]);
        exit();
    }

    $db = Database::getInstance();
    $pdo = $db->getConnection();

    // Insert new message
    $stmt = $pdo->prepare("
        INSERT INTO chat_messages (username, avatar_url, message, rank, timestamp)
        VALUES (?, ?, ?, ?, NOW())
    ");

    $avatar_url = $input['avatar_url'] ?? 'default_avatar.png';
    $rank = $input['rank'] ?? 'User';

    // Validate rank
    $validRanks = ['Owner', 'Admin', 'Moderator', 'Supporter', 'User', 'VIP'];
    if (!in_array($rank, $validRanks)) {
        $rank = 'User';
    }

    $stmt->execute([
        $input['username'],
        $avatar_url,
        $input['message'],
        $rank
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Message saved successfully'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to save message: ' . $e->getMessage()
    ]);
}

// Clean output and send
$output = ob_get_clean();
header('Content-Type: application/json');
echo $output;
