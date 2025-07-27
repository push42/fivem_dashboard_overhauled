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
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }

    $db = Database::getInstance();
    $pdo = $db->getConnection();

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['taskId']) || empty($input['taskId'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Task ID is required']);
        exit;
    }

    $taskId = $input['taskId'];

    // First, get the current status
    $stmt = $pdo->prepare("SELECT completed FROM todo_tasks WHERE id = ?");
    $stmt->execute([$taskId]);
    $task = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$task) {
        http_response_code(404);
        echo json_encode(['error' => 'Task not found']);
        exit;
    }

    // Toggle the completed status
    $newStatus = !$task['completed'];
    $completedAt = $newStatus ? 'NOW()' : 'NULL';

    $stmt = $pdo->prepare("
        UPDATE todo_tasks
        SET completed = ?,
            completed_at = " . $completedAt . ",
            updated_at = NOW()
        WHERE id = ?
    ");
    $stmt->execute([$newStatus, $taskId]);

    // Return the updated task
    $stmt = $pdo->prepare("
        SELECT id, title as task, description, completed, created_at, due_date, priority
        FROM todo_tasks
        WHERE id = ?
    ");
    $stmt->execute([$taskId]);
    $updatedTask = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Task updated successfully',
        'task' => $updatedTask
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to update task: ' . $e->getMessage()
    ]);
}

// Clean output and send
$output = ob_get_clean();
header('Content-Type: application/json');
echo $output;
?>
