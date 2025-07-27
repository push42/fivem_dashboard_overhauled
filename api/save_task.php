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

    if (!$input || !isset($input['task']) || empty(trim($input['task']))) {
        http_response_code(400);
        echo json_encode(['error' => 'Task title is required']);
        exit;
    }

    $title = trim($input['task']);
    $description = isset($input['description']) ? trim($input['description']) : '';
    $priority = isset($input['priority']) ? ucfirst(strtolower($input['priority'])) : 'Medium';
    $dueDate = isset($input['due_date']) ? $input['due_date'] : null;

    // Validate priority
    $validPriorities = ['Low', 'Medium', 'High', 'Critical'];
    if (!in_array($priority, $validPriorities)) {
        $priority = 'Medium';
    }

    // Generate UUID for the task
    $taskId = bin2hex(random_bytes(16));
    $taskId = substr($taskId, 0, 8) . '-' . substr($taskId, 8, 4) . '-' . substr($taskId, 12, 4) . '-' . substr($taskId, 16, 4) . '-' . substr($taskId, 20, 12);

    // Insert task
    $stmt = $pdo->prepare("
        INSERT INTO todo_tasks (id, title, description, priority, due_date, completed, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, false, NOW(), NOW())
    ");

    $stmt->execute([$taskId, $title, $description, $priority, $dueDate]);

    // Return the created task
    $stmt = $pdo->prepare("
        SELECT id, title as task, description, completed, created_at, due_date, priority
        FROM todo_tasks
        WHERE id = ?
    ");
    $stmt->execute([$taskId]);
    $task = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Task created successfully',
        'task' => $task
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to create task: ' . $e->getMessage()
    ]);
}

// Clean output and send
$output = ob_get_clean();
header('Content-Type: application/json');
echo $output;
?>
