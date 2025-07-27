<?php
// Toggle task completion endpoint
$data = Request::getBody();
$taskId = $data['taskId'] ?? Request::getParam('taskId');

if (!$taskId) {
    ApiResponse::error('Task ID is required');
}

try {
    $db = Database::getInstance()->getConnection();

    // Toggle the completion status
    $stmt = $db->prepare("UPDATE todo_tasks SET completed = NOT completed WHERE id = ?");
    $stmt->execute([$taskId]);

    if ($stmt->rowCount() === 0) {
        ApiResponse::error('Task not found', 404);
    }

    // Get updated task
    $stmt = $db->prepare("SELECT id, task, completed, created_at FROM todo_tasks WHERE id = ?");
    $stmt->execute([$taskId]);
    $task = $stmt->fetch();

    if ($task) {
        $task['completed'] = (bool) $task['completed'];
        ApiResponse::success($task, 'Task updated successfully');
    } else {
        ApiResponse::error('Task not found', 404);
    }

} catch (PDOException $e) {
    error_log("Toggle task error: " . $e->getMessage());
    ApiResponse::error('Failed to update task', 500);
}
?>
