<?php
try {
    $dsn = "pgsql:host=localhost;port=5432;dbname=fivem_dashboard";
    $pdo = new PDO($dsn, 'postgres', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check staff accounts
    $stmt = $pdo->query("SELECT id, username, name, rank, is_active FROM staff_accounts ORDER BY created_at");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "Current staff accounts:\n";
    foreach ($users as $user) {
        echo "- {$user['username']} ({$user['name']}) - {$user['rank']} - " . ($user['is_active'] ? 'Active' : 'Inactive') . "\n";
    }

    // If no active users, create a test user
    if (empty($users)) {
        echo "\nCreating test user...\n";
        $password = password_hash('admin123', PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("
            INSERT INTO staff_accounts (username, password, name, rank, is_active)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute(['admin', $password, 'Admin User', 'Administrator', true]);

        echo "✅ Test user created:\n";
        echo "Username: admin\n";
        echo "Password: admin123\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
