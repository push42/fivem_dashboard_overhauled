<?php
// Modern todo tasks endpoint
try {
    $db = Database::getInstance()->getConnection();

    $stmt = $db->prepare("SELECT id, task, completed, created_at FROM todo_tasks ORDER BY created_at DESC");
    $stmt->execute();
    $tasks = $stmt->fetchAll();

    // Convert completed field to boolean
    foreach ($tasks as &$task) {
        $task['completed'] = (bool) $task['completed'];
    }

    ApiResponse::success(['tasks' => $tasks]);

} catch (PDOException $e) {
    error_log("Get tasks error: " . $e->getMessage());
    ApiResponse::error('Failed to fetch tasks', 500);
}
?>
