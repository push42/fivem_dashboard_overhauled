<?php
try {
    $dsn = "pgsql:host=localhost;port=5432;dbname=fivem_dashboard";
    $pdo = new PDO($dsn, 'postgres', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Resetting admin password to 'admin123'...\n";

    $password = password_hash('admin123', PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("UPDATE staff_accounts SET password = ? WHERE username = 'admin'");
    $stmt->execute([$password]);

    echo "✅ Admin password reset successfully!\n";
    echo "Login credentials:\n";
    echo "Username: admin\n";
    echo "Password: admin123\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
