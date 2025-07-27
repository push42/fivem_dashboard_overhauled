<?php
// Delete task endpoint
$data = Request::getBody();
$taskId = $data['taskId'] ?? Request::getParam('taskId');

if (!$taskId) {
    ApiResponse::error('Task ID is required');
}

try {
    $db = Database::getInstance()->getConnection();

    $stmt = $db->prepare("DELETE FROM todo_tasks WHERE id = ?");
    $stmt->execute([$taskId]);

    if ($stmt->rowCount() === 0) {
        ApiResponse::error('Task not found', 404);
    }

    ApiResponse::success(null, 'Task deleted successfully');

} catch (PDOException $e) {
    error_log("Delete task error: " . $e->getMessage());
    ApiResponse::error('Failed to delete task', 500);
}
?>
