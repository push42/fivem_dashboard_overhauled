<?php
require_once 'config/database.php';

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();

    echo "Checking chat_messages table constraints:\n";
    $stmt = $pdo->query("
        SELECT
            conname as constraint_name,
            pg_get_constraintdef(oid) as constraint_definition
        FROM pg_constraint
        WHERE conrelid = 'chat_messages'::regclass
    ");
    $constraints = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($constraints as $constraint) {
        echo "- {$constraint['constraint_name']}: {$constraint['constraint_definition']}\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
