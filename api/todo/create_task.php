<?php
// Create new task endpoint
$data = Request::getBody();
$task = trim($data['task'] ?? '');

if (empty($task)) {
    ApiResponse::error('Task content is required');
}

try {
    $db = Database::getInstance()->getConnection();

    $stmt = $db->prepare("INSERT INTO todo_tasks (task, created_at) VALUES (?, NOW())");
    $stmt->execute([$task]);

    $taskId = $db->lastInsertId();

    ApiResponse::success([
        'id' => $taskId,
        'task' => $task,
        'completed' => false,
        'created_at' => date('Y-m-d H:i:s')
    ], 'Task created successfully');

} catch (PDOException $e) {
    error_log("Create task error: " . $e->getMessage());
    ApiResponse::error('Failed to create task', 500);
}
?>
